
'use client';

import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileText, Calendar, Database, Users, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/admin/ui/StatCard';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

interface AnalyticsDashboardProps {
    stats: {
        articleCount: number;
        eventCount: number;
        resourceCount: number;
        userCount: number;
    };
    recentArticles: any[];
    analyticsData?: {
        visitData: any[];
        deviceData: any[];
        realtimeCount?: number;
    };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#F43F5E'];

export default function AnalyticsDashboard({ stats, recentArticles, analyticsData }: AnalyticsDashboardProps) {
    const visitData = analyticsData?.visitData && analyticsData.visitData.length > 0
        ? analyticsData.visitData
        : [
            { name: 'Mon', visits: 10, pageviews: 20 },
            { name: 'Tue', visits: 15, pageviews: 25 },
            { name: 'Wed', visits: 8, pageviews: 18 },
        ];

    const deviceData = analyticsData?.deviceData && analyticsData.deviceData.length > 0
        ? analyticsData.deviceData
        : [{ name: 'Desktop', value: 100 }];

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <AdminPageHeader
                    title="Dashboard Overview"
                    description="Real-time system insights and content performance."
                />
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-100 dark:border-yellow-800">
                        <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">{analyticsData?.realtimeCount || 0} Live</span>
                    </div>
                    <Link
                        href="/admin/analytics"
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors border border-blue-100 dark:border-blue-800"
                    >
                        Deep Reports <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Publications" value={stats.articleCount} icon={FileText} subtext="Published articles" />
                <StatCard title="Upcoming Events" value={stats.eventCount} icon={Calendar} subtext="Scheduled events" />
                <StatCard title="Resource Documents" value={stats.resourceCount} icon={Database} subtext="Available downloads" />
                <StatCard title="Registered Users" value={stats.userCount} icon={Users} subtext="Admin users" />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Traffic Pulse (7 Days)</h2>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Sessions</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Pageviews</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} /><stop offset="95%" stopColor="#6366F1" stopOpacity={0} /></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" name="Sessions" />
                                <Area type="monotone" dataKey="pageviews" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" name="Pageviews" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold mb-6">Device Usage</h2>
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Recent Publications</h2>
                    <Link href="/admin/publications" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group">
                        Manage All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/30 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {recentArticles.map((article: any) => (
                                <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white max-w-md truncate">{article.title}</td>
                                    <td className="px-6 py-4 text-right text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
