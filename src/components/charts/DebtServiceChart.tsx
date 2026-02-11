'use client';

import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
} from 'recharts';

interface DebtServiceChartProps {
    data: {
        year: string;
        ratio: number;
    }[];
    lastUpdated?: string;
}

export default function DebtServiceChart({ data, lastUpdated }: DebtServiceChartProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const ratio = payload[0]?.value || 0;

            return (
                <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{label}</p>
                    <div className="flex items-center justify-between space-x-4">
                        <span className="text-xs text-black">Debt Service/Revenue:</span>
                        <span className={`text-sm font-bold ${ratio > 50 ? 'text-rose-600' : 'text-slate-900'}`}>
                            {ratio.toFixed(1)}%
                        </span>
                    </div>
                    {ratio > 50 && (
                        <div className="mt-2 text-xs text-rose-600 font-medium">
                            CRITICAL: Absorbs &gt;50% of revenue
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">Debt Service vs. Revenue</h3>
                <p className="text-sm text-black">
                    Percentage of total government revenue used to service debt
                    {lastUpdated && <span className="block mt-1 text-xs text-slate-400">Data range: {lastUpdated}</span>}
                </p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="year"
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        tickFormatter={(value) => `${value}%`}
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        domain={[0, 120]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Area
                        type="monotone"
                        dataKey="ratio"
                        name="Debt Service Ratio"
                        stroke="#e11d48"
                        strokeWidth={2}
                        fill="url(#colorRatio)"
                    />
                    <Bar
                        dataKey="ratio"
                        name="Service Cost Burden"
                        barSize={20}
                        fill="#f43f5e"
                        opacity={0.3}
                        radius={[4, 4, 0, 0]}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
