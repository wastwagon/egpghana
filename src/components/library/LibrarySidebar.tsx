
import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

// We'll pass specialized props or fetch simple distinct lists if needed.
// For RSC, we can pass data in.

interface LibrarySidebarProps {
    categories: string[];
    activeCategory?: string;
    popularTags?: string[];
    categoryCounts?: Record<string, number>;
}

export default function LibrarySidebar({ categories, activeCategory, popularTags = [], categoryCounts = {} }: LibrarySidebarProps) {
    // Use only predefined categories for consistency
    const displayCategories = ['Analysis', 'News', 'Press Statements', 'Reports', 'Policy Papers'];

    return (
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            {/* Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Collections
                </h3>
                <nav className="space-y-1">
                    <Link
                        href="/resources"
                        className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${!activeCategory
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-3 ${!activeCategory ? 'bg-primary-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}></span>
                            All Resources
                        </div>
                    </Link>
                    {displayCategories.map((category) => (
                        <Link
                            key={category}
                            href={`/resources?category=${encodeURIComponent(category)}`}
                            className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeCategory === category
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-3 ${activeCategory === category ? 'bg-primary-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}></span>
                                {category}
                            </div>
                            {categoryCounts[category] !== undefined && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === category
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                    }`}>
                                    {categoryCounts[category]}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Popular Topics */}
            {popularTags.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Popular Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.map(tag => (
                            <Link
                                key={tag}
                                href={`/resources?q=${encodeURIComponent(tag)}`}
                                className="px-3 py-1 bg-slate-50 hover:bg-white border border-slate-200 hover:border-primary-200 text-slate-600 hover:text-primary-600 text-xs rounded-full transition-all"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Upload / Contact CTA */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 text-white text-center shadow-lg">
                <h4 className="font-bold mb-2">Need specific data?</h4>
                <p className="text-xs text-blue-100 mb-4">Request diverse datasets or specific policy documents.</p>
                <Link href="/contact" className="inline-block w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-semibold transition-colors">
                    Request Data
                </Link>
            </div>
        </aside>
    );
}
