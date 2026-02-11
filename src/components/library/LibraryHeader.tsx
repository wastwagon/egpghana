
import React from 'react';

export default function LibraryHeader() {
    return (
        <div className="relative bg-primary-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 opacity-90" />
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />

            <div className="relative container mx-auto px-4 py-16 md:py-24">
                <div className="max-w-4xl mr-auto text-left space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 mb-4 animate-fade-in">
                        <span className="text-accent-teal font-semibold tracking-wider text-xs uppercase">EGP Knowledge Base</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight animate-fade-in">
                        Resource Centre
                    </h1>

                    <p className="text-lg text-blue-100 max-w-2xl leading-relaxed animate-slide-up border-l-4 border-primary-500 pl-6">
                        Access a comprehensive collection of research papers, policy briefs, fiscal reports, and economic analysis.
                    </p>

                    <div className="max-w-2xl pt-8 animate-slide-up animation-delay-200">
                        <form action="/resources" method="GET" className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="search"
                                name="q"
                                className="block w-full pl-12 pr-4 py-4 border-2 border-transparent focus:border-primary-400 bg-white/95 backdrop-blur-sm rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none focus:bg-white shadow-xl transition-all text-lg"
                                placeholder="Search for reports, topics, or keywords..."
                            />
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors shadow-md">
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
