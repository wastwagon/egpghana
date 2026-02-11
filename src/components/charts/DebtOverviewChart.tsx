'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface DebtOverviewChartProps {
    data: {
        date: string;
        total: number;
        domestic: number;
        external: number;
    }[];
    lastUpdated?: string;
}

export default function DebtOverviewChart({ data, lastUpdated }: DebtOverviewChartProps) {
    const formatCurrency = (value: number) => {
        return `${(value / 1000000000).toFixed(0)}B`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2 mb-1">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs text-black capitalize">
                                {entry.dataKey}:
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                                GH₵ {formatCurrency(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1"></div> {/* Spacer to push controls to right */}
                <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1 text-xs font-medium">
                    <span className="px-3 py-1 bg-white shadow rounded-md text-slate-900">Monthly View</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorDomestic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExternal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.getFullYear().toString();
                        }}
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        align="right"
                        iconType="circle"
                        formatter={(value) => <span className="text-slate-600 font-medium ml-1 capitalize">{value}</span>}
                    />
                    <Area
                        type="monotone"
                        dataKey="domestic"
                        stackId="1"
                        stroke="#0ea5e9"
                        fill="url(#colorDomestic)"
                        strokeWidth={2}
                        name="Domestic"
                    />
                    <Area
                        type="monotone"
                        dataKey="external"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="url(#colorExternal)"
                        strokeWidth={2}
                        name="External"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
