'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    ComposedChart,
} from 'recharts';

interface InflationData {
    month: string;
    inflation: number;
    policyRate: number;
    targetLow: number;
    targetHigh: number;
}

interface InflationChartProps {
    data: InflationData[];
}

export default function InflationChart({ data }: InflationChartProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const inflation = payload.find((p: any) => p.dataKey === 'inflation')?.value || 0;
            const policyRate = payload.find((p: any) => p.dataKey === 'policyRate')?.value || 0;

            return (
                <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{label}</p>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between space-x-4">
                            <span className="text-xs text-black">Inflation Rate:</span>
                            <span className={`text-sm font-bold ${inflation > 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {inflation.toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <span className="text-xs text-black">Policy Rate:</span>
                            <span className="text-sm font-medium text-primary-600">{policyRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between space-x-4 pt-1 border-t border-slate-100">
                            <span className="text-xs text-black">Target Range:</span>
                            <span className="text-sm text-slate-600">6% - 10%</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">Inflation & Policy Rate</h3>
                <p className="text-sm text-black">Monthly inflation vs Bank of Ghana policy rate</p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="targetBand" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        yAxisId="left"
                        tickFormatter={(value) => `${value}%`}
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft', style: { fill: '#000000', fontSize: '12px' } }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(value) => `${value}%`}
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => {
                            const labels: Record<string, string> = {
                                inflation: 'Inflation Rate',
                                policyRate: 'Policy Rate',
                            };
                            return <span className="text-sm text-slate-600">{labels[value] || value}</span>;
                        }}
                    />
                    {/* Target band shading */}
                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="targetHigh"
                        stroke="none"
                        fill="url(#targetBand)"
                        fillOpacity={1}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="inflation"
                        stroke="#e11d48"
                        strokeWidth={3}
                        dot={{ fill: '#e11d48', r: 3 }}
                        activeDot={{ r: 5 }}
                        name="inflation"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="policyRate"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ fill: '#2563eb', r: 3 }}
                        strokeDasharray="5 5"
                        name="policyRate"
                    />
                </ComposedChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-black">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-0.5 bg-[#e11d48]"></div>
                    <span>Inflation Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-0.5 bg-[#2563eb] opacity-60"></div>
                    <span>Policy Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 bg-[#10b981] opacity-20"></div>
                    <span>Target Band (6-10%)</span>
                </div>
            </div>
        </div>
    );
}
