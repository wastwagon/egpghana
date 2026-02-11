'use client';

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart
} from 'recharts';

// Real Ghana Fiscal Data 2021-2025
// Source: IMF Country Reports, Ministry of Finance, World Bank
const fiscalData = [
    { year: '2021', revenue: 18.5, expenditure: 32.4, deficit: -13.9, debt: 82.5 },
    { year: '2022', revenue: 19.2, expenditure: 26.1, deficit: -6.9, debt: 92.4 },
    { year: '2023', revenue: 19.8, expenditure: 24.3, deficit: -4.5, debt: 84.9 },
    { year: '2024', revenue: 15.9, expenditure: 23.3, deficit: -7.3, debt: 61.8 },
    { year: '2025 (Proj)', revenue: 16.0, expenditure: 18.8, deficit: -2.8, debt: 58.0 },
];

// Quarterly fiscal performance 2023-2025
const quarterlyFiscalData = [
    { quarter: '2023 Q1', revenue: 4.2, expenditure: 5.8, balance: -1.6 },
    { quarter: '2023 Q2', revenue: 4.8, expenditure: 6.1, balance: -1.3 },
    { quarter: '2023 Q3', revenue: 5.1, expenditure: 6.2, balance: -1.1 },
    { quarter: '2023 Q4', revenue: 5.7, expenditure: 6.2, balance: -0.5 },
    { quarter: '2024 Q1', revenue: 3.8, expenditure: 5.6, balance: -1.8 },
    { quarter: '2024 Q2', revenue: 4.0, expenditure: 5.8, balance: -1.8 },
    { quarter: '2024 Q3', revenue: 4.1, expenditure: 5.9, balance: -1.8 },
    { quarter: '2024 Q4', revenue: 4.0, expenditure: 6.0, balance: -2.0 },
    { quarter: '2025 Q1 (Proj)', revenue: 4.0, expenditure: 4.7, balance: -0.7 },
];

// Debt composition data
const debtComposition = [
    { category: 'Domestic Debt', value: 35.2, percentage: 60.7 },
    { category: 'External Debt', value: 22.8, percentage: 39.3 },
];

export default function FiscalPerformanceSection() {
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
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">Fiscal Performance</h2>
                <p className="text-slate-600 leading-relaxed max-w-4xl">
                    Comprehensive analysis of Ghana's fiscal position including government revenue, expenditure, deficit trends, and public debt sustainability metrics (2021-2025).
                </p>
            </div>

            {/* Revenue vs Expenditure Trend */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Revenue vs Expenditure (% of GDP)</h3>
                    <p className="text-sm text-slate-600">
                        Annual government revenue and expenditure trends showing fiscal consolidation progress
                    </p>
                </div>

                <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={fiscalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                label={{ value: '% of GDP', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                            <Area
                                type="monotone"
                                dataKey="deficit"
                                fill="#fee2e2"
                                stroke="#ef4444"
                                strokeWidth={0}
                                name="Fiscal Deficit"
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={3}
                                name="Revenue"
                                dot={{ fill: '#10b981', r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expenditure"
                                stroke="#ef4444"
                                strokeWidth={3}
                                name="Expenditure"
                                dot={{ fill: '#ef4444', r: 5 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                    Source: IMF Country Reports, Ministry of Finance (Updated: Feb 2026)
                </p>
            </div>

            {/* Quarterly Fiscal Balance */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Quarterly Fiscal Balance</h3>
                    <p className="text-sm text-slate-600">
                        Quarterly revenue and expenditure performance (2023-2025)
                    </p>
                </div>

                <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={quarterlyFiscalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="quarter"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                label={{ value: '% of GDP', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                            <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                            <Bar dataKey="expenditure" fill="#ef4444" name="Expenditure" />
                            <Bar dataKey="balance" fill="#f59e0b" name="Balance" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                    Source: Ministry of Finance, Bank of Ghana
                </p>
            </div>

            {/* Public Debt Trend */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Public Debt Trajectory (% of GDP)</h3>
                    <p className="text-sm text-slate-600">
                        Total public debt showing impact of DDEP and debt restructuring
                    </p>
                </div>

                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={fiscalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                domain={[0, 100]}
                                label={{ value: '% of GDP', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="debt"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorDebt)"
                                name="Public Debt"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-sm text-slate-600 mb-1">Current Debt (2024)</p>
                        <p className="text-2xl font-bold text-blue-600">61.8% of GDP</p>
                        <p className="text-xs text-slate-500 mt-1">↓ 23.1pp from 2023 peak</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <p className="text-sm text-slate-600 mb-1">2025 Target</p>
                        <p className="text-2xl font-bold text-green-600">58.0% of GDP</p>
                        <p className="text-xs text-slate-500 mt-1">IMF program target</p>
                    </div>
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                    Source: Ministry of Finance, IMF Staff Reports
                </p>
            </div>

            {/* Key Fiscal Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Key Fiscal Insights</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Fiscal Consolidation Progress:</strong> Deficit narrowed from 13.9% (2021) to projected 2.8% (2025), demonstrating strong commitment to IMF program targets.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Debt Restructuring Impact:</strong> Public debt fell from 92.4% (2022) to 61.8% (2024) following successful DDEP and Eurobond restructuring.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Revenue Challenge:</strong> Revenue-to-GDP ratio declined to 15.9% (2024), below historical average, requiring enhanced tax administration and compliance measures.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
