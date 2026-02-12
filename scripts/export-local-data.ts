import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
    console.log('📤 Exporting local database data...');

    // Get all articles
    const articles = await prisma.article.findMany({
        orderBy: { publishedAt: 'desc' }
    });

    // Get all events
    const events = await prisma.event.findMany({
        orderBy: { startDate: 'desc' }
    });

    // Get latest economic data (last 12 months of each indicator)
    const economicData = await prisma.economicData.findMany({
        orderBy: { date: 'desc' },
        take: 200 // Get enough data
    });

    const exportData = {
        articles: articles.map(a => ({
            title: a.title,
            slug: a.slug,
            excerpt: a.excerpt,
            content: a.content,
            imageUrl: a.imageUrl,
            author: a.author,
            categoryId: a.categoryId,
            tags: a.tags,
            publishedAt: a.publishedAt,
            featured: a.featured
        })),
        events: events.map(e => ({
            title: e.title,
            slug: e.slug,
            description: e.description,
            location: e.location,
            startDate: e.startDate,
            endDate: e.endDate,
            featured: e.featured
        })),
        economicData: economicData.map(d => ({
            indicator: d.indicator,
            value: d.value,
            date: d.date,
            source: d.source,
            unit: d.unit,
            metadata: d.metadata
        }))
    };

    fs.writeFileSync(
        '/tmp/local_data_export.json',
        JSON.stringify(exportData, null, 2)
    );

    console.log('✅ Data exported to /tmp/local_data_export.json');
    console.log(`📊 Articles: ${articles.length}`);
    console.log(`📅 Events: ${events.length}`);
    console.log(`💹 Economic Data: ${economicData.length}`);

    await prisma.$disconnect();
}

exportData();
