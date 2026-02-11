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
    ReferenceLine,
} from 'recharts';

interface GDPData {
    quarter: string;
    growth: number;
    agriculture: number;
    industry: number;
    services: number;
}

interface GDPGrowthChartProps {
    data: GDPData[];
}

export default function GDPGrowthChart({ data }: GDPGrowthChartProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const growth = payload.find((p: any) => p.dataKey === 'growth')?.value || 0;
            const agriculture = payload.find((p: any) => p.dataKey === 'agriculture')?.value || 0;
            const industry = payload.find((p: any) => p.dataKey === 'industry')?.value || 0;
            const services = payload.find((p: any) => p.dataKey === 'services')?.value || 0;

            return (
                <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{label}</p>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between space-x-4">
                            <span className="text-xs text-black">Overall Growth:</span>
                            <span className={`text-sm font-bold ${growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                            </span>
                        </div>
                        <div className="border-t border-slate-100 pt-1 mt-1">
                            <div className="flex items-center justify-between space-x-4">
                                <span className="text-xs text-black">Agriculture:</span>
                                <span className="text-sm font-medium text-[#10b981]">{agriculture.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between space-x-4">
                                <span className="text-xs text-black">Industry:</span>
                                <span className="text-sm font-medium text-[#3b82f6]">{industry.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between space-x-4">
                                <span className="text-xs text-black">Services:</span>
                                <span className="text-sm font-medium text-[#f59e0b]">{services.toFixed(1)}%</span>
                            </div>
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
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">GDP Growth Rate</h3>
                <p className="text-sm text-black">Quarterly growth by sector</p>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="quarter"
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        tickFormatter={(value) => `${value}%`}
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft', style: { fill: '#000000', fontSize: '12px' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => {
                            const labels: Record<string, string> = {
                                growth: 'Overall GDP Growth',
                                agriculture: 'Agriculture',
                                industry: 'Industry',
                                services: 'Services',
                            };
                            return <span className="text-sm text-slate-600">{labels[value] || value}</span>;
                        }}
                    />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                    <Line
                        type="monotone"
                        dataKey="growth"
                        stroke="#0f172a"
                        strokeWidth={3}
                        dot={{ fill: '#0f172a', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="growth"
                    />
                    <Line
                        type="monotone"
                        dataKey="agriculture"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 4 }}
                        name="agriculture"
                    />
                    <Line
                        type="monotone"
                        dataKey="industry"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        name="industry"
                    />
                    <Line
                        type="monotone"
                        dataKey="services"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ fill: '#f59e0b', r: 4 }}
                        name="services"
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-black">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-0.5 bg-slate-900"></div>
                    <span>Overall GDP Growth</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-0.5 bg-[#10b981]"></div>
                    <span>Agriculture</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-0.5 bg-[#3b82f6]"></div>
                    <span>Industry</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-0.5 bg-[#f59e0b]"></div>
                    <span>Services</span>
                </div>
            </div>
        </div>
    );
}
