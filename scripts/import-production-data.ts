import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function importData() {
    console.log('📥 Importing data to production...');

    const data = JSON.parse(fs.readFileSync('/tmp/local_data_export.json', 'utf-8'));

    // Clear existing data
    console.log('🗑️ Clearing old data...');
    await prisma.economicData.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.event.deleteMany({});

    // Import articles
    console.log(`📰 Importing ${data.articles.length} articles...`);
    for (const article of data.articles) {
        await prisma.article.create({
            data: {
                ...article,
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

    console.log('✅ ALL DATA IMPORTED SUCCESSFULLY!');
    await prisma.$disconnect();
}

importData();
