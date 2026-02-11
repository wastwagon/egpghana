'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewSectionProps {
    title: string;
    date: string;
    highlights: string[];
    content: {
        title: string;
        body: string; // HTML string for rich text
    }[];
    isExpanded?: boolean;
}

export default function ReviewSection({
    title,
    date,
    highlights,
    content,
    isExpanded = false,
}: ReviewSectionProps) {
    const [isOpen, setIsOpen] = useState(isExpanded);

    return (
        <div className="glass-card overflow-hidden transition-all duration-300 border border-slate-200 shadow-sm hover:shadow-md bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider">
                            {date}
                        </span>
                        <h3 className="text-base md:text-lg font-semibold text-slate-800">{title}</h3>
                    </div>
                    {!isOpen && (
                        <p className="text-slate-500 text-sm truncate max-w-md">
                            {highlights.join(' • ')}
                        </p>
                    )}
                </div>
                <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary-100 text-primary-600' : 'text-slate-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-8 border-t border-slate-100">
                            {/* Highlights */}
                            <div className="py-6">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Key Highlights</h4>
                                <div className="flex flex-wrap gap-2">
                                    {highlights.map((highlight, index) => (
                                        <span key={index} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Detailed Content */}
                            <div className="space-y-8">
                                {content.map((section, index) => (
                                    <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                        <h4 className="heading-4 text-slate-900 mb-4">{section.title}</h4>
                                        <div
                                            className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: section.body }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
