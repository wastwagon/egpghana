'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PathToCrisis() {
    const preamblePoints = [
        "Failure to transform the Guggisberg inherited economy predicated on the export of primary commodities such as cocoa, gold, and lately oil making up over 80% of export earnings",
        "Unproductive use of borrowed funds by government sometimes with the tacit support of lenders across bilateral/multilateral and quasi-commercial creditors",
        "Higher borrowing costs (reflecting also the excessive opportunism by wealthy lenders or predator lending from the global north as well as the domestic market (as evidenced by the African risk premium))",
        "Fiscal indiscipline, election-related excesses, covid-19 and Russia-Ukraine, inflation, and exchange rate development",
        "The false hope of endowed fiscal space as a result of rebasing of the economy and the conferment of middle-income status",
        "Unsustainable debt accumulation leading to the 2022 debt crisis and the painful Domestic Debt Exchange Programme (DDEP) that restructured GHS 137 billion in domestic bonds"
    ];

    // Ghana Fiscal Data 2010-2025 (% of GDP)
    // Source: IMF Country Reports, World Bank, Bank of Ghana, Ministry of Finance
    // Updated: February 2026
    const fiscalData = [
        { year: '2010', revenue: 20.5, expenditure: 23.6, deficit: -3.1 },
        { year: '2011', revenue: 22.8, expenditure: 25.2, deficit: -2.4 },
        { year: '2012', revenue: 21.4, expenditure: 33.5, deficit: -12.1 },
        { year: '2013', revenue: 21.2, expenditure: 33.2, deficit: -12.0 },
        { year: '2014', revenue: 22.0, expenditure: 31.5, deficit: -9.5 },
        { year: '2015', revenue: 21.8, expenditure: 27.0, deficit: -5.2 },
        { year: '2016', revenue: 20.3, expenditure: 29.2, deficit: -8.9 },
        { year: '2017', revenue: 20.1, expenditure: 26.0, deficit: -5.9 },
        { year: '2018', revenue: 19.8, expenditure: 26.5, deficit: -6.7 },
        { year: '2019', revenue: 19.5, expenditure: 26.4, deficit: -6.9 },
        { year: '2020', revenue: 17.2, expenditure: 33.6, deficit: -16.4 },
        { year: '2021', revenue: 18.5, expenditure: 32.4, deficit: -13.9 },
        { year: '2022', revenue: 19.2, expenditure: 26.1, deficit: -6.9 },
        { year: '2023', revenue: 19.8, expenditure: 24.3, deficit: -4.5 },
        { year: '2024', revenue: 15.6, expenditure: 23.3, deficit: -7.3 },
        { year: '2025', revenue: 16.0, expenditure: 18.8, deficit: -2.8 },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-bold text-slate-900 mb-2">{payload[0].payload.year}</p>
                    <p className="text-sm text-green-600">
                        Revenue: <span className="font-semibold">{payload[0].value.toFixed(1)}% of GDP</span>
                    </p>
                    <p className="text-sm text-red-600">
                        Expenditure: <span className="font-semibold">{payload[1].value.toFixed(1)}% of GDP</span>
                    </p>
                    <p className="text-sm text-slate-700 mt-1 pt-1 border-t border-slate-200">
                        Deficit: <span className="font-semibold">{payload[0].payload.deficit.toFixed(1)}% of GDP</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
            <div className="p-8 md:p-12">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">How did we get here?</h2>
                <p className="text-black mb-10 leading-relaxed max-w-3xl">
                    Understanding Ghana's path to the IMF through historical fiscal trends and structural challenges.
                </p>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Left Column: Fiscal Data Chart */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">The Path to Crisis</h3>
                                <p className="text-sm text-black">
                                    Ghana's fiscal position (2010-2025): Revenue vs Expenditure
                                </p>
                            </div>

                            <div className="w-full h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={fiscalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="year"
                                            tick={{ fontSize: 12, fill: '#000000' }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#000000' }}
                                            tickLine={false}
                                            label={{ value: '% of GDP', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#000000' } }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
                                            iconType="line"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            name="Revenue"
                                            dot={{ fill: '#10b981', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expenditure"
                                            stroke="#ef4444"
                                            strokeWidth={3}
                                            name="Expenditure"
                                            dot={{ fill: '#ef4444', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <p className="text-xs text-slate-500 mt-4 italic">
                                Source: IMF Country Reports, World Bank, Bank of Ghana, Ministry of Finance (Updated: Feb 2026)
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Preamble */}
                    <div className="w-full lg:w-1/2">
                        <div className="space-y-6">
                            {preamblePoints.map((point, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300">
                                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-black leading-relaxed text-base">
                                        {point}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
