'use client';

import React, { useState } from 'react';
import IndicatorCard, { IndicatorData } from './IndicatorCard';

const indicators: IndicatorData[] = [
    // DEBT
    {
        id: '1', category: 'debt', title: 'Total debt stock', value: 'GH₵ 644.6B',
        trend: 'down', trendValue: '-5.8%',
        analysis: 'Debt decreased by GH₵ 40B from August, reflecting successful debt restructuring and improved fiscal management.',
        source: 'MoF'
    },
    {
        id: '2', category: 'debt', title: 'External Debt', value: 'GH₵ 330.2B',
        trend: 'down', trendValue: '-27.4%',
        analysis: 'External debt fell significantly by GH₵ 124.8B, demonstrating major progress in debt restructuring efforts.',
        source: 'MoF'
    },
    {
        id: '3', category: 'debt', title: 'Domestic Debt', value: 'GH₵ 314.4B',
        trend: 'up', trendValue: '+8.4%',
        analysis: 'Domestic debt increased by GH₵ 24.4B, indicating shift toward local financing as external debt is restructured.',
        source: 'MoF'
    },
    {
        id: '4', category: 'debt', title: 'External Debt % share', value: '51.2%',
        trend: 'down', trendValue: '-2.4pts',
        analysis: 'External debt share decreased from 53.6%, reflecting rebalancing toward more balanced debt portfolio composition.',
        source: 'MoF'
    },
    {
        id: '5', category: 'debt', title: 'Domestic Debt % share', value: '48.8%',
        trend: 'up', trendValue: '+2.4pts',
        analysis: 'Domestic debt share increased from 46.4%, showing greater reliance on local markets during debt restructuring period.',
        source: 'MoF'
    },
    {
        id: '6', category: 'debt', title: 'Revised interest payment', value: 'GH₵ 25.4B',
        trend: 'down', trendValue: '-60.4%',
        analysis: 'Major reduction in interest payments by GH₵ 38.8B from June, reflecting successful debt restructuring and relief.',
        source: 'MoF'
    },
    {
        id: '7', category: 'debt', title: 'Interest/Expenditure Ratio', value: '9.45%',
        trend: 'down', trendValue: '-7.3pts',
        analysis: 'Interest burden on expenditure decreased significantly from 16.75%, freeing up fiscal space for development spending.',
        source: 'BoG'
    },
    {
        id: '8', category: 'debt', title: 'Debt per Capita', value: 'GH₵ 21,061',
        trend: 'stable', trendValue: 'Stable',
        analysis: 'Per capita debt burden remains unchanged, as debt reduction aligns proportionally with population growth.',
        source: 'World Bank'
    },
    {
        id: '9', category: 'debt', title: 'Interest/Revenue Share', value: '25.1%',
        trend: 'stable', trendValue: 'Stable',
        analysis: 'Quarter of government revenue still allocated to debt servicing, unchanged ratio despite lower absolute interest costs.',
        source: 'KPMG'
    },

    // GDP
    {
        id: '10', category: 'gdp', title: 'Total Debt to GDP Ratio', value: '45.5%',
        trend: 'down', trendValue: '-17.8pts',
        analysis: 'Debt-to-GDP fell dramatically from 63.3%, reflecting successful debt restructuring and GDP growth in nominal terms.',
        source: 'MoF', tag: { label: 'Moderate', type: 'moderate' }
    },
    {
        id: '11', category: 'gdp', title: 'Domestic Debt % of GDP', value: '22.2%',
        trend: 'down', trendValue: '-26.7pts',
        analysis: 'Domestic debt burden relative to GDP decreased significantly from 48.9%, reflecting debt reduction and GDP revaluation.',
        source: 'MoF'
    },
    {
        id: '12', category: 'gdp', title: 'External Debt % of GDP', value: '23.3%',
        trend: 'down', trendValue: '-27.8pts',
        analysis: 'External debt-to-GDP ratio decreased from 51.1% due to successful external debt restructuring and GDP growth.',
        source: 'MoF'
    },
    {
        id: '13', category: 'gdp', title: 'Per CAPITA Income', value: '$ 2,235',
        trend: 'stable', trendValue: 'Stable',
        analysis: 'Income per person remains steady, providing consistent baseline for debt sustainability assessments.',
        source: 'World Bank'
    },
    {
        id: '14', category: 'gdp', title: 'GDP (USD)', value: '$ 88.33B',
        trend: 'up', trendValue: '+11.8%',
        analysis: 'Economic output in dollar terms increased from $79B, reflecting economic growth and currency adjustments.',
        source: 'World Bank'
    },

    // MARKET
    {
        id: '15', category: 'market', title: 'Inflation (Nov 2025)', value: '3.8%',
        trend: 'down', trendValue: '-2.5pts',
        analysis: 'Excellent progress! Inflation dropped from 6.3% to 3.8%, now below BOG target range, showing strong monetary stability.',
        source: 'Bank of Ghana', tag: { label: 'Below Target', type: 'target' }
    },
    {
        id: '16', category: 'market', title: 'Inflation Target', value: '8% ± 2%',
        trend: 'stable', trendValue: 'Target',
        analysis: 'Current inflation at 3.8% is below the 6-10% target range, demonstrating exceptional monetary policy success.',
        source: 'Bank of Ghana', tag: { label: 'Target', type: 'target' }
    },
    {
        id: '17', category: 'market', title: 'Monetary Policy Rate', value: '15.5%',
        trend: 'down', trendValue: '-2.5pts',
        analysis: 'Policy rate reduced from 18% to 15.5% as inflation targets exceeded, supporting economic growth while maintaining stability.',
        source: 'Bank of Ghana', tag: { label: 'Moderate', type: 'moderate' }
    },
    {
        id: '18', category: 'market', title: '91-Day T-Bill Rate', value: '10.833%',
        trend: 'down', trendValue: '-2.87pts',
        analysis: 'Treasury bill yields declined, reducing the cost of short-term government borrowing.',
        source: 'Bank of Ghana'
    }
];

export default function IndicatorsGrid() {
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
                            Real-time tracking of Ghana's critical economic metrics, covering debt stock, GDP growth, inflation, and market rates to monitor financial recovery progress.
                        </p>
                        <p className="text-sm text-slate-500 font-medium">Snapshot as of Nov 2025 • Verified Feb 7, 2026</p>
                    </div>

                    {/* Responsive Filters */}
                    <div className="w-full md:w-auto">
                        {/* Mobile Dropdown */}
                        <div className="md:hidden relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
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

                        {/* Desktop Pills */}
                        <div className="hidden md:inline-flex bg-white p-1 rounded-full border border-slate-200">
                            {['all', 'debt', 'gdp', 'market'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat as any)}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredIndicators.map((indicator) => (
                        <IndicatorCard key={indicator.id} data={indicator} />
                    ))}
                </div>
            </div>
        </section>
    );
}
