'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Label,
} from 'recharts';

interface DebtToGDPChartProps {
    data: {
        date: string;
        ratio: number;
    }[];
    lastUpdated?: string;
}

export default function DebtToGDPChart({ data, lastUpdated }: DebtToGDPChartProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const ratio = payload[0].value;
            const isCrisis = ratio > 70;

            return (
                <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{label}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-black">Debt to GDP:</span>
                        <span className={`text-sm font-bold ${isCrisis ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {ratio}%
                        </span>
                    </div>
                    {isCrisis && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">Exceeds recommended threshold</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">Debt-to-GDP Ratio</h3>
                <p className="text-sm text-black">
                    Key indicator of debt sustainability
                    {lastUpdated && <span className="ml-2 font-medium text-slate-400">• {lastUpdated}</span>}
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.getFullYear().toString();
                        }}
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        tickFormatter={(value) => `${value}%`}
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        domain={[40, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3">
                        <Label value="Sustainability Threshold (70%)" position="insideTopRight" fill="#ef4444" fontSize={11} />
                    </ReferenceLine>
                    <Line
                        type="monotone"
                        dataKey="ratio"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#3b82f6' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
