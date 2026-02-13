import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function importData() {
    console.log('📥 Importing data to production...');

    const data = JSON.parse(fs.readFileSync('./scripts/local_data_export.json', 'utf-8'));

    // Clear existing data
    console.log('🗑️ Clearing old data...');
    await prisma.economicData.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.staff.deleteMany({});

    // Import articles
    console.log(`📰 Importing ${data.articles.length} articles...`);

    // Get categories to map slugs to IDs
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

    for (const article of data.articles) {
        const { categorySlug, ...articleData } = article;
        const categoryId = categoryMap.get(categorySlug) || categoryMap.get('news');

        if (!categoryId) {
            console.warn(`⚠️ skipping article "${article.title}" - category slug "${categorySlug}" not found on server`);
            continue;
        }

        await prisma.article.create({
            data: {
                ...articleData,
                categoryId,
                publishedAt: new Date(article.publishedAt)
            }
        });
    }

    // Import events
    console.log(`📅 Importing ${data.events.length} events...`);
    for (const event of data.events) {
        await prisma.event.create({
            data: {
                ...event,
                startDate: new Date(event.startDate),
                endDate: event.endDate ? new Date(event.endDate) : null
            }
        });
    }

    // Import economic data
    console.log(`💹 Importing ${data.economicData.length} economic data points...`);
    for (const econ of data.economicData) {
        await prisma.economicData.create({
            data: {
                ...econ,
                date: new Date(econ.date)
            }
        });
    }

    // Import staff
    if (data.staff) {
        console.log(`👥 Importing ${data.staff.length} staff members...`);
        for (const s of data.staff) {
            await prisma.staff.create({
                data: {
                    ...s,
                    active: true
                }
            });
        }
    }

    console.log('✅ ALL DATA IMPORTED SUCCESSFULLY!');
    await prisma.$disconnect();
}

importData();
