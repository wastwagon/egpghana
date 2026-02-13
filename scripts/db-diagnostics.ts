import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DATABASE DIAGNOSTICS ---');

    const articleCount = await prisma.article.count();
    const eventCount = await prisma.event.count();
    const economicCount = await prisma.economicData.count();
    const staffCount = await prisma.staff.count();
    const categoryCount = await prisma.category.count();
    const programCount = await prisma.program.count();

    console.log(`Articles: ${articleCount}`);
    console.log(`Events: ${eventCount}`);
    console.log(`Economic Data: ${economicCount}`);
    console.log(`Staff: ${staffCount}`);
    console.log(`Categories: ${categoryCount}`);
    console.log(`Programs: ${programCount}`);

    console.log('\n--- LATEST ARTICLES ---');
    const articles = await prisma.article.findMany({
        take: 3,
        orderBy: { publishedAt: 'desc' },
        select: { title: true, publishedAt: true }
    });
    articles.forEach(a => console.log(`- [${a.publishedAt.toISOString().split('T')[0]}] ${a.title}`));

    console.log('\n--- UPCOMING EVENTS (Future or Today) ---');
    const now = new Date();
    // Reset hours to start of today for "upcoming" comparison
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const upcomingEvents = await prisma.event.findMany({
        where: { startDate: { gte: startOfToday } },
        orderBy: { startDate: 'asc' },
        select: { title: true, startDate: true }
    });
    upcomingEvents.forEach(e => console.log(`- [${e.startDate.toISOString()}] ${e.title}`));
    if (upcomingEvents.length === 0) {
        console.log('(None found)');
        const allEvents = await prisma.event.findMany({ take: 3, orderBy: { startDate: 'desc' }, select: { title: true, startDate: true } });
        console.log('Last 3 events in DB:');
        allEvents.forEach(e => console.log(`- [${e.startDate.toISOString()}] ${e.title}`));
    }

    console.log('\n--- ALL INDICATORS ---');
    const allIndicators = await prisma.economicData.groupBy({
        by: ['indicator'],
        _count: { id: true },
        _max: { date: true }
    });
    allIndicators.forEach(i => console.log(`- ${i.indicator}: ${i._count.id} records (Latest: ${i._max.date?.toISOString().split('T')[0]})`));

    await prisma.$disconnect();
}

main().catch(console.error);
