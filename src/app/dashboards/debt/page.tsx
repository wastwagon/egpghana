import { PrismaClient } from '@prisma/client';

import Footer from '@/components/Footer';
import StatCard from '@/components/StatCard';
import DebtOverviewChart from '@/components/charts/DebtOverviewChart';
import DebtCompositionChart from '@/components/charts/DebtCompositionChart';
import DebtToGDPChart from '@/components/charts/DebtToGDPChart';
import DebtBreakdownChart from '@/components/charts/DebtBreakdownChart';
import DebtServiceChart from '@/components/charts/DebtServiceChart';
import RiskAssessmentSection from '@/components/dashboards/RiskAssessmentSection';
import IndicatorsGrid from '@/components/dashboards/IndicatorsGrid';
import HistoricalDebtAnalyzer from '@/components/dashboards/HistoricalDebtAnalyzer';
import DebtRestructuringJourney from '@/components/dashboards/DebtRestructuringJourney';

const prisma = new PrismaClient();

export const metadata = {
    title: 'Public Debt Tracker | EGP Ghana',
    description: 'Real-time monitoring and analysis of Ghana\'s public debt portfolio',
};

export default async function DebtDashboardPage() {
    // Fetch latest debt data
    const latestDebtData = await prisma.economicData.findFirst({
        where: { indicator: 'TOTAL_DEBT' },
        orderBy: { date: 'desc' },
    });

    const totalDebt = latestDebtData?.value || 644600000000;
    const metadata = latestDebtData?.metadata as any;
    const domesticDebt = metadata?.domestic || 314400000000;
    const externalDebt = metadata?.external || 330200000000;

    // Fetch debt overview data (monthly totals)
    const debtOverviewDataRaw = await prisma.economicData.findMany({
        where: { indicator: 'TOTAL_DEBT' },
        orderBy: { date: 'desc' },
        take: 24, // Last 2 years
    });
    const debtOverviewData = debtOverviewDataRaw.reverse();

    const overviewChartData = debtOverviewData.map((d) => {
        const meta = d.metadata as any;
        return {
            date: d.date.toISOString().split('T')[0],
            total: d.value,
            domestic: meta?.domestic || 0,
            external: meta?.external || 0,
        };
    });

    // Fetch debt-to-GDP ratio data
    const debtToGDPDataRaw = await prisma.economicData.findMany({
        where: { indicator: 'DEBT_TO_GDP_RATIO' },
        orderBy: { date: 'desc' },
        take: 12, // Last 3 years
    });
    const debtToGDPData = debtToGDPDataRaw.reverse();

    const gdpChartData = debtToGDPData.map((d) => ({
        date: d.date.toISOString().split('T')[0],
        ratio: d.value,
    }));

    // Fetch debt service data
    const debtServiceDataRaw = await prisma.economicData.findMany({
        where: { indicator: 'DEBT_SERVICE_TO_REVENUE' },
        orderBy: { date: 'desc' },
        take: 5,
    });
    const debtServiceData = debtServiceDataRaw.reverse();

    const serviceChartData = debtServiceData.map((d) => ({
        year: d.date.getFullYear().toString(),
        ratio: d.value,
    }));

    // Fetch latest creditor breakdown date
    const latestCreditorRecord = await prisma.economicData.findFirst({
        where: { indicator: 'DEBT_BY_CREDITOR' },
        orderBy: { date: 'desc' },
        select: { date: true }
    });

    let creditorData: any[] = [];
    if (latestCreditorRecord) {
        const startOfDay = new Date(latestCreditorRecord.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(latestCreditorRecord.date);
        endOfDay.setHours(23, 59, 59, 999);

        creditorData = await prisma.economicData.findMany({
            where: {
                indicator: 'DEBT_BY_CREDITOR',
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            orderBy: { value: 'desc' },
        });
    }

    const creditorChartData = creditorData.map((d) => {
        const meta = d.metadata as any;
        return {
            creditor: meta?.creditor || 'Unknown',
            amount: d.value,
            type: meta?.type || 'Other',
            color: meta?.color as string,
        };
    });

    const formatCurrency = (value: number) => {
        return `GH₵ ${(value / 1000000000).toFixed(1)}B`;
    };

    const formatDateShort = (date: Date) => {
        return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    };

    const latestDateStr = latestDebtData ? formatDateShort(latestDebtData.date) : 'Nov 2025';

    // Calculate date ranges
    const overviewStart = debtOverviewData.length > 0 ? formatDateShort(debtOverviewData[0].date) : '2019';
    const overviewEnd = debtOverviewData.length > 0 ? formatDateShort(debtOverviewData[debtOverviewData.length - 1].date) : '2025';
    const overviewRange = `${overviewStart} - ${overviewEnd}`;

    const gdpStart = debtToGDPData.length > 0 ? new Date(debtToGDPData[0].date).getFullYear() : '2019';
    const gdpEnd = debtToGDPData.length > 0 ? new Date(debtToGDPData[debtToGDPData.length - 1].date).getFullYear() : '2025';
    const gdpRange = `${gdpStart} - ${gdpEnd}`;

    const serviceStart = debtServiceData.length > 0 ? new Date(debtServiceData[0].date).getFullYear() : '2019';
    const serviceEnd = debtServiceData.length > 0 ? new Date(debtServiceData[debtServiceData.length - 1].date).getFullYear() : '2025';
    const serviceRange = `${serviceStart} - ${serviceEnd}`;

    const latestGDPRatio = debtToGDPData[debtToGDPData.length - 1]?.value || 45.5;
    const latestServiceRatio = debtServiceData[debtServiceData.length - 1]?.value || 48.0;

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                {/* Hero Section */}
                <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/assets/videos/EGP-BANNER-1.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="container relative z-10 text-left">
                        <div className="max-w-4xl mr-auto">
                            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold mb-6 tracking-wide uppercase">
                                Economic Governance Platform
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight leading-tight">
                                Ghana Public Debt Dashboard
                            </h1>

                            <div className="inline-flex flex-wrap justify-start items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-white/20 transition-all duration-300">
                                <span className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    Data Source: <span className="font-medium text-emerald-300">Ministry of Finance (Nov 2025)</span>
                                </span>
                                <span className="hidden sm:block w-px h-4 bg-white/30"></span>
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Report Date: <span className="font-medium text-white">February 7, 2026</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Introductory Text Section */}
                <section className="bg-white py-12 border-b border-slate-100">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-blue-50/50 rounded-2xl p-6 md:p-8 border border-blue-100/50 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <svg className="w-32 h-32 text-primary-900" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2 relative z-10">
                                    <span className="w-1 h-6 bg-primary-600 rounded-full block"></span>
                                    About This Dashboard
                                </h3>
                                <p className="text-base text-black leading-relaxed text-left relative z-10">
                                    National debt can have significant economic and social effects, including higher interest payments, reduced fiscal sustainability, and austerity measures. To manage national debt effectively, governments need to exercise fiscal discipline, reduce debt levels through measures such as increased revenue and spending cuts, promote economic growth, explore debt refinancing options, and maintain transparency and accountability in fiscal management practices. By implementing these strategies, governments can mitigate the adverse effects of national debt and promote long-term economic stability.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Cards */}
                <section className="section pb-8 md:pb-12" style={{ paddingBottom: '3rem' }}>
                    <div className="container">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Public Debt"
                                value={formatCurrency(totalDebt)}
                                change="+15.4%"
                                changeType="negative"
                                description="Debt per capita: GH₵ 21,061"
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Debt-to-GDP"
                                value={`${latestGDPRatio.toFixed(1)}%`}
                                change={latestGDPRatio > 70 ? 'High Risk' : 'Moderate'}
                                changeType={latestGDPRatio > 70 ? 'negative' : 'positive'}
                                description={`Sustainability • ${latestDateStr}`}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="External Share"
                                value={`${((externalDebt / totalDebt) * 100).toFixed(1)}%`}
                                change="of total debt"
                                changeType="neutral"
                                description={`Values as of ${latestDateStr}`}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Debt Service"
                                value={`${latestServiceRatio.toFixed(1)}%`}
                                change="of revenue"
                                changeType={latestServiceRatio > 50 ? 'negative' : 'neutral'}
                                description={`Fiscal Year ${new Date().getFullYear()}`}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* Historical Analyzer - The "History" */}
                <div className="section container py-8 -mt-8 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <HistoricalDebtAnalyzer />
                </div>

                {/* Key Economic Indicators Full Grid - The "Present" */}
                <section className="section bg-slate-50 border-t border-slate-100">
                    <IndicatorsGrid />
                </section>

                {/* Debt Overview Chart - The "Trend" */}
                <section className="section py-8 md:py-12 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <div className="mb-8 md:mb-10 max-w-3xl">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Debt Trajectory Analysis</h2>
                            <p className="text-black leading-relaxed">
                                Historical trend of total public debt showing the evolution of domestic and external obligations over time.
                            </p>
                        </div>
                        {overviewChartData.length > 0 ? (
                            <DebtOverviewChart data={overviewChartData} lastUpdated={overviewRange} />
                        ) : (
                            <div className="glass-card text-center py-12">
                                <p className="text-black">No debt overview data available</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Composition and Ratios - The "Makeup" */}
                <section className="section py-8 md:py-12 bg-slate-50 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <div className="mb-8 md:mb-10 max-w-3xl">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Portfolio Composition & Ratios</h2>
                            <p className="text-black leading-relaxed">
                                Breakdown of debt by currency and Debt-to-GDP sustainability indicators.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DebtCompositionChart domesticDebt={domesticDebt} externalDebt={externalDebt} lastUpdated={latestDateStr} />
                            {gdpChartData.length > 0 ? (
                                <DebtToGDPChart data={gdpChartData} lastUpdated={gdpRange} />
                            ) : (
                                <div className="glass-card text-center py-12">
                                    <p className="text-black">No debt-to-GDP data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Granular Debt Breakdown - The "Details" */}
                <section className="section py-8 md:py-12 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <div className="mb-8 md:mb-10 max-w-3xl">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Creditor & Instrument Breakdown</h2>
                            <p className="text-black leading-relaxed">
                                Detailed analysis of major creditors and domestic debt instruments.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DebtBreakdownChart
                                title="External Debt Composition"
                                totalValue={`${(externalDebt / 1e9).toFixed(1)}B`}
                                data={creditorChartData
                                    .filter(c => ['External', 'Multilateral', 'Bilateral', 'Commercial'].includes(c.type))
                                    .map(c => ({
                                        name: c.creditor,
                                        value: c.amount,
                                        color: c.color || '#1a365d'
                                    }))}
                            />
                            <DebtBreakdownChart
                                title="Domestic Debt Instrument"
                                totalValue={`${(domesticDebt / 1e9).toFixed(1)}B`}
                                data={creditorChartData
                                    .filter(c => c.type === 'Domestic')
                                    .map(c => ({
                                        name: c.creditor,
                                        value: c.amount,
                                        color: c.color || '#1a365d'
                                    }))}
                            />
                        </div>
                    </div>
                </section>

                {/* Risk Assessment - The "Analysis" */}
                <section className="bg-slate-50 border-t border-slate-100">
                    <RiskAssessmentSection />
                </section>

                {/* Restructuring Journey - The "Story" */}
                <div className="container pb-12 pt-12">
                    <DebtRestructuringJourney />
                </div>
            </main>
            <Footer />
        </>
    );
}
