'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';

interface DebtCompositionChartProps {
    domesticDebt: number;
    externalDebt: number;
    lastUpdated?: string;
}

export default function DebtCompositionChart({
    domesticDebt,
    externalDebt,
    lastUpdated,
}: DebtCompositionChartProps) {
    const data = [
        { name: 'Domestic Debt', value: domesticDebt, color: '#0ea5e9' }, // Sky 500
        { name: 'External Debt', value: externalDebt, color: '#f59e0b' }, // Amber 500
    ];

    const formatCurrency = (value: number) => {
        return `GH₵ ${(value / 1000000000).toFixed(1)}B`;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 mb-1">{data.name}</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(data.value)}</p>
                    <p className="text-xs text-black">
                        {((data.value / (domesticDebt + externalDebt)) * 100).toFixed(1)}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">Debt Composition</h3>
                <p className="text-sm text-black">
                    Breakdown by domestic vs external sources
                    {lastUpdated && <span className="block mt-1 text-xs text-slate-400">Data as of {lastUpdated}</span>}
                </p>
            </div>

            <div className="relative h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-slate-600 font-medium ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-xs text-slate-400 font-medium">Total Debt</span>
                    <span className="text-xl font-bold text-slate-900">
                        {((domesticDebt + externalDebt) / 1000000000).toFixed(1)}B
                    </span>
                </div>
            </div>
        </div>
    );
}
