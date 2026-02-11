
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Premium Analytics Data...');

    // Clear existing analytics data to start fresh
    await prisma.analyticsEvent.deleteMany({});
    await prisma.dailyStats.deleteMany({});

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const sources = ['google', 'twitter', 'linkedin', 'newsletter', 'direct'];
    const countries = ['Ghana', 'United Kingdom', 'United States', 'Germany', 'Nigeria'];
    const devices = ['desktop', 'mobile', 'tablet'];
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
    const paths = ['/', '/articles', '/articles/imf-bailout-update', '/resources', '/events'];

    // Generate Daily Stats for the last 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        date.setUTCHours(0, 0, 0, 0);

        const views = Math.floor(Math.random() * 500) + 100;
        const visitors = Math.floor(views * 0.7);
        const sessions = Math.floor(visitors * 1.2);

        await prisma.dailyStats.create({
            data: {
                date,
                views,
                visitors,
                sessions
            }
        });

        // Generate some sample events for each day to fill the premium charts
        // We'll generate about 20 events per day to show the "Premium" features
        for (let j = 0; j < 20; j++) {
            const visitorId = `v_${Math.floor(Math.random() * 1000)}`;
            const sessionId = `s_${Math.floor(Math.random() * 5000)}`;
            const country = countries[Math.floor(Math.random() * countries.length)];
            const device = devices[Math.floor(Math.random() * devices.length)];
            const firstSource = sources[Math.floor(Math.random() * sources.length)];
            const path = paths[Math.floor(Math.random() * paths.length)];

            // Random event type distribution
            const rand = Math.random();
            let eventType = 'page_view';
            let duration = null;
            let scrollDepth = null;

            if (rand > 0.8) eventType = 'download';
            else if (rand > 0.7) eventType = 'external_click';
            else if (rand > 0.6) {
                eventType = 'page_exit';
                duration = Math.floor(Math.random() * 300) + 30;
                scrollDepth = Math.floor(Math.random() * 100);
            }

            await prisma.analyticsEvent.create({
                data: {
                    eventType,
                    pageUrl: `https://egp-ghana.org${path}`,
                    path,
                    country,
                    device,
                    browser: browsers[Math.floor(Math.random() * browsers.length)],
                    os: 'macOS',
                    source: firstSource,
                    firstSource,
                    visitorId,
                    sessionId,
                    duration,
                    scrollDepth,
                    createdAt: date
                }
            });
        }
    }

    // Generate Real-time pulse data (last 5 mins)
    for (let k = 0; k < 12; k++) {
        await prisma.analyticsEvent.create({
            data: {
                eventType: 'page_view',
                pageUrl: 'https://egp-ghana.org/',
                path: '/',
                country: 'Ghana',
                device: 'desktop',
                visitorId: `live_v_${k}`,
                sessionId: `live_s_${k}`,
                createdAt: new Date()
            }
        });
    }

    console.log('✅ Analytics Seeded Successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
