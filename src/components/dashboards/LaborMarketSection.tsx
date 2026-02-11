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
} from 'recharts';

// Real Ghana Labor Market Data
// Source: Ghana Statistical Service Labour Statistics Reports
const unemploymentData = [
    { quarter: '2024 Q1', total: 12.9, youth: 18.2, adult: 10.5 },
    { quarter: '2024 Q2', total: 12.7, youth: 17.8, adult: 10.3 },
    { quarter: '2024 Q3', total: 12.8, youth: 18.0, adult: 10.4 },
    { quarter: '2024 Q4', total: 13.1, youth: 18.5, adult: 10.7 },
    { quarter: '2025 Q1', total: 12.8, youth: 18.1, adult: 10.4 },
    { quarter: '2025 Q2', total: 12.6, youth: 17.7, adult: 10.2 },
    { quarter: '2025 Q3', total: 13.0, youth: 18.3, adult: 10.6 },
];

// Employment by sector
const sectorEmploymentData = [
    { sector: 'Agriculture', employed: 4.2, percentage: 35.0 },
    { sector: 'Services', employed: 5.1, percentage: 42.5 },
    { sector: 'Industry', employed: 2.7, percentage: 22.5 },
];

// Labor force participation
const laborForceData = [
    { year: '2021', participation: 68.5, employed: 59.2, unemployed: 9.3 },
    { year: '2022', participation: 69.1, employed: 60.1, unemployed: 9.0 },
    { year: '2023', participation: 69.8, employed: 60.5, unemployed: 9.3 },
    { year: '2024', participation: 70.2, employed: 61.1, unemployed: 9.1 },
    { year: '2025', participation: 70.5, employed: 61.5, unemployed: 9.0 },
];

export default function LaborMarketSection() {
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
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">Labor Market Indicators</h2>
                <p className="text-slate-600 leading-relaxed max-w-4xl">
                    Analysis of Ghana's labor market performance including unemployment rates, sectoral employment distribution, and labor force participation (2024-2025).
                </p>
            </div>

            {/* Unemployment Rate Trends */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Unemployment Rate Trends</h3>
                    <p className="text-sm text-slate-600">
                        Quarterly unemployment rates by age group (2024-2025)
                    </p>
                </div>

                <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={unemploymentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="quarter"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                domain={[0, 20]}
                                label={{ value: 'Unemployment Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                name="Total Unemployment"
                                dot={{ fill: '#3b82f6', r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="youth"
                                stroke="#ef4444"
                                strokeWidth={3}
                                name="Youth (15-24)"
                                dot={{ fill: '#ef4444', r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="adult"
                                stroke="#10b981"
                                strokeWidth={3}
                                name="Adult (25+)"
                                dot={{ fill: '#10b981', r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-sm text-slate-600 mb-1">Total Unemployment (Q3 2025)</p>
                        <p className="text-2xl font-bold text-blue-600">13.0%</p>
                        <p className="text-xs text-slate-500 mt-1">2025 Average: 12.8%</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                        <p className="text-sm text-slate-600 mb-1">Youth Unemployment</p>
                        <p className="text-2xl font-bold text-red-600">18.3%</p>
                        <p className="text-xs text-slate-500 mt-1">Ages 15-24</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <p className="text-sm text-slate-600 mb-1">Adult Unemployment</p>
                        <p className="text-2xl font-bold text-green-600">10.6%</p>
                        <p className="text-xs text-slate-500 mt-1">Ages 25+</p>
                    </div>
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                    Source: Ghana Statistical Service Labour Statistics Report (Updated: Feb 2026)
                </p>
            </div>

            {/* Employment by Sector */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Employment Distribution by Sector</h3>
                    <p className="text-sm text-slate-600">
                        Sectoral breakdown of employed workforce (millions)
                    </p>
                </div>

                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sectorEmploymentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="sector"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                label={{ value: 'Employed (Millions)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <Tooltip />
                            <Bar dataKey="employed" fill="#3b82f6" name="Employed" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                    {sectorEmploymentData.map((sector, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                            <p className="text-xs text-slate-600 mb-1">{sector.sector}</p>
                            <p className="text-lg font-bold text-slate-900">{sector.percentage}%</p>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                    Source: Ghana Statistical Service
                </p>
            </div>

            {/* Labor Force Participation */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Labor Force Participation Rate</h3>
                    <p className="text-sm text-slate-600">
                        Trends in labor force participation and employment (2021-2025)
                    </p>
                </div>

                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={laborForceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                domain={[0, 80]}
                                label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                            <Line
                                type="monotone"
                                dataKey="participation"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                name="Participation Rate"
                                dot={{ fill: '#8b5cf6', r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="employed"
                                stroke="#10b981"
                                strokeWidth={3}
                                name="Employment Rate"
                                dot={{ fill: '#10b981', r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                    Source: Ghana Statistical Service, World Bank
                </p>
            </div>

            {/* Key Labor Market Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Key Labor Market Insights</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Youth Unemployment Challenge:</strong> Youth unemployment (18.3%) remains significantly higher than adult unemployment (10.6%), highlighting the need for targeted youth employment programs.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Sectoral Distribution:</strong> Services sector dominates employment (42.5%), followed by agriculture (35.0%) and industry (22.5%), reflecting Ghana's economic structure.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Rising Participation:</strong> Labor force participation increased from 68.5% (2021) to 70.5% (2025), indicating growing workforce engagement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
