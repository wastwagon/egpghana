'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ExchangeRateData {
    month: string;
    rate: number;
    change: number;
}

interface ExchangeRateChartProps {
    data: ExchangeRateData[];
}

export default function ExchangeRateChart({ data }: ExchangeRateChartProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const rate = payload[0]?.value || 0;
            const dataPoint = data.find((d) => d.month === label);
            const change = dataPoint?.change || 0;

            return (
                <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{label}</p>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between space-x-4">
                            <span className="text-xs text-black">Exchange Rate:</span>
                            <span className="text-sm font-bold text-slate-900">GH₵ {rate.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <span className="text-xs text-black">Change:</span>
                            <span className={`text-sm font-medium ${change >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                            </span>
                        </div>
                        <div className="text-xs text-black pt-1 border-t border-slate-100">
                            {change >= 0 ? 'Depreciation' : 'Appreciation'} vs previous month
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const minRate = Math.min(...data.map((d) => d.rate));
    const maxRate = Math.max(...data.map((d) => d.rate));
    const padding = (maxRate - minRate) * 0.1;

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">Exchange Rate (GHS/USD)</h3>
                <p className="text-sm text-black">Monthly exchange rate trends</p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#d97706" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        domain={[minRate - padding, maxRate + padding]}
                        tickFormatter={(value) => `₵${value.toFixed(1)}`}
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'GHS per USD', angle: -90, position: 'insideLeft', style: { fill: '#000000', fontSize: '12px' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#d97706"
                        strokeWidth={2}
                        fill="url(#colorRate)"
                        dot={{ fill: '#d97706', r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-black mb-1">Current Rate</div>
                    <div className="text-lg font-bold text-slate-900">GH₵ {data[data.length - 1]?.rate.toFixed(2)}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-black mb-1">YTD Change</div>
                    <div className={`text-lg font-bold ${data[data.length - 1]?.change >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {data[data.length - 1]?.change >= 0 ? '+' : ''}{data[data.length - 1]?.change.toFixed(1)}%
                    </div>
                </div>
            </div>
        </div>
    );
}
