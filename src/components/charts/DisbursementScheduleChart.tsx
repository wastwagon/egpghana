'use client';

import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart,
} from 'recharts';

interface DisbursementData {
    quarter: string;
    plannedSDR: number;
    actualSDR: number;
    cumulativeSDR: number;
    plannedUSD: number;
    actualUSD: number;
    cumulativeUSD: number;
}

interface DisbursementScheduleChartProps {
    data: DisbursementData[];
}

export default function DisbursementScheduleChart({ data }: DisbursementScheduleChartProps) {
    const [currency, setCurrency] = useState<'SDR' | 'USD'>('SDR');

    const formatValue = (value: number) => {
        const millions = (value / 1000000).toFixed(0);
        return currency === 'SDR' ? `SDR ${millions}M` : `$${millions}M`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Get data based on current currency
            const suffix = currency;
            const plannedKey = `planned${suffix}`;
            const actualKey = `actual${suffix}`;
            const cumulativeKey = `cumulative${suffix}`;

            const planned = payload.find((p: any) => p.dataKey === plannedKey)?.value || 0;
            const actual = payload.find((p: any) => p.dataKey === actualKey)?.value || 0;
            const cumulative = payload.find((p: any) => p.dataKey === cumulativeKey)?.value || 0;

            return (
                <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-3 shadow-xl backdrop-blur-md">
                    <p className="text-sm font-semibold text-white mb-2">{label}</p>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between space-x-4">
                            <span className="text-xs text-slate-400">Planned:</span>
                            <span className="text-sm font-medium text-blue-400">{formatValue(planned)}</span>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <span className="text-xs text-slate-400">Actual:</span>
                            <span className="text-sm font-medium text-emerald-400">{formatValue(actual)}</span>
                        </div>
                        <div className="flex items-center justify-between space-x-4 pt-1 border-t border-slate-700 mt-1">
                            <span className="text-xs text-slate-400">Cumulative:</span>
                            <span className="text-sm font-bold text-white">{formatValue(cumulative)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">Disbursement Schedule</h3>
                    <p className="text-sm text-black">Planned vs Actual quarterly disbursements</p>
                </div>

                {/* Currency Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setCurrency('SDR')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${currency === 'SDR'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-black hover:text-slate-700'
                            }`}
                    >
                        SDR (IMF)
                    </button>
                    <button
                        onClick={() => setCurrency('USD')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${currency === 'USD'
                            ? 'bg-white text-emerald-600 shadow-sm'
                            : 'text-black hover:text-slate-700'
                            }`}
                    >
                        USD ($)
                    </button>
                </div>
            </div>

            <div className="w-full h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="quarter"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}`}
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            label={{
                                value: currency === 'SDR' ? 'SDR (Millions)' : 'USD (Millions)',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fill: '#000000', fontSize: '11px', fontWeight: 500 }
                            }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}`}
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            label={{
                                value: 'Cumulative',
                                angle: 90,
                                position: 'insideRight',
                                style: { fill: '#000000', fontSize: '11px', fontWeight: 500 }
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => {
                                const labels: Record<string, string> = {
                                    [`planned${currency}`]: 'Planned',
                                    [`actual${currency}`]: 'Actual',
                                    [`cumulative${currency}`]: 'Cumulative Total'
                                };
                                return <span className="text-sm font-medium text-slate-600 ml-1">{labels[value]}</span>;
                            }}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey={`planned${currency}`}
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                            name={`planned${currency}`}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey={`actual${currency}`}
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                            name={`actual${currency}`}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey={`cumulative${currency}`}
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={{ fill: '#white', stroke: '#f97316', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            name={`cumulative${currency}`}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
