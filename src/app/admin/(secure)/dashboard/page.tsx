
import { prisma } from '@/lib/prisma';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

async function getAdminDashboardStats() {
    const articleCount = await prisma.article.count();
    const eventCount = await prisma.event.count();
    const resourceCount = await prisma.resource.count();
    const userCount = await prisma.user.count();

    const recentArticles = await prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

    const dailyStats = await prisma.dailyStats.findMany({
        where: { date: { gte: sevenDaysAgo } },
        orderBy: { date: 'asc' }
    });

    const realtimeUniqueSessions = await prisma.analyticsEvent.groupBy({
        by: ['sessionId'],
        where: { createdAt: { gte: fiveMinsAgo } },
    });

    const devices = await prisma.analyticsEvent.groupBy({
        by: ['device'],
        where: { eventType: 'page_view', createdAt: { gte: sevenDaysAgo } },
        _count: { device: true }
    });

    const analyticsData = {
        visitData: dailyStats.map((s: any) => ({
            name: s.date.toLocaleDateString('en-US', { weekday: 'short' }),
            visits: s.sessions,
            pageviews: s.views
        })),
        deviceData: devices.map((d: any) => ({
            name: d.device ? d.device.charAt(0).toUpperCase() + d.device.slice(1) : 'Desktop',
            value: d._count.device
        })),
        realtimeCount: realtimeUniqueSessions.length
    };

    return {
        stats: { articleCount, eventCount, resourceCount, userCount },
        recentArticles,
        analyticsData
    };
}

export const revalidate = 0;

export default async function AdminDashboardPage() {
    const { stats, recentArticles, analyticsData } = await getAdminDashboardStats();

    return (
        <AnalyticsDashboard
            stats={stats}
            recentArticles={recentArticles}
            analyticsData={analyticsData}
        />
    );
}
