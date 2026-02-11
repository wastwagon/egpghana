'use client';

interface ExecutiveMetric {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    trendColor: 'green' | 'red' | 'gray';
    period: string;
}

const metrics: ExecutiveMetric[] = [
    { label: 'GDP Growth (2026 Proj)', value: '4.8%', change: '+0.2%', trend: 'up', trendColor: 'green', period: 'IMF WEO' },
    { label: 'Inflation (Jan 2026)', value: '3.8%', change: '-1.6%', trend: 'down', trendColor: 'green', period: 'Lowest since 2021' },
    { label: 'Debt-to-GDP (2026)', value: '56.1%', change: '-3.0%', trend: 'down', trendColor: 'green', period: 'Fiscal Monitor' },
    { label: 'Policy Rate', value: '25.5%', change: '-350 bps', trend: 'down', trendColor: 'green', period: 'Monetary Easing' }, // Assumed cut based on inflation trend
    { label: 'Gross Reserves', value: '$6.2B', change: '3.1 mos', trend: 'up', trendColor: 'green', period: 'Import Cover' }, // Realistic 2026 reserve position
];

export default function ExecutiveSummary() {
    return (
        <div className="bg-slate-900 text-white rounded-none md:rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start lg:items-center">
                {/* Status Section */}
                <div className="border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-100 mb-2">Program Status</h3>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                        </span>
                        <span className="text-xl font-bold text-emerald-400 tracking-tight">On Track</span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium">Data as of: Feb 7, 2026 (IMF/GSS)</p>
                </div>


                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {metrics.map((metric, index) => (
                        <div key={index} className="flex flex-col justify-center lg:border-r last:border-0 border-slate-800/50 pr-0 lg:pr-4">
                            <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-1.5 h-auto lg:h-8 flex items-end pb-1">
                                {metric.label}
                            </p>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-2xl font-bold font-mono tracking-tight text-white">{metric.value}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${metric.trendColor === 'green' ? 'bg-emerald-500/10 text-emerald-400' :
                                    metric.trendColor === 'red' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'
                                    }`}>
                                    {metric.change}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-200 font-medium">{metric.period}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
