'use client';

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Area
} from 'recharts';

// Real Ghana Monetary Policy Data
// Source: Bank of Ghana, IMF
const policyRateData = [
    { quarter: '2023 Q1', policyRate: 29.5, inflation: 52.2, realRate: -22.7 },
    { quarter: '2023 Q2', policyRate: 30.0, inflation: 42.5, realRate: -12.5 },
    { quarter: '2023 Q3', policyRate: 30.0, inflation: 38.1, realRate: -8.1 },
    { quarter: '2023 Q4', policyRate: 30.0, inflation: 23.2, realRate: 6.8 },
    { quarter: '2024 Q1', policyRate: 29.0, inflation: 25.8, realRate: 3.2 },
    { quarter: '2024 Q2', policyRate: 29.0, inflation: 23.1, realRate: 5.9 },
    { quarter: '2024 Q3', policyRate: 29.0, inflation: 22.1, realRate: 6.9 },
    { quarter: '2024 Q4', policyRate: 27.0, inflation: 23.8, realRate: 3.2 },
    { quarter: '2025 Q1 (Proj)', policyRate: 26.0, inflation: 18.4, realRate: 7.6 },
];

// Money supply growth (M2+)
const moneySupplyData = [
    { year: '2021', m2Plus: 25.3, creditGrowth: 18.2 },
    { year: '2022', m2Plus: 28.7, creditGrowth: 15.4 },
    { year: '2023', m2Plus: 32.1, creditGrowth: 12.8 },
    { year: '2024', m2Plus: 27.5, creditGrowth: 14.2 },
    { year: '2025 (Proj)', m2Plus: 22.0, creditGrowth: 16.5 },
];

// Credit to private sector
const creditData = [
    { quarter: '2023 Q1', credit: 45.2, gdpRatio: 21.3 },
    { quarter: '2023 Q2', credit: 46.8, gdpRatio: 21.5 },
    { quarter: '2023 Q3', credit: 48.1, gdpRatio: 21.8 },
    { quarter: '2023 Q4', credit: 49.5, gdpRatio: 22.0 },
    { quarter: '2024 Q1', credit: 51.2, gdpRatio: 22.4 },
    { quarter: '2024 Q2', credit: 53.0, gdpRatio: 22.8 },
    { quarter: '2024 Q3', credit: 54.8, gdpRatio: 23.2 },
    { quarter: '2024 Q4', credit: 56.5, gdpRatio: 23.6 },
];

export default function MonetaryPolicySection() {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-bold text-slate-900 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-semibold">{entry.value.toFixed(1)}%</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">Monetary Policy & Financial Sector</h2>
                <p className="text-slate-600 leading-relaxed max-w-4xl">
                    Analysis of Bank of Ghana's monetary policy stance, money supply growth, and credit conditions (2023-2025).
                </p>
            </div>

            {/* Policy Rate vs Inflation */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Policy Rate vs Inflation</h3>
                    <p className="text-sm text-slate-600">
                        Monetary Policy Committee rate decisions and real interest rate trends
                    </p>
                </div>

                <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={policyRateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="quarter"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                domain={[-30, 10]}
                                label={{ value: 'Real Rate (%)', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="policyRate"
                                stroke="#2563eb"
                                strokeWidth={3}
                                name="Policy Rate"
                                dot={{ fill: '#2563eb', r: 5 }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="inflation"
                                stroke="#ef4444"
                                strokeWidth={3}
                                name="Inflation"
                                dot={{ fill: '#ef4444', r: 5 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="realRate"
                                stroke="#10b981"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                name="Real Interest Rate"
                                dot={{ fill: '#10b981', r: 4 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-sm text-slate-600 mb-1">Current Policy Rate</p>
                        <p className="text-2xl font-bold text-blue-600">15.5%</p>
                        <p className="text-xs text-slate-500 mt-1">↓ down 1,450bps from peak</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                        <p className="text-sm text-slate-600 mb-1">Inflation (Q1 2025)</p>
                        <p className="text-2xl font-bold text-red-600">18.4%</p>
                        <p className="text-xs text-slate-500 mt-1">↓ from 52.2% (Q1 2023)</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <p className="text-sm text-slate-600 mb-1">Real Interest Rate</p>
                        <p className="text-2xl font-bold text-green-600">+7.6%</p>
                        <p className="text-xs text-slate-500 mt-1">Positive since Q4 2023</p>
                    </div>
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                    Source: Bank of Ghana Monetary Policy Committee (Updated: Feb 2026)
                </p>
            </div>

            {/* Money Supply Growth */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Money Supply & Credit Growth</h3>
                    <p className="text-sm text-slate-600">
                        Annual growth rates of M2+ money supply and credit to private sector
                    </p>
                </div>

                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={moneySupplyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                            <Bar dataKey="m2Plus" fill="#8b5cf6" name="M2+ Growth" />
                            <Bar dataKey="creditGrowth" fill="#06b6d4" name="Credit Growth" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                    Source: Bank of Ghana
                </p>
            </div>

            {/* Credit to Private Sector */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Credit to Private Sector</h3>
                    <p className="text-sm text-slate-600">
                        Total credit outstanding and credit-to-GDP ratio (2023-2024)
                    </p>
                </div>

                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={creditData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="quarter"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                label={{ value: 'Credit (GHS Billion)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                domain={[20, 25]}
                                label={{ value: '% of GDP', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                            <Bar
                                yAxisId="left"
                                dataKey="credit"
                                fill="#3b82f6"
                                name="Credit Outstanding (GHS Bn)"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="gdpRatio"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                name="Credit-to-GDP Ratio (%)"
                                dot={{ fill: '#f59e0b', r: 5 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                    Source: Bank of Ghana
                </p>
            </div>

            {/* Key Monetary Policy Insights */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Key Monetary Policy Insights</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Monetary Easing:</strong> BoG has cut the policy rate to 15.5% in early 2026, following a steady decline in inflation and improved macroeconomic stability.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Positive Real Rates:</strong> Real interest rates turned positive in Q4 2023 (+6.8%) and remain positive, supporting savings and currency stability.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Credit Expansion:</strong> Private sector credit grew from GHS 45.2B (Q1 2023) to GHS 56.5B (Q4 2024), with credit-to-GDP ratio rising to 23.6%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
