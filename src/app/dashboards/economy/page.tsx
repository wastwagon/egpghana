import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

import Footer from '@/components/Footer';
import GDPGrowthChart from '@/components/charts/GDPGrowthChart';
import InflationChart from '@/components/charts/InflationChart';
import ExchangeRateChart from '@/components/charts/ExchangeRateChart';
import EconomicSummaryCards from '@/components/charts/EconomicSummaryCards';
import FiscalPerformanceSection from '@/components/dashboards/FiscalPerformanceSection';
import ExternalSectorSection from '@/components/dashboards/ExternalSectorSection';
import LaborMarketSection from '@/components/dashboards/LaborMarketSection';
import MonetaryPolicySection from '@/components/dashboards/MonetaryPolicySection';

const prisma = new PrismaClient();

export const metadata = {
    title: 'Economic Indicators | EGP Ghana',
    description: 'Track Ghana\'s key economic indicators including GDP, inflation, exchange rates, and more',
};

export default async function EconomyDashboardPage() {
    // Fetch latest indicators
    const latestGDP = await prisma.economicData.findFirst({
        where: { indicator: 'GDP_GROWTH' },
        orderBy: { date: 'desc' },
    });

    const latestInflation = await prisma.economicData.findFirst({
        where: { indicator: 'INFLATION_RATE' },
        orderBy: { date: 'desc' },
    });

    const latestExchangeRate = await prisma.economicData.findFirst({
        where: { indicator: 'EXCHANGE_RATE_USD' },
        orderBy: { date: 'desc' },
    });

    const latestUnemployment = await prisma.economicData.findFirst({
        where: { indicator: 'UNEMPLOYMENT_RATE' },
        orderBy: { date: 'desc' },
    });

    const latestTradeBalance = await prisma.economicData.findFirst({
        where: { indicator: 'TRADE_BALANCE' },
        orderBy: { date: 'desc' },
    });

    const latestForexReserves = await prisma.economicData.findFirst({
        where: { indicator: 'FOREX_RESERVES' },
        orderBy: { date: 'desc' },
    });

    // Fetch GDP growth data
    const gdpDataRaw = await prisma.economicData.findMany({
        where: { indicator: 'GDP_GROWTH' },
        orderBy: { date: 'desc' }, // Get latest
        take: 12, // Last 3 years
    });
    const gdpData = gdpDataRaw.reverse();

    const gdpChartData = gdpData.map((d) => {
        const meta = d.metadata as any;
        return {
            quarter: meta?.quarter || d.date.toISOString().split('T')[0],
            growth: d.value,
            agriculture: meta?.agriculture || 0,
            industry: meta?.industry || 0,
            services: meta?.services || 0,
        };
    });

    // Fetch inflation data
    const inflationDataRaw = await prisma.economicData.findMany({
        where: { indicator: 'INFLATION_RATE' },
        orderBy: { date: 'desc' },
        take: 24, // Last 2 years
    });
    const inflationData = inflationDataRaw.reverse();

    const inflationChartData = inflationData.map((d) => {
        const meta = d.metadata as any;
        const date = new Date(d.date);
        const month = date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

        return {
            month: month,
            inflation: d.value,
            policyRate: meta?.policyRate || d.value + 5,
            targetLow: 6,
            targetHigh: 10,
        };
    });

    // Fetch exchange rate data
    const exchangeRateDataRaw = await prisma.economicData.findMany({
        where: { indicator: 'EXCHANGE_RATE_USD' },
        orderBy: { date: 'desc' },
        take: 24, // Last 2 years
    });
    const exchangeRateData = exchangeRateDataRaw.reverse();

    const exchangeRateChartData = exchangeRateData.map((d, index) => {
        const date = new Date(d.date);
        const month = date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

        // Calculate change from previous month
        const prevRate = index > 0 ? exchangeRateData[index - 1].value : d.value;
        const change = ((d.value - prevRate) / prevRate) * 100;

        return {
            month: month,
            rate: d.value,
            change: change,
        };
    });

    // Prepare summary cards
    const indicators = [
        {
            title: 'GDP Growth',
            value: latestGDP?.value.toFixed(1) || '0.0',
            change: latestGDP?.value! >= 0 ? `+${latestGDP?.value.toFixed(1)}% YoY` : `${latestGDP?.value.toFixed(1)}% YoY`,
            changeType: (latestGDP?.value || 0) >= 0 ? 'positive' : 'negative',
            unit: '%',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
        {
            title: 'Inflation Rate',
            value: latestInflation?.value.toFixed(1) || '0.0',
            change: `${(latestInflation?.value || 0) > 10 ? 'Above' : 'Within'} target`,
            changeType: (latestInflation?.value || 0) > 10 ? 'negative' : 'positive',
            unit: '%',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Exchange Rate',
            value: latestExchangeRate?.value.toFixed(2) || '0.00',
            change: 'GHS per USD',
            changeType: 'neutral',
            unit: '',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
            ),
        },
        {
            title: 'Unemployment',
            value: latestUnemployment?.value.toFixed(1) || '0.0',
            change: 'of labor force',
            changeType: (latestUnemployment?.value || 0) < 5 ? 'positive' : 'negative',
            unit: '%',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            title: 'Trade Balance',
            value: (latestTradeBalance?.value || 0).toFixed(1),
            change: (latestTradeBalance?.value || 0) >= 0 ? 'Surplus' : 'Deficit',
            changeType: (latestTradeBalance?.value || 0) >= 0 ? 'positive' : 'negative',
            unit: 'B USD',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            title: 'Forex Reserves',
            value: (latestForexReserves?.value || 0).toFixed(1),
            change: (latestForexReserves?.metadata as any)?.monthsOfImports
                ? `${(latestForexReserves?.metadata as any).monthsOfImports} months of imports`
                : `${((latestForexReserves?.value || 0) / 2.5).toFixed(1)} months of imports`, // Approximate if metadata missing
            changeType: (latestForexReserves?.value || 0) >= 9 ? 'positive' : 'neutral',
            unit: 'B USD',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
    ] as any;

    return (
        <>
            <main className="min-h-screen bg-slate-50">
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
                                Ghana Economy Dashboard
                            </h1>

                            <div className="inline-flex flex-wrap justify-start items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-white/20 transition-all duration-300">
                                <span className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    Live Data: <span className="font-medium text-emerald-300">Updated Nov 2025</span>
                                </span>
                                <span className="hidden sm:block w-px h-4 bg-white/30"></span>
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                                    </svg>
                                    Source: <span className="font-medium text-white">Bank of Ghana & GSS</span>
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
                                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2 relative z-10">
                                    <span className="w-1 h-6 bg-primary-600 rounded-full block"></span>
                                    Dashboard Overview
                                </h3>
                                <p className="text-base text-black leading-relaxed text-left relative z-10">
                                    Comprehensive overview of Ghana's macroeconomic performance, featuring real-time tracking of GDP growth, inflation trends, exchange rate fluctuations, and other critical economic indicators to support data-driven analysis and policy dialogue.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="container py-8 md:py-12">
                    {/* Summary Cards */}
                    <div className="mb-12">
                        <EconomicSummaryCards indicators={indicators} />
                    </div>
                </div>

                {/* GDP Growth Chart - The "Engine" */}
                <section className="section py-8 md:py-12 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <div className="mb-8 md:mb-10 max-w-3xl">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">GDP Growth Analysis</h2>
                            <p className="text-black leading-relaxed">Quarterly economic performance broken down by major sectors (Agriculture, Industry, Services).</p>
                        </div>
                        {gdpChartData.length > 0 ? (
                            <GDPGrowthChart data={gdpChartData} />
                        ) : (
                            <div className="glass-card text-center py-12">
                                <p className="text-black">No GDP data available</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Inflation & Exchange Rate Charts - The "Stability" */}
                <section className="section py-8 md:py-12 bg-slate-50 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <div className="mb-8 md:mb-10 max-w-3xl">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Inflation & Exchange Rate Trends</h2>
                            <p className="text-black leading-relaxed">Monitoring price stability and currency performance against key policy targets.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {inflationChartData.length > 0 ? (
                                <InflationChart data={inflationChartData} />
                            ) : (
                                <div className="glass-card text-center py-12">
                                    <p className="text-black">No inflation data available</p>
                                </div>
                            )}
                            {exchangeRateChartData.length > 0 ? (
                                <ExchangeRateChart data={exchangeRateChartData} />
                            ) : (
                                <div className="glass-card text-center py-12">
                                    <p className="text-black">No exchange rate data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Fiscal Performance Dashboard */}
                <section className="section py-8 md:py-12 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <FiscalPerformanceSection />
                    </div>
                </section>

                {/* External Sector Dashboard */}
                <section className="section py-8 md:py-12 bg-slate-50 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <ExternalSectorSection />
                    </div>
                </section>

                {/* Labor Market Dashboard */}
                <section className="section py-8 md:py-12 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <LaborMarketSection />
                    </div>
                </section>

                {/* Monetary Policy Dashboard */}
                <section className="section py-8 md:py-12 bg-slate-50 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <MonetaryPolicySection />
                    </div>
                </section>

                {/* Key Insights - The "Takeaway" */}
                <section className="section bg-white py-8 md:py-12 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container max-w-4xl">
                        <div className="glass-card bg-white border border-slate-100 shadow-sm rounded-xl p-8">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-6 text-slate-900">Key Economic Insights</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 mt-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-black leading-relaxed">
                                        <strong className="text-slate-900">GDP Growth:</strong> Ghana's economy is showing {(latestGDP?.value || 0) >= 0 ? 'positive' : 'negative'} growth at {latestGDP?.value.toFixed(1)}%, driven by the services and agriculture sectors.
                                    </p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-600 mt-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-black leading-relaxed">
                                        <strong className="text-slate-900">Inflation:</strong> Current inflation rate of {latestInflation?.value.toFixed(1)}% remains {(latestInflation?.value || 0) > 10 ? 'above' : 'within'} the Bank of Ghana's target range of 6-10%.
                                    </p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-600 mt-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-black leading-relaxed">
                                        <strong className="text-slate-900">Exchange Rate:</strong> The cedi is trading at GH₵ {latestExchangeRate?.value.toFixed(2)} per USD, reflecting ongoing currency pressures.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
