'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface TimelineModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        date: string;
        title: string;
        description: string;
        status: string;
        details?: {
            disbursement?: string;
            documents?: { name: string; url: string }[];
            keyOutcomes?: string[];
        }
    } | null;
}

export default function TimelineModal({ isOpen, onClose, data }: TimelineModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!data) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col">
                            {/* Header */}
                            <div className="relative bg-slate-900 px-6 py-5 text-white shrink-0">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="flex items-center space-x-3 mb-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${data.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
                                        }`}>
                                        {data.status}
                                    </span>
                                    <span className="text-slate-200 text-sm font-medium">{data.date}</span>
                                </div>
                                <h2 className="text-xl font-bold font-heading leading-tight pr-8">{data.title}</h2>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                    {data.description}
                                </p>

                                {data.details && (
                                    <div className="space-y-6">
                                        {data.details.disbursement && (
                                            <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center">
                                                <div className="p-3 bg-green-100 rounded-lg mr-4">
                                                    <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-green-800 uppercase tracking-wide">Disbursement Approved</p>
                                                    <p className="text-xl font-bold text-green-900">{data.details.disbursement}</p>
                                                </div>
                                            </div>
                                        )}

                                        {data.details.keyOutcomes && (
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Key Outcomes</h4>
                                                <ul className="space-y-2">
                                                    {data.details.keyOutcomes.map((outcome, i) => (
                                                        <li key={i} className="flex items-start text-slate-600">
                                                            <svg className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span>{outcome}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {data.details.documents && (
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Related Documents</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {data.details.documents.map((doc, i) => (
                                                        <a
                                                            key={i}
                                                            href={doc.url}
                                                            target="_blank"
                                                            className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                                        >
                                                            <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700">{doc.name}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
