import Link from 'next/link';

export const dynamic = 'force-dynamic';

import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import EventCard from '@/components/EventCard';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

async function getDashboardData() {
    // Fetch latest economic indicators
    const [gdp, debt, inflation, debtGdp, exchangeRate, forexReserves, debtService, tradeBalance] = await Promise.all([
        prisma.economicData.findFirst({
            where: { indicator: 'GDP_GROWTH' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'TOTAL_DEBT' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'INFLATION_RATE' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'DEBT_TO_GDP_RATIO' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'EXCHANGE_RATE_USD' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'FOREX_RESERVES' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'DEBT_SERVICE_TO_REVENUE' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'TRADE_BALANCE' },
            orderBy: { date: 'desc' },
        }),
    ]);

    // Fetch latest 6 articles
    const articles = await prisma.article.findMany({
        take: 6,
        orderBy: { publishedAt: 'desc' },
        include: { category: true },
    });

    // Fetch upcoming events
    const upcomingEvents = await prisma.event.findMany({
        where: { startDate: { gte: new Date() } },
        take: 3,
        orderBy: { startDate: 'asc' },
    });

    // Fetch past events
    const pastEvents = await prisma.event.findMany({
        where: { startDate: { lt: new Date() } },
        take: 3,
        orderBy: { startDate: 'desc' },
    });

    // Fetch IMF records to calculate total disbursed
    const imfDisbursements = await prisma.economicData.findMany({
        where: { indicator: 'IMF_DISBURSEMENT' },
    });

    const totalIMF = 3000; // $3B total facility
    const disbursedIMF = imfDisbursements.reduce((sum, record) => sum + record.value, 0);
    const imfProgress = (disbursedIMF / totalIMF) * 100;

    // Calculate debt composition
    const debtMetadata = debt?.metadata as any;
    const domesticDebt = debtMetadata?.domestic || 0;
    const externalDebt = debtMetadata?.external || 0;
    const totalDebtValue = debt?.value || 0;
    const externalShare = totalDebtValue > 0 ? (externalDebt / totalDebtValue) * 100 : 0;

    return {
        stats: {
            gdpGrowth: gdp?.value ?? 0,
            totalDebt: debt?.value ?? 0,
            domesticDebt: domesticDebt,
            externalDebt: externalDebt,
            inflation: inflation?.value ?? 0,
            inflationChange: -2.1, // Calculated or simplified delta
            debtToGdp: debtGdp?.value ?? 0,
            exchangeRate: exchangeRate?.value ?? 0,
            forexReserves: forexReserves?.value ?? 0,
            imfDisbursed: disbursedIMF,
            imfTotal: totalIMF,
            imfProgress: imfProgress,
            externalShare: externalShare,
            debtService: debtService?.value ?? 0,
            tradeBalance: tradeBalance?.value ?? 0,
        },
        articles,
        upcomingEvents,
        pastEvents,
    };
}

const features = [
    {
        name: 'Public Debt Tracker',
        description: 'Deep dive into Ghana’s debt portfolio, sustainability analysis, and creditor breakdown with interactive visualizations.',
        link: '/dashboards/debt',
        cta: 'Analyze Debt Data',
        bgClass: 'bg-blue-600',
    },
    {
        name: 'IMF Bailout Monitor',
        description: 'Track the performance of the $3B Extended Credit Facility. Monitor disbursement schedules and structural benchmarks.',
        link: '/dashboards/imf',
        cta: 'Track IMF Progress',
        bgClass: 'bg-teal-500',
    },
    {
        name: 'Economy Dashboard',
        description: 'Comprehensive overview of Ghana’s key economic indicators including GDP, inflation, and exchange rates.',
        link: '/dashboards/economy',
        cta: 'View Dashboard',
        bgClass: 'bg-emerald-600',
    },
    {
        name: 'Resource Centre',
        description: 'Access a comprehensive digital library of policy papers, fiscal reports, and economic datasets for public scrutiny.',
        link: '/resources',
        cta: 'Browse Library',
        bgClass: 'bg-indigo-500',
    },
    {
        name: 'Programs',
        description: 'Participate in high-level policy dialogues and town hall meetings designed to foster inclusive economic governance.',
        link: '/programs',
        cta: 'View Programs',
        bgClass: 'bg-orange-500',
    },
];

