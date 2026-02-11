'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';

interface Conditionality {
    id: string;
    title: string;
    category: 'Fiscal' | 'Monetary' | 'Financial' | 'Energy' | 'Governance' | 'Social';
    status: 'Met' | 'In Progress' | 'Not Met' | 'Waived';
    deadline: string;
    description: string;
    target?: number;
    actual?: number;
    unit?: string;
    verificationNote?: string; // New field for detailed proof
    sourceLink?: string;       // New field for direct link to document
    sourceTitle?: string;      // New field for document name
}

interface ConditionalityTrackerProps {
    conditionalities: Conditionality[];
}

export default function ConditionalityTracker({ conditionalities }: ConditionalityTrackerProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const categories = ['All', 'Fiscal', 'Monetary', 'Financial', 'Energy', 'Governance', 'Social'];
    const statuses = ['All', 'Met', 'In Progress', 'Not Met', 'Waived'];

    const filteredConditionalities = conditionalities.filter((c) => {
        const categoryMatch = selectedCategory === 'All' || c.category === selectedCategory;
        const statusMatch = selectedStatus === 'All' || c.status === selectedStatus;
        const searchMatch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && statusMatch && searchMatch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Met': return 'bg-green-100 text-green-800 border-green-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Not Met': return 'bg-red-100 text-red-800 border-red-200';
            case 'Waived': return 'bg-slate-100 text-slate-800 border-slate-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Fiscal': return 'bg-blue-50 text-blue-600 border border-blue-100';
            case 'Monetary': return 'bg-purple-50 text-purple-600 border border-purple-100';
            case 'Financial': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
            case 'Energy': return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
            case 'Governance': return 'bg-red-50 text-red-600 border border-red-100';
            case 'Social': return 'bg-pink-50 text-pink-600 border border-pink-100';
            default: return 'bg-slate-50 text-slate-600 border border-slate-100';
        }
    };



    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'd MMM yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    const calculateProgress = (target?: number, actual?: number) => {
        if (target === undefined || actual === undefined) return null;
        const progress = (actual / target) * 100;
        return Math.min(100, Math.max(0, progress));
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Calculate status counts for the header summary
    const statusCounts = {
        Met: conditionalities.filter((c) => c.status === 'Met').length,
        'In Progress': conditionalities.filter((c) => c.status === 'In Progress').length,
        'Not Met': conditionalities.filter((c) => c.status === 'Not Met').length,
        Waived: conditionalities.filter((c) => c.status === 'Waived').length,
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">IMF Conditionality Tracker</h3>
                    <p className="text-sm text-black">Monitor compliance with detailed verification sources</p>
                </div>
            </div>

            {/* Compact Mobile-First Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                {/* Search Bar - Takes priority */}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search conditions..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-700 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex gap-3">
                    {/* Sector Dropdown */}
                    <div className="relative min-w-[140px] flex-1 md:flex-none">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm transition-all cursor-pointer hover:bg-white"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>{category === 'All' ? 'All Sectors' : category}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative min-w-[140px] flex-1 md:flex-none">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm transition-all cursor-pointer hover:bg-white"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conditionalities List */}
            <div className="space-y-4">
                {filteredConditionalities.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                        <p className="text-slate-400">No conditionalities match the selected filters</p>
                    </div>
                ) : (
                    filteredConditionalities.map((cond) => {
                        const progress = calculateProgress(cond.target, cond.actual);
                        const isExpanded = expandedId === cond.id;

                        return (
                            <div key={cond.id} className={`group bg-white border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-primary-200 shadow-md' : 'border-slate-200 hover:border-primary-100'}`}>
                                <div className="p-5 cursor-pointer" onClick={() => toggleExpand(cond.id)}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 pr-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getCategoryColor(cond.category)}`}>
                                                    {cond.category}
                                                </span>
                                                <span className="text-xs text-slate-400">•</span>
                                                <span className="text-xs text-black font-medium">Deadline: {formatDate(cond.deadline)}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 mb-1 group-hover:text-primary-700 transition-colors">{cond.title}</h4>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(cond.status)}`}>
                                                {cond.status}
                                            </span>
                                            <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-sm text-black leading-relaxed line-clamp-2">{cond.description}</p>
                                </div>

                                {/* Expanded Verification Details - "Manthri Style" */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 pt-0 bg-slate-50/50 border-t border-slate-100">
                                        <div className="mt-4 space-y-4">
                                            {/* Quantitative Progress */}
                                            {progress !== null && (
                                                <div className="bg-white rounded-lg p-3 border border-slate-200">
                                                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-medium">
                                                        <span>Quantitative Target</span>
                                                        <span>{progress.toFixed(1)}% Achieved</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-500 ${cond.status === 'Met' ? 'bg-green-500' :
                                                                cond.status === 'In Progress' ? 'bg-blue-500' : 'bg-red-500'}`}
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                                                        <span>0</span>
                                                        <span className="font-mono text-slate-700">{cond.actual} / {cond.target} {cond.unit}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Verification Note */}
                                            <div>
                                                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">Verification & Impact</h5>
                                                <p className="text-sm text-slate-600 leading-relaxed">{cond.verificationNote || "Verification details pending for this review."}</p>
                                            </div>

                                            {/* Source Link */}
                                            {cond.sourceLink && (
                                                <div className="flex items-center mt-2">
                                                    <a href={cond.sourceLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full border border-primary-100">
                                                        <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        Source: {cond.sourceTitle || "Official IMF Document"}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
