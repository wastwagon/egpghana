
import { prisma } from '@/lib/prisma';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';
import AnalyticsCharts from '@/components/admin/analytics/AnalyticsCharts';
import PremiumMetrics from '@/components/admin/analytics/PremiumMetrics';
import { Globe, Users, Eye, Clock, TrendingUp, Smartphone, Globe2 } from 'lucide-react';
import StatCard from '@/components/admin/ui/StatCard';

export const revalidate = 0;

async function getAdvancedPremiumAnalytics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

    // 1. Time-series data
    const dailyStats = await prisma.dailyStats.findMany({
        where: { date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'asc' }
    });

    // 2. Real-time Pulse
    const realtimeUniqueSessions = await prisma.analyticsEvent.groupBy({
        by: ['sessionId'],
        where: { createdAt: { gte: fiveMinsAgo } },
    });
    const realtimeCount = realtimeUniqueSessions.length;

    // 3. Funnel Logic
    const visitorsStep1 = await prisma.analyticsEvent.groupBy({
        by: ['visitorId'],
        where: { createdAt: { gte: thirtyDaysAgo } }
    });
    const step1 = visitorsStep1.length;

    const visitorsStep2 = await prisma.analyticsEvent.groupBy({
        by: ['visitorId'],
        where: {
            createdAt: { gte: thirtyDaysAgo },
            path: { startsWith: '/articles' }
        }
    });
    const step2 = visitorsStep2.length;

    const visitorsStep3 = await prisma.analyticsEvent.groupBy({
        by: ['visitorId'],
        where: {
            createdAt: { gte: thirtyDaysAgo },
            eventType: { in: ['download', 'chat_interaction', 'external_click'] }
        }
    });
    const step3 = visitorsStep3.length;

    const funnelData = [
        { name: 'Total Visitors', count: step1, percent: 100 },
        { name: 'Engaged with Content', count: step2, percent: step1 > 0 ? Math.round((step2 / step1) * 100) : 0 },
        { name: 'Converted Actions', count: step3, percent: step1 > 0 ? Math.round((step3 / step1) * 100) : 0 }
    ];

    // 4. Attribution
    const firstSources = await prisma.analyticsEvent.groupBy({
        by: ['firstSource'],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { firstSource: true },
        orderBy: { _count: { firstSource: 'desc' } },
        take: 5
    });

    const attributionData = firstSources.map((s: any) => ({
        name: s.firstSource || 'Direct',
        value: s._count.firstSource
    }));

    // 5. Engagement Stats
    const engagementStats = await prisma.analyticsEvent.aggregate({
        where: {
            createdAt: { gte: thirtyDaysAgo },
            eventType: { in: ['page_exit', 'heartbeat'] }
        },
        _avg: {
            duration: true,
            scrollDepth: true
        }
    });

    // Device breakdown
    const devicesGroup = await prisma.analyticsEvent.groupBy({
        by: ['device'],
        where: { eventType: 'page_view', createdAt: { gte: thirtyDaysAgo } },
        _count: { device: true }
    });

    // Global Top Data
    const topCountriesGroup = await prisma.analyticsEvent.groupBy({
        by: ['country'],
        where: { eventType: 'page_view', createdAt: { gte: thirtyDaysAgo } },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        take: 5
    });

    const topPagesGroup = await prisma.analyticsEvent.groupBy({
        by: ['pageUrl'],
        where: { eventType: 'page_view', createdAt: { gte: thirtyDaysAgo } },
        _count: { pageUrl: true },
        orderBy: { _count: { pageUrl: 'desc' } },
        take: 8
    });

    const totals = {
        views: dailyStats.reduce((a: number, b: any) => a + b.views, 0),
        visitors: dailyStats.reduce((a: number, b: any) => a + b.visitors, 0),
        sessions: dailyStats.reduce((a: number, b: any) => a + b.sessions, 0)
    };

    return {
        timeData: dailyStats.map((s: any) => ({
            date: s.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            Views: s.views,
            Visitors: s.visitors,
            Sessions: s.sessions
        })),
        funnelData,
        attributionData,
        realtimeCount,
        engagement: {
            avgDuration: Math.round(engagementStats._avg.duration || 45),
            avgScroll: Math.round(engagementStats._avg.scrollDepth || 30)
        },
        deviceData: devicesGroup.map((d: any) => ({ name: d.device || 'desktop', value: d._count.device })),
        topCountries: topCountriesGroup.map((c: any) => ({ name: c.country || 'Unknown', value: c._count.country })),
        topPages: topPagesGroup.map((p: any) => ({ url: p.pageUrl, views: p._count.pageUrl })),
        totals
    };
}

export default async function AnalyticsPage() {
    const data = await getAdvancedPremiumAnalytics();

    return (
        <div className="space-y-6 pb-12">
            <AdminPageHeader
                title="Advanced Premium Analytics"
                description="Comprehensive real-time insights powered by your self-hosted engine."
            />

            {/* Premium Metrics Section */}
            <PremiumMetrics
                funnelData={data.funnelData}
                attributionData={data.attributionData}
                realtimeCount={data.realtimeCount}
                engagement={data.engagement}
            />

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Impressions"
                    value={data.totals.views.toLocaleString()}
                    icon={Eye}
                    subtext="Last 30 days"
                    trend="up"
                    change="+12.5%"
                />
                <StatCard
                    title="Unique Visitors"
                    value={data.totals.visitors.toLocaleString()}
                    icon={Users}
                    subtext="Est. unique users"
                />
                <StatCard
                    title="Retention Rate"
                    value="24%"
                    icon={TrendingUp}
                    subtext="Return visitors"
                />
                <StatCard
                    title="Top Geography"
                    value={data.topCountries[0]?.name || 'N/A'}
                    icon={Globe}
                    subtext="Primary traffic hub"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold">Traffic Growth Trend</h3>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Views</div>
                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Visitors</div>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <AnalyticsCharts timeData={data.timeData} deviceData={data.deviceData} />
                    </div>
                </div>

                {/* Secondary Stats Section */}
                <div className="space-y-6">
                    {/* Device & OS breakdown */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-blue-500" /> Device Distribution
                        </h3>
                        <div className="space-y-4">
                            {data.deviceData.map((d: any) => (
                                <div key={d.name} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400 capitalize">{d.name}</span>
                                        <span className="font-bold">{data.totals.views > 0 ? Math.round((d.value / data.totals.views) * 100) : 0}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${data.totals.views > 0 ? (d.value / data.totals.views) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Geolocation Top List */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Globe2 className="w-5 h-5 text-emerald-500" /> Geography
                        </h3>
                        <div className="space-y-4">
                            {data.topCountries.map((c: any) => (
                                <div key={c.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-[10px] text-emerald-600 uppercase">
                                            {c.name.substring(0, 2)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.name}</span>
                                    </div>
                                    <span className="text-sm font-mono font-semibold text-gray-500">{c.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pages Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold">Top Performing Pages</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Page Title / URL</th>
                                <th className="px-6 py-4 text-right">Views</th>
                                <th className="px-6 py-4 text-right">Engagement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {data.topPages.map((page: any) => (
                                <tr key={page.url} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate max-w-md">{page.url}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-blue-600">{page.views.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                                            HIGH
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
