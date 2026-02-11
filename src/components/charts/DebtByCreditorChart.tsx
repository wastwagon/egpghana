'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface DebtByCreditorChartProps {
    data: {
        creditor: string;
        amount: number;
        type: string;
    }[];
    lastUpdated?: string;
}

export default function DebtByCreditorChart({ data, lastUpdated }: DebtByCreditorChartProps) {
    const formatCurrency = (value: number) => {
        return `GH₵ ${(value / 1000000000).toFixed(1)}B`;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 mb-1">{d.creditor}</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(d.amount)}</p>
                    <p className="text-xs text-black capitalize">{d.type}</p>
                </div>
            );
        }
        return null;
    };

    const getColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'multilateral':
                return '#3b82f6'; // Blue
            case 'bilateral':
                return '#10b981'; // Emerald
            case 'commercial':
                return '#f59e0b'; // Amber
            default:
                return '#000000'; // Slate
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">Major Creditors</h3>
                    <p className="text-sm text-black">
                        Top external debt holders by volume
                        {lastUpdated && <span className="block mt-1 text-xs text-slate-400">As of {lastUpdated}</span>}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center text-xs text-black">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Multilateral
                    </div>
                    <div className="flex items-center text-xs text-black">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Bilateral
                    </div>
                    <div className="flex items-center text-xs text-black">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> Commercial
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="creditor"
                        type="category"
                        width={120}
                        tick={{ fill: '#000000', fontSize: 12 }}
                        interval={0}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
