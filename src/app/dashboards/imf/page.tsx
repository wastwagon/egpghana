import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

import Footer from '@/components/Footer';
import StatCard from '@/components/StatCard';
import ProgramTimelineChart from '@/components/charts/ProgramTimelineChart';
import DisbursementScheduleChart from '@/components/charts/DisbursementScheduleChart';
import ConditionalityTracker from '@/components/charts/ConditionalityTracker';
import StatusProgressBar from '@/components/dashboards/StatusProgressBar';
import ExecutiveSummary from '@/components/dashboards/ExecutiveSummary';
import MacroTrendsChart from '@/components/charts/MacroTrendsChart';
import KeyEconomicIndices from '@/components/dashboards/KeyEconomicIndices';
import ProgrammeReviews from '@/components/dashboards/ProgrammeReviews';
import KeyConditions from '@/components/dashboards/KeyConditions';
import PathToCrisis from '@/components/dashboards/PathToCrisis';


export const metadata = {
    title: 'IMF Bailout Monitor | EGP Ghana',
    description: 'Track Ghana\'s IMF Extended Credit Facility program implementation and compliance',
};

export default async function IMFDashboardPage() {

    // Fetch Disbursement Data from DB
    const disbursementDataDB = await prisma.economicData.findMany({
        where: { indicator: 'IMF_DISBURSEMENT' },
        orderBy: { date: 'asc' },
    });

    const disbursementDataRaw = disbursementDataDB.map((d) => {
        const meta = d.metadata as any;
        return {
            date: d.date.toISOString().split('T')[0],
            amount: d.value, // USD Millions
            sdr: meta?.sdr || 0,
            status: meta?.status || 'Pending',
            quarter: meta?.quarter || '',
            type: meta?.type || '',
        };
    });

    // Transform for Recharts
    let runningTotalSDR = 0;
    let runningTotalUSD = 0;

    const disbursementChartData = disbursementDataRaw.map(item => {
        runningTotalSDR += item.sdr * 1000000;
        runningTotalUSD += item.amount * 1000000;

        return {
            quarter: item.quarter,
            plannedSDR: item.sdr * 1000000,
            actualSDR: item.status === 'Completed' ? item.sdr * 1000000 : 0,
            cumulativeSDR: runningTotalSDR,
            plannedUSD: item.amount * 1000000,
            actualUSD: item.status === 'Completed' ? item.amount * 1000000 : 0,
            cumulativeUSD: runningTotalUSD,
        };
    });


    // Calculate Totals dynamically
    const totalAmount = disbursementDataRaw.reduce((sum, item) => sum + (item.sdr * 1000000), 0);
    const disbursedAmount = disbursementDataRaw
        .filter(item => item.status === 'Completed')
        .reduce((sum, item) => sum + (item.sdr * 1000000), 0);
    const remainingAmount = totalAmount - disbursedAmount;


    // Fetch milestones
    const milestoneData = await prisma.economicData.findMany({
        where: { indicator: 'IMF_MILESTONE' },
        orderBy: { date: 'asc' },
    });

    const milestones = milestoneData.map((m) => {
        const meta = m.metadata as any;
        return {
            date: m.date.toISOString().split('T')[0],
            title: meta?.title || 'Milestone',
            description: meta?.description || '',
            status: meta?.status || 'pending',
            type: meta?.type || 'review',
        };
    });

    // Fetch conditionalities from DB
    const conditionalityData = await prisma.economicData.findMany({
        where: { indicator: 'IMF_CONDITIONALITY' },
        orderBy: { date: 'asc' }, // Or by ID if you want specific order
    });

    // Validating types with fallback
    const realConditionalities = conditionalityData.map(c => {
        const meta = c.metadata as any;
        return {
            id: meta?.id || c.id,
            title: meta?.title || 'Conditionality',
            category: meta?.category || 'General',
            status: meta?.status || 'Pending',
            deadline: c.date.toISOString().split('T')[0],
            description: meta?.description || '',
            verificationNote: meta?.verificationNote || '',
            sourceLink: meta?.sourceLink || '#',
            sourceTitle: meta?.sourceTitle || '',
            target: meta?.target,
            actual: meta?.actual,
            unit: meta?.unit
        };
    });

    const conditionalities = realConditionalities;

    const formatSDR = (value: number) => {
        return `SDR ${(value / 1000000000).toFixed(1)}B`;
    };

    const formatGHS = (value: number, exchangeRate: number = 10.99) => {
        const ghs = value * exchangeRate;
        return `GH₵ ${(ghs / 1000000000).toFixed(1)}B`;
    };

    // Calculate status counts for the progress bar
    const statusCounts = {
        met: conditionalities.filter(c => c.status === 'Met').length,
        inProgress: conditionalities.filter(c => c.status === 'In Progress').length,
        notMet: conditionalities.filter(c => c.status === 'Not Met').length,
        pending: conditionalities.filter(c => c.status === 'Waived' || c.status === 'Pending').length,
    };
    const totalCommitments = conditionalities.length;

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
                                IMF Bailout Monitor
                            </h1>

                            <div className="inline-flex flex-wrap justify-start items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-white/20 transition-all duration-300">
                                <span className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    Program Status: <span className="font-medium text-emerald-300">Active (Review 3 Complete)</span>
                                </span>
                                <span className="hidden sm:block w-px h-4 bg-white/30"></span>
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Next Review: <span className="font-medium text-white">Apr 2026</span>
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
                                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2 relative z-10">
                                    <span className="w-1 h-6 bg-primary-600 rounded-full block"></span>
                                    Program Overview
                                </h3>
                                <p className="text-base text-black leading-relaxed text-left relative z-10">
                                    Track the progress of Ghana's $3 billion IMF Extended Credit Facility (ECF) program. This dashboard provides detailed monitoring of disbursement schedules, quantitative performance criteria, structural benchmarks, and the implementation status of key conditionalities essential for restoring macroeconomic stability.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Executive Summary & Key Metrics */}
                <section className="section pb-8 md:pb-12 text-center" style={{ paddingBottom: '3rem' }}>
                    <div className="container">
                        <ExecutiveSummary
                            metrics={[
                                {
                                    label: 'GDP Growth (2026 Proj)',
                                    value: '5.5%',
                                    change: '+0.7%',
                                    trend: 'up',
                                    trendColor: 'green',
                                    period: 'Projected 2026'
                                },
                                {
                                    label: 'Inflation (Jan 26)',
                                    value: '3.8%',
                                    change: '-1.6%',
                                    trend: 'down',
                                    trendColor: 'green',
                                    period: 'Lowest since 2021'
                                },
                                {
                                    label: 'Debt-to-GDP (Latest)',
                                    value: '45.5%',
                                    change: '-16.3%',
                                    trend: 'down',
                                    trendColor: 'green',
                                    period: 'Nov 2025'
                                },
                                {
                                    label: 'Policy Rate',
                                    value: '15.5%',
                                    change: '-1450 bps',
                                    trend: 'down',
                                    trendColor: 'green',
                                    period: 'Monetary Easing'
                                },
                                {
                                    label: 'Gross Reserves',
                                    value: '$6.7B',
                                    change: '+0.5B',
                                    trend: 'up',
                                    trendColor: 'green',
                                    period: 'Feb 2026'
                                },
                            ]}
                            lastUpdated="Feb 13, 2026"
                        />

                        <div className="mt-8 md:mt-10 bg-white rounded-2xl shadow-sm border border-slate-100 p-1 md:p-2 max-w-5xl mx-auto">
                            {conditionalities.length > 0 && (
                                <StatusProgressBar counts={statusCounts} total={totalCommitments} />
                            )}
                        </div>
                    </div>
                </section >

                {/* Context: Path To Crisis */}
                <section className="section py-8 md:py-12 bg-slate-50 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <PathToCrisis />
                    </div>
                </section >

                {/* Disbursement Schedule - The "Fuel" */}
                < section className="section py-8 md:py-12 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <div className="mb-8 md:mb-10 max-w-3xl">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">IMF Disbursement Schedule</h2>
                            <p className="text-black leading-relaxed">Timeline of expected funding tranches and their status upon completion of reviews.</p>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                            {disbursementChartData.length > 0 ? (
                                <DisbursementScheduleChart data={disbursementChartData} />
                            ) : (
                                <div className="glass-card text-center py-12">
                                    <p className="text-gray-400">No disbursement data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section >

                {/* Key Economic Indices - The "Results" */}
                < section className="section py-8 md:py-12 bg-slate-50 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <KeyEconomicIndices />
                    </div>
                </section >

                {/* Programme Reviews - The "Checkpoints" */}
                < section className="section py-8 md:py-12 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <ProgrammeReviews />
                    </div>
                </section >

                {/* Key Conditions - The "Hurdles" */}
                < section className="section py-8 md:py-12 bg-slate-50 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        <KeyConditions />
                    </div>
                </section >

                {/* Conditionality Tracker (Detailed) */}
                < section className="section py-8 md:py-12 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        {conditionalities.length > 0 ? (
                            <ConditionalityTracker conditionalities={conditionalities} />
                        ) : (
                            <div className="glass-card text-center py-12">
                                <p className="text-gray-400">No conditionality data available</p>
                            </div>
                        )}
                    </div>
                </section >

                {/* Program Timeline - The "Roadmap" */}
                < section className="section py-8 md:py-12 bg-slate-50 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="container">
                        {milestones.length > 0 ? (
                            <ProgramTimelineChart milestones={milestones} />
                        ) : (
                            <div className="glass-card text-center py-12">
                                <p className="text-gray-400">No milestone data available</p>
                            </div>
                        )}
                    </div>
                </section >

                {/* Context: Program Objectives */}

            </main >
            <Footer />
        </>
    );
}
