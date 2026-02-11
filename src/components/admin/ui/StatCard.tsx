
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    subtext?: string;
    trend?: 'up' | 'down';
    change?: string;
}

export default function StatCard({ title, value, icon: Icon, subtext, trend, change }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {(subtext || change) && (
                <div className="mt-4 flex items-center gap-2">
                    {change && (
                        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {change}
                        </span>
                    )}
                    {subtext && <span className="text-sm text-gray-400">{subtext}</span>}
                </div>
            )}
        </div>
    );
}
