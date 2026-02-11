'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import TimelineModal from '@/components/dashboards/TimelineModal';
import { format, parseISO } from 'date-fns';

interface Milestone {
    date: string;
    title: string;
    description: string;
    status: 'completed' | 'upcoming' | 'pending';
    type: 'start' | 'review' | 'disbursement' | 'end';
    details?: any;
}

interface ProgramTimelineChartProps {
    milestones: Milestone[];
}

export default function ProgramTimelineChart({ milestones }: ProgramTimelineChartProps) {
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed':
                return {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-100',
                    icon: (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            case 'upcoming':
                return {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700',
                    border: 'border-blue-100',
                    icon: (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            default:
                return {
                    bg: 'bg-slate-50',
                    text: 'text-black',
                    border: 'border-slate-100',
                    icon: (
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'MMM yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <>
            <div className="bg-white rounded-none md:rounded-2xl border-y md:border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2">Program Review Timeline</h3>
                        <p className="text-sm text-black">Key milestones and disbursement reviews</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Completed
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Upcoming
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {milestones.map((milestone, index) => {
                        const style = getStatusStyles(milestone.status);
                        return (
                            <motion.div
                                key={index}
                                whileHover={{ y: -4 }}
                                className={`relative p-5 rounded-xl border ${style.border} ${style.bg} cursor-pointer transition-all hover:shadow-md group`}
                                onClick={() => setSelectedMilestone(milestone)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-black bg-white/50 px-2 py-1 rounded-md">
                                        {formatDate(milestone.date)}
                                    </span>
                                    {style.icon}
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">
                                    {milestone.title}
                                </h4>
                                <p className="text-xs text-black line-clamp-2 mb-3">
                                    {milestone.description}
                                </p>
                                <div className="flex items-center text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details
                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <TimelineModal
                isOpen={!!selectedMilestone}
                onClose={() => setSelectedMilestone(null)}
                data={selectedMilestone as any}
            />
        </>
    );
}
