
'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';
import {
    Clock, MousePointer2, Target,
    ArrowRight, Activity, Compass, Zap, Users2, Library
} from 'lucide-react';

interface PremiumMetricsProps {
    funnelData: any[];
    attributionData: any[];
    realtimeCount: number;
    engagement: {
        avgScroll: number;
        avgDuration: number;
    };
}

export default function PremiumMetrics({
    funnelData, attributionData, realtimeCount, engagement
}: PremiumMetricsProps) {
    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Conversion Funnel - PREMIUM FEATURE */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Target className="w-5 h-5 text-red-500" /> Conversion Funnel
                        </h3>
                        <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">Live Data</span>
                    </div>
                    <div className="space-y-4">
                        {funnelData.map((step, i) => (
                            <div key={step.name} className="relative">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{step.name}</span>
                                    <span className="text-sm font-bold">{step.count} ({step.percent}%)</span>
                                </div>
                                <div className="w-full h-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden flex">
                                    <div
                                        className="h-full bg-blue-500/80 transition-all duration-1000"
                                        style={{ width: `${step.percent}%` }}
                                    ></div>
                                </div>
                                {i < funnelData.length - 1 && (
                                    <div className="flex justify-center -my-1 text-gray-300 dark:text-gray-600">
                                        <ArrowRight className="w-4 h-4 rotate-90" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Attribution Analysis - PREMIUM FEATURE */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-purple-500" /> Attribution Model (First Touch)
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attributionData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {attributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 3. Real-time Pulse */}
                <div className="bg-blue-600 dark:bg-blue-700 p-6 rounded-2xl shadow-lg border border-blue-500 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium opacity-80 uppercase tracking-wider">Active Users</h4>
                        <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black">{realtimeCount}</span>
                        <span className="text-sm opacity-80">Right now</span>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs bg-white/10 p-2 rounded-lg">
                        <Activity className="w-3 h-3" />
                        <span>Real-time system pulse</span>
                    </div>
                </div>

                {/* 4. Engagement: Time Spent */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/40 rounded-lg text-purple-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold">Avg. Session Time</h4>
                    </div>
                    <p className="text-3xl font-bold dark:text-white">{Math.floor(engagement.avgDuration / 60)}m {engagement.avgDuration % 60}s</p>
                    <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: '65%' }}></div>
                    </div>
                </div>

                {/* 5. Engagement: Scroll Depth */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-blue-600">
                            <MousePointer2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold">Avg. Scroll Depth</h4>
                    </div>
                    <p className="text-3xl font-bold dark:text-white">{engagement.avgScroll}%</p>
                    <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${engagement.avgScroll}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
