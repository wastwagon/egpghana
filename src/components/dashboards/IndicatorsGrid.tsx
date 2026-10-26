'use client';

import React, { useState } from 'react';
import IndicatorCard, { IndicatorData } from './IndicatorCard';

interface IndicatorsGridProps {
    indicators: IndicatorData[];
    asOfLabel?: string;
}

export default function IndicatorsGrid({ indicators, asOfLabel }: IndicatorsGridProps) {
    const [filter, setFilter] = useState<'all' | 'debt' | 'gdp' | 'market'>('all');

    const filteredIndicators = filter === 'all'
        ? indicators
        : indicators.filter(i => i.category === filter);

    return (
        <section className="section py-8 md:py-12 bg-slate-50 border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div className="container">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div className="max-w-3xl">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Key Economic Indicators</h2>
                        <p className="text-slate-600 leading-relaxed mb-2">
                            Tracking of Ghana&apos;s critical economic metrics — debt stock, GDP, inflation, and market rates — refreshed from official sources.
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                            {asOfLabel || 'Latest available official data'}
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="md:hidden relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as 'all' | 'debt' | 'gdp' | 'market')}
                                className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm font-medium"
                            >
                                {['all', 'debt', 'gdp', 'market'].map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat === 'gdp' ? 'GDP Related' : cat === 'all' ? 'All Indicators' : `${cat.charAt(0).toUpperCase() + cat.slice(1)} Indicators`}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>

                        <div className="hidden md:inline-flex bg-white p-1 rounded-full border border-slate-200">
                            {(['all', 'debt', 'gdp', 'market'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 capitalize ${filter === cat
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                >
                                    {cat === 'gdp' ? 'GDP Related' : cat === 'all' ? 'All' : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredIndicators.length === 0 ? (
                    <p className="text-slate-500 text-sm">No indicator data available yet. Run Data Freshness sync in admin.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredIndicators.map((indicator) => (
                            <IndicatorCard key={indicator.id} data={indicator} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