import HomeEventsSection from '@/components/home/HomeEventsSection';
import AIAssistantButton from '@/components/home/AIAssistantButton';

export default async function HomePage() {
    const { stats, articles, upcomingEvents, pastEvents } = await getDashboardData();

    // Format helpers
    const formatCurrency = (val: number) => {
        if (val >= 1e9) return `GH₵ ${(val / 1e9).toFixed(1)}B`;
        return `GH₵ ${val.toLocaleString()}`;
    };

    return (
        <>
            <main className="min-h-screen bg-slate-50 overflow-x-hidden">
                {/* Hero Section */}
                <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/assets/videos/EGP-BANNER-1.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/50"></div>

                    {/* Abstract Shapes (Overlay on video) */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-500 blur-3xl opacity-10 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent-teal blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                    <div className="container relative z-10 text-center px-4 sm:px-6 lg:px-8">
                        <div className="animate-fade-in space-y-8 max-w-5xl mx-auto">
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
                                </span>
                                <span className="text-white text-sm font-medium tracking-wide">Tracking Ghana's Economic Recovery</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold font-heading text-white tracking-tight text-balance leading-tight drop-shadow-sm">
                                Transparency in <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-blue-300">Economic Governance</span>
                            </h1>

                            <p className="text-lg md:text-2xl text-blue-50 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-sm">
                                Access real-time data on Ghana's public debt, IMF program status, and economic indicators. Empowering citizens with data-driven insights.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
                                <Link
                                    href="/dashboards"
                                    className="w-full sm:w-auto px-6 py-3 bg-white text-primary-900 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Explore Dashboards
                                </Link>
                                <Link
                                    href="/about"
                                    className="w-full sm:w-auto px-6 py-3 bg-white/10 border-2 border-white/30 text-white font-semibold text-sm rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Wave Divider */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                        <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50"></path>
                        </svg>
                    </div>
                </div>

                {/* Quick Stats Section */}
                <section className="py-12 bg-slate-50 -mt-12 relative z-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* GDP Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">GDP Growth</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {stats.gdpGrowth.toFixed(1)}%
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    Projected 2025 Growth
                                </p>
                            </div>

                            {/* Debt Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Debt to GDP</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {stats.debtToGdp.toFixed(1)}%
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-red-500 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                                    Total: {formatCurrency(stats.totalDebt)}
                                </p>
                            </div>

                            {/* Inflation Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Inflation Rate</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {stats.inflation.toFixed(1)}%
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-green-600 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    Declining Trend
                                </p>
                            </div>

                            {/* Exchange Rate Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Exchange Rate</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {stats.exchangeRate.toFixed(2)}
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                                    GHS per USD
                                </p>
                            </div>

                            {/* IMF Progress Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">IMF Disbursed</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {stats.imfProgress.toFixed(0)}%
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-teal-600 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                                    ${(stats.imfDisbursed / 1000).toFixed(2)}B of ${(stats.imfTotal / 1000).toFixed(1)}B
                                </p>
                            </div>

                            {/* Forex Reserves Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Forex Reserves</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            ${stats.forexReserves.toFixed(1)}B
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-emerald-600 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                                    {(stats.forexReserves / 2.5).toFixed(1)} months of imports
                                </p>
                            </div>

                            {/* External Debt Share Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">External Debt</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {stats.externalShare.toFixed(1)}%
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                                    Share of Total Debt
                                </p>
                            </div>

                            {/* Debt Service Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Debt Service</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {stats.debtService.toFixed(1)}%
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className={`text-xs font-medium flex items-center ${stats.debtService > 50 ? 'text-red-600' : 'text-slate-500'}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${stats.debtService > 50 ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                                    of Revenue
                                </p>
                            </div>

                            {/* Total Public Debt Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Debt</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {formatCurrency(stats.totalDebt)}
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-rose-600 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                                    Public Debt Stock
                                </p>
                            </div>

                            {/* Domestic Debt Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Domestic Debt</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {formatCurrency(stats.domesticDebt)}
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-cyan-600 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></span>
                                    {stats.totalDebt > 0 ? ((stats.domesticDebt / stats.totalDebt) * 100).toFixed(1) : '0.0'}% of Total
                                </p>
                            </div>

                            {/* External Debt Value Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">External Debt</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {formatCurrency(stats.externalDebt)}
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sky-600 text-xs font-medium flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-sky-500 mr-2"></span>
                                    {stats.totalDebt > 0 ? ((stats.externalDebt / stats.totalDebt) * 100).toFixed(1) : '0.0'}% of Total
                                </p>
                            </div>

                            {/* Trade Balance Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Trade Balance</p>
                                        <h3 className="text-3xl font-bold text-slate-900">
                                            {Math.abs(stats.tradeBalance) >= 1000000000
                                                ? `$${(Math.abs(stats.tradeBalance) / 1000000000).toFixed(1)}B`
                                                : `$${(Math.abs(stats.tradeBalance) / 1000000).toFixed(1)}M`}
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </div>
                                </div>
                                <p className={`text-xs font-medium flex items-center ${stats.tradeBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${stats.tradeBalance < 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                    {stats.tradeBalance < 0 ? 'Trade Deficit' : 'Trade Surplus'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Premium Dark Theme */}
                <section className="py-24 bg-slate-900 relative overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] rounded-full bg-primary-900/50 blur-3xl opacity-30"></div>
                    <div className="absolute bottom-0 left-0 -ml-40 -mb-30 w-[600px] h-[600px] rounded-full bg-accent-teal/10 blur-3xl opacity-20"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="mb-20">

                            <h3 className="text-2xl md:text-3xl font-bold font-heading text-white mb-6 leading-tight">
                                Empowering Economic <br /> Governance through Data
                            </h3>
                            <p className="text-lg text-white leading-relaxed max-w-2xl">
                                We provide comprehensive tools to monitor fiscal performance, track debt sustainability, and hold governance accountable.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                            {features.map((feature, idx) => (
                                <div key={feature.name} className="group relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-white/10 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden flex flex-col h-full">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                                        <div className={`w-32 h-32 rounded-full ${feature.bgClass} blur-2xl`}></div>
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">

                                        <h3 className="text-xl font-bold text-white mb-3 font-heading">{feature.name}</h3>
                                        <p className="text-white leading-relaxed mb-6 text-base flex-grow">
                                            {feature.description}
                                        </p>

                                        <Link
                                            href={feature.link}
                                            className="inline-flex items-center text-white font-semibold group-hover:text-accent-teal transition-colors text-sm mt-auto"
                                        >
                                            {feature.cta}
                                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* AI Assistant Banner */}
                <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-800 relative overflow-hidden">
                    {/* <div className="absolute inset-0 bg-[url('/assets/patterns/grid.svg')] opacity-10"></div> */}
                    <div className="absolute inset-0 bg-primary-900/10 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
                            <div className="md:w-2/3">
                                <div className="inline-block px-3 py-1 rounded-full bg-accent-teal/20 border border-accent-teal/30 text-accent-teal font-semibold text-xs mb-3">
                                    New Feature
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-3 font-heading">
                                    Meet Your Economic Analyst
                                </h2>
                                <p className="text-blue-100 text-base leading-relaxed">
                                    Ask complex questions about Ghana's economy and get instant, data-backed answers powered by our advanced intelligence engine.
                                </p>
                            </div>
                            <div className="md:w-1/3 flex justify-center md:justify-end">
                                <AIAssistantButton />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Latest Articles Section */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-6">
                                    Latest Insights
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Expert analysis, policy briefs, and research papers on Ghana's changing economic landscape.
                                </p>
                            </div>
                            <Link href="/articles" className="group inline-flex items-center text-primary-700 font-bold text-sm hover:text-primary-900 transition-colors">
                                View All Publications
                                <div className="ml-3 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                    <svg className="w-4 h-4 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        </div>

                        {/* Modern Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    slug={article.slug}
                                    title={article.title}
                                    excerpt={article.excerpt}
                                    author={article.author}
                                    publishedAt={article.publishedAt}
                                    imageUrl={article.imageUrl}
                                    category={article.category}
                                    variant="standard"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Events Section */}
                <HomeEventsSection upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
            </main>
            <Footer />
        </>
    );
}
