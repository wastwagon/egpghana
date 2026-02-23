/**
 * Sync articles and events from local_data_export.json into the database.
 * MERGES (upserts) - does NOT delete existing content. Use this to push
 * local content to production without wiping production-only posts.
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Resolve path: works when run from project root or from scripts/
const dataFilePath = fs.existsSync(path.join(__dirname, 'local_data_export.json'))
    ? path.join(__dirname, 'local_data_export.json')
    : path.join(process.cwd(), 'scripts', 'local_data_export.json');

async function main() {
    if (!fs.existsSync(dataFilePath)) {
        console.error('❌ local_data_export.json not found.');
        console.error('   Run "npm run export:data" locally, COMMIT the file, deploy, then run Sync.');
        process.exit(1);
    }

    const exportedData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

    console.log('🔄 Syncing articles (upsert by slug)...');
    let added = 0;
    let updated = 0;

    for (const article of exportedData.articles) {
        const { categorySlug, ...articleData } = article;
        const categoryId = categoryMap.get(categorySlug) || categoryMap.get('news');
        if (!categoryId) {
            console.warn(`⚠️ Skipping "${article.title}" - category "${categorySlug}" not found`);
            continue;
        }

        const data = {
            ...articleData,
            categoryId,
            publishedAt: new Date(article.publishedAt),
        };

        const existing = await prisma.article.findUnique({ where: { slug: article.slug } });
        if (existing) {
            await prisma.article.update({
                where: { slug: article.slug },
                data: { ...data, views: existing.views },
            });
            updated++;
        } else {
            await prisma.article.create({ data });
            added++;
        }
    }

    console.log(`   ✅ Articles: ${added} added, ${updated} updated`);

    console.log('🔄 Syncing events (upsert by slug)...');
    added = 0;
    updated = 0;

    for (const event of exportedData.events) {
        const data = {
            ...event,
            startDate: new Date(event.startDate),
            endDate: event.endDate ? new Date(event.endDate) : null,
        };

        const existing = await prisma.event.findUnique({ where: { slug: event.slug } });
        if (existing) {
            await prisma.event.update({
                where: { slug: event.slug },
                data,
            });
            updated++;
        } else {
            await prisma.event.create({ data });
            added++;
        }
    }

    console.log(`   ✅ Events: ${added} added, ${updated} updated`);

    console.log('🔄 Syncing economic data (replace all - dashboards need this)...');
    await prisma.economicData.deleteMany({});
    for (const econ of exportedData.economicData) {
        await prisma.economicData.create({
            data: { ...econ, date: new Date(econ.date) },
        });
    }
    console.log(`   ✅ Economic data: ${exportedData.economicData.length} records`);

    console.log('✨ Sync completed!');
}

main()
    .catch((e) => {
        console.error('❌ Sync error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
