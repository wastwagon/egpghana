'use client';

import { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const data = [
    { quarter: '2021 Q1', gdp_growth: null, nominal_gdp: 114.02, interest_rate: 14.50, inflation: 10.30, exchange_rate: 5.70 },
    { quarter: '2021 Q2', gdp_growth: -13.28, nominal_gdp: 102.95, interest_rate: 13.50, inflation: 7.80, exchange_rate: 5.80 },
    { quarter: '2021 Q3', gdp_growth: 8.42, nominal_gdp: 114.59, interest_rate: 13.50, inflation: 9.70, exchange_rate: 5.90 },
    { quarter: '2021 Q4', gdp_growth: 9.98, nominal_gdp: 130.14, interest_rate: 14.50, inflation: 12.60, exchange_rate: 6.00 },
    { quarter: '2022 Q1', gdp_growth: 3.92, nominal_gdp: 142.79, interest_rate: 17.00, inflation: 15.70, exchange_rate: 7.10 },
    { quarter: '2022 Q2', gdp_growth: 4.60, nominal_gdp: 131.99, interest_rate: 19.00, inflation: 29.80, exchange_rate: 7.60 },
    { quarter: '2022 Q3', gdp_growth: 2.97, nominal_gdp: 153.92, interest_rate: 24.50, inflation: 37.20, exchange_rate: 9.60 },
    { quarter: '2022 Q4', gdp_growth: 3.83, nominal_gdp: 185.64, interest_rate: 27.00, inflation: 54.10, exchange_rate: 8.60 },
    { quarter: '2023 Q1', gdp_growth: 3.15, nominal_gdp: 212.07, interest_rate: 29.50, inflation: 52.20, exchange_rate: 11.00 },
    { quarter: '2023 Q2', gdp_growth: 2.55, nominal_gdp: 189.86, interest_rate: 30.00, inflation: 42.50, exchange_rate: 11.20 },
    { quarter: '2023 Q3', gdp_growth: 2.16, nominal_gdp: 206.61, interest_rate: 30.00, inflation: 38.10, exchange_rate: 11.50 },
    { quarter: '2023 Q4', gdp_growth: 3.79, nominal_gdp: 233.09, interest_rate: 30.00, inflation: 23.20, exchange_rate: 12.10 },
    { quarter: '2024 Q1', gdp_growth: 4.69, nominal_gdp: 266.68, interest_rate: 29.00, inflation: 23.20, exchange_rate: 12.90 },
];

const metrics = [
    { key: 'gdp_growth', label: 'GDP Growth (%)', color: '#06b6d4' }, // Cyan
    { key: 'nominal_gdp', label: 'Nominal GDP (Billion GHC)', color: '#f97316' }, // Orange
    { key: 'interest_rate', label: 'Interest Rate (%)', color: '#ec4899' }, // Pink
    { key: 'inflation', label: 'Inflation (%)', color: '#3b82f6' }, // Blue
    { key: 'exchange_rate', label: 'Exchange Rate (GHC/USD)', color: '#eab308' }, // Yellow
];

export default function KeyEconomicIndices() {
    const [visibleMetrics, setVisibleMetrics] = useState<Record<string, boolean>>({
        gdp_growth: true,
        nominal_gdp: true,
        interest_rate: true,
        inflation: true,
        exchange_rate: true,
    });

    const toggleMetric = (key: string) => {
        setVisibleMetrics(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="space-y-8">
            <div className="glass-card p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">State of Implementation - Key Economic Indices</h2>
                    <p className="text-slate-600 leading-relaxed max-w-4xl">
                        Comprehensive analysis of Ghana's key economic performance metrics from Q1 2021 to Q1 2024.
                        This interactive dashboard presents GDP growth, nominal GDP, interest rates, inflation rates,
                        and exchange rate trends.
                    </p>
                </div>

                {/* Metric Toggles */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
                    <div className="w-full text-sm font-semibold text-slate-700 mb-2 text-center">Select Metrics to Display:</div>
                    {metrics.map((metric) => (
                        <button
                            key={metric.key}
                            onClick={() => toggleMetric(metric.key)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 border ${visibleMetrics[metric.key]
                                ? 'bg-white shadow-sm border-slate-200'
                                : 'bg-slate-100 text-slate-400 border-transparent hover:bg-slate-200'
                                }`}
                        >
                            <div
                                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${visibleMetrics[metric.key] ? '' : 'bg-slate-300'
                                    }`}
                                style={{ backgroundColor: visibleMetrics[metric.key] ? metric.color : undefined }}
                            >
                                {visibleMetrics[metric.key] && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`text-sm font-medium ${visibleMetrics[metric.key] ? 'text-slate-700' : 'text-slate-500'}`}>
                                {metric.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Chart */}
                <div className="w-full h-[300px] md:h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Percentage / Rate', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: '12px' } }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Nominal GDP (Billion GHC)', angle: 90, position: 'insideRight', style: { fill: '#64748b', fontSize: '12px' } }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
                            />
                            <Legend verticalAlign="top" height={36} />

                            {metrics.map((metric) => (
                                visibleMetrics[metric.key] && (
                                    <Line
                                        key={metric.key}
                                        yAxisId={metric.key === 'nominal_gdp' ? 'right' : 'left'}
                                        type="monotone"
                                        dataKey={metric.key}
                                        name={metric.label}
                                        stroke={metric.color}
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 0, fill: metric.color }}
                                        activeDot={{ r: 6 }}
                                        connectNulls
                                    />
                                )
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Data Table */}
            <div className="glass-card overflow-hidden bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-white uppercase bg-indigo-600">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-bold">Quarter</th>
                                {metrics.map(metric => (
                                    <th key={metric.key} scope="col" className="px-6 py-4 font-bold whitespace-nowrap">
                                        {metric.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={row.quarter} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                    <td className="px-6 py-4 font-bold text-slate-900">{row.quarter}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.gdp_growth !== null ? row.gdp_growth : '-'}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.nominal_gdp}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.interest_rate.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.inflation.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.exchange_rate.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
