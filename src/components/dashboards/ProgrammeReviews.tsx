'use client';

import { useState } from 'react';

type ReviewData = {
    id: string;
    title: string;
    date: string;
    summary: string;
    qpcs: { indicator: string; target: string; performance: string; status: 'Achieved' | 'Exceeded' | 'Not Met' }[];
    its: { indicator: string; target: string; performance: string; status: 'Achieved' | 'In Progress' | 'Not Met' }[];
    sbs: { indicator: string; target: string; performance: string; status: 'Achieved' | 'In Progress' | 'Not Met' }[];
    narratives: { title: string; content: string }[];
    link?: string;
    stats?: { label: string; value: string; subtext?: string }[];
};

const reviews: ReviewData[] = [
    {
        id: 'first-review',
        title: 'First Review',
        date: 'September 2023',
        summary: 'The First Review assessed Ghana\'s economic performance and implementation of reforms. Performance was strong across QPCs and ITs, with mixed progress on Structural Benchmarks.',
        qpcs: [
            { indicator: 'Fiscal Primary Balance', target: 'Achieve positive primary balance', performance: 'Strong fiscal consolidation efforts', status: 'Achieved' },
            { indicator: 'Intl. Reserves (Commitment)', target: 'Increase reserve accumulation', performance: 'Improved by over 4 percentage points of GDP', status: 'Exceeded' },
            { indicator: 'Intl. Reserves (Cash Basis)', target: 'Reduce fiscal deficit impact', performance: 'Significant improvement through fiscal measures', status: 'Achieved' },
            { indicator: 'Non-Concessional Borrowing', target: 'Limit external borrowing', performance: 'Borrowing limits maintained', status: 'Achieved' },
            { indicator: 'Net Domestic Financing', target: 'Control domestic borrowing', performance: 'Financing kept within agreed limits', status: 'Achieved' },
        ],
        its: [
            { indicator: 'Social Protection Spending', target: 'Increase spending on social programs', performance: 'Safety net programs expanded', status: 'Achieved' },
            { indicator: 'Inflation Control', target: 'Reduce inflation rate', performance: 'Declined from 54% to 23%', status: 'Achieved' },
            { indicator: 'Domestic Arrears Clearance', target: 'Reduce outstanding arrears', performance: 'Partial achievement, challenges remain', status: 'In Progress' },
        ],
        sbs: [
            { indicator: 'Tax Reform', target: 'Broaden tax base', performance: 'Revenue improvements implemented', status: 'Achieved' },
            { indicator: 'PFM Reform', target: 'Strengthen PFM systems', performance: 'Improvements ongoing', status: 'In Progress' },
            { indicator: 'Energy Sector Reforms', target: 'Reduce inefficiencies', performance: 'Additional reforms needed', status: 'In Progress' },
        ],
        narratives: [
            { title: 'Quantitative Performance', content: 'Ghana successfully met most Quantitative Performance Criteria, particularly excelling in fiscal consolidation and reserve accumulation. The fiscal primary balance showed marked improvement due to strong reform efforts.' },
            { title: 'Economic Growth and Outlook', content: 'GDP growth for 2023 was revised to 1.5%, reflecting challenges from energy production constraints, elevated inflation, and fiscal adjustment measures. Inflation began declining from its peak of 54%.' },
            { title: 'Fiscal Performance', content: 'The fiscal deficit was targeted to narrow to 1.5% of GDP in 2023 from 6.9% in 2022. Government revenues increased through improved tax collection and enhanced fiscal measures.' },
            { title: 'Debt Sustainability', content: 'Ghana continued negotiations with creditors to restructure public debt. Domestic debt restructuring made progress, while external debt restructuring discussions advanced with international partners.' },
        ]
    },
    {
        id: 'second-review',
        title: 'Second Review',
        date: 'June 2024',
        summary: 'The Second Review demonstrated Ghana\'s strong commitment to the IMF program, with the country successfully meeting most quantitative performance criteria and making substantial progress on structural reforms.',
        qpcs: [
            { indicator: 'Fiscal Primary Balance', target: '0.5% of GDP surplus', performance: 'Significant improvement; surplus target met', status: 'Achieved' },
            { indicator: 'Non-Oil Revenue', target: 'Enhanced collection targets', performance: 'Targets met via tax admin improvements', status: 'Achieved' },
            { indicator: 'Intl. Reserves', target: 'Accumulation targets', performance: 'Targets exceeded; stronger external position', status: 'Exceeded' },
            { indicator: 'Public Debt Management', target: 'Restructuring progress', performance: 'Substantial progress in debt restructuring', status: 'Achieved' },
        ],
        its: [
            { indicator: 'Social Protection Spending', target: 'Increase social spending', performance: 'Expanded support for vulnerable populations', status: 'Achieved' },
            { indicator: 'Fiscal Deficit Control', target: 'Maintain budgetary limits', performance: 'Reduced fiscal pressures through discipline', status: 'Achieved' },
            { indicator: 'Monetary Policy', target: 'Reduce inflation', performance: 'Inflation declined from 54% to 23%', status: 'Achieved' },
        ],
        sbs: [
            { indicator: 'Tax & PFM Reforms', target: 'Strengthen revenue/PFM', performance: 'Significant strides in collection & transparency', status: 'Achieved' },
            { indicator: 'Debt Transparency', target: 'Enhance reporting', performance: 'Improved tracking & international reporting', status: 'Achieved' },
            { indicator: 'Energy & Cocoa Sectors', target: 'Reduce inefficiencies', performance: 'Progress made; additional reforms needed', status: 'In Progress' },
        ],
        narratives: [
            { title: 'Program Performance', content: 'Ghana successfully met most Quantitative Performance Criteria and made substantial progress on structural benchmarks, demonstrating strong commitment to the reform program despite challenging economic conditions.' },
            { title: 'Key Achievements', content: 'Fiscal consolidation efforts yielded impressive results, with the primary balance moving toward surplus. The dramatic reduction in inflation from 54% to 23% represented a significant milestone.' },
            { title: 'Monetary Policy Success', content: 'The Bank of Ghana’s tight monetary stance achieved remarkable results, declining inflation by more than half, creating a stable environment for recovery.' },
            { title: 'Areas for Focus', content: 'While overall performance was strong, the energy and cocoa sectors required ongoing attention to address structural inefficiencies. Continued debt management efforts remain critical.' },
        ]
    },
    {
        id: 'third-review',
        title: 'Third Review Highlights',
        date: 'October 2024',
        summary: 'A staff-level agreement was reached on the third review. Ghana gained access to SDR 269.1 million (approx. US$360 million), increasing total disbursements to US$1.92 billion since May 2023.',
        link: 'https://www.imf.org/en/news/articles/2024/10/04/pr-24356-imf-reaches-staff-level-agreement-on-the-third-review-of-the-ecf-with-ghana',
        qpcs: [],
        its: [],
        sbs: [],
        narratives: [
            { title: 'Staff-Level Agreement', content: 'Agreement reached on the third review. Pending IMF Management approval and Executive Board consideration.' },
            { title: 'Economic Performance', content: 'Growth in H1 2024 exceeded expectations, driven by mining, construction, and ICT. Adjusted for drought conditions in northern regions.' },
            { title: 'Fiscal & Monetary Policy', content: 'On track to achieve 0.5% primary surplus despite fiscal pressures. Tight monetary policy maintained to support inflation reduction.' },
            { title: 'Debt Restructuring', content: 'Significant milestones achieved: Domestic debt restructuring completed; MOU with Official Creditors Committee; Eurobond consent solicitation completed.' },
            { title: 'External Sector', content: 'Improvement driven by strong gold exports and remittances. International reserves surpassed program targets.' },
            { title: 'Stakeholder Engagement', content: 'Productive meetings held with Finance Minister, BoG Governor, and key stakeholders. Continued cooperation appreciated.' },
        ]
    },
    {
        id: 'fourth-review',
        title: 'Fourth Review',
        date: 'July 2025',
        summary: 'The Fourth Review marked a significant milestone following the general elections. The new administration demonstrated strong commitment to reform despite fiscal challenges.',
        link: 'https://www.imf.org/en/publications/cr/issues/2025/07/10/ghana-fourth-review-under-the-arrangement-under-the-extended-credit-facility-request-for-568430',
        stats: [
            { label: 'Real GDP Growth 2024', value: '5.7%', subtext: 'Exceeded expectations' },
            { label: 'GDP Growth Q1 2025', value: '5.3%', subtext: 'Robust growth continuing' },
            { label: 'Inflation (June 2025)', value: '13.7%', subtext: 'Down from 23.8% end-2024' },
            { label: 'Current Account Surplus', value: '1.1%', subtext: '% of GDP in 2024' },
        ],
        qpcs: [],
        its: [],
        sbs: [],
        narratives: [
            { title: 'Fiscal Slippages & Challenges', content: 'Primary balance deteriorated to a deficit of 3.3% of GDP (vs 0.5% target). Significant accumulation of payables (2.6% of GDP), mainly outside GIFMIS.' },
            { title: 'New Administration Response', content: 'Launched comprehensive audit of 2024 commitments. Enacted new 2025 Budget targeting 1.5% primary surplus. Amended PFM Act and enhanced fiscal responsibility.' },
            { title: 'Debt Restructuring', content: 'Domestic debt restructuring completed in 2023. Eurobond exchange completed Oct 2024. MOU with Official Creditors signed Jan 2025. Credit ratings upgraded.' },
            { title: 'Sectoral Information', content: 'Energy: Resumed quarterly tariff adjustments. Cocoa: Farmgate prices set at GHS 49,600/ton. Gold: New Gold Board established with US$279m capital.' },
            { title: 'Financial Stability', content: 'National Investment Bank recapitalized. Most banks on track for 13% CAR by end-2025. Enhanced open market operations by BoG.' },
            { title: 'Economic Outlook', content: 'Growth projected at 4.0% in 2025, returning to 5.0% by 2027. Inflation target of 8±2% by mid-2026. Total program disbursements reached US$2.3 billion.' },
        ]
    },
    {
        id: 'fifth-review',
        title: 'Fifth Review',
        date: 'December 2025',
        summary: 'The Fifth Review highlighted continued economic recovery, with growth exceeding expectations and inflation declining. Fiscal challenges remain, but the new administration has taken decisive corrective actions.',
        link: 'https://www.imf.org/en/publications/cr/issues/2025/07/10/ghana-fourth-review-under-the-arrangement-under-the-extended-credit-facility-request-for-568430',
        stats: [
            { label: 'Real GDP Growth 2024', value: '5.7%', subtext: 'Exceeded expectations' },
            { label: 'GDP Growth Q1 2025', value: '5.3%', subtext: 'Robust growth continuing' },
            { label: 'Inflation (June 2025)', value: '13.7%', subtext: 'Down from 23.8% end-2024' },
            { label: 'Current Account Surplus', value: '1.1%', subtext: '% of GDP in 2024' },
        ],
        qpcs: [],
        its: [],
        sbs: [],
        narratives: [
            { title: 'Fiscal Slippages & Challenges', content: 'Primary balance deteriorated to a deficit of 3.3% of GDP (vs 0.5% target). Significant accumulation of payables (2.6% of GDP), mainly outside GIFMIS.' },
            { title: 'New Administration Response', content: 'Launched comprehensive audit of 2024 commitments. Enacted new 2025 Budget targeting 1.5% primary surplus. Amended PFM Act and enhanced fiscal responsibility.' },
            { title: 'Debt Restructuring Achievements', content: 'Domestic debt restructuring completed in 2023. Eurobond exchange completed Oct 2024. MOU with Official Creditors signed Jan 2025. Credit ratings upgraded.' },
            { title: 'Sectoral Information', content: 'Energy: Resumed quarterly tariff adjustments. Cocoa: Farmgate prices set at GHS 49,600/ton. Gold: New Gold Board established with US$279m capital.' },
            { title: 'Financial Sector Stability', content: 'National Investment Bank recapitalized. Most banks on track for 13% CAR by end-2025. Enhanced open market operations by BoG.' },
            { title: 'Economic Outlook', content: 'Growth projected at 4.0% in 2025, returning to 5.0% by 2027. Inflation target of 8±2% by mid-2026. Total program disbursements reached US$2.3 billion.' },
        ]
    }
];

export default function ProgrammeReviews() {
    const [activeTab, setActiveTab] = useState(reviews[0].id);
    const activeReview = reviews.find(r => r.id === activeTab) || reviews[0];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Achieved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Exceeded': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Not Met': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-8">
            <div className="glass-card p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Programme Reviews</h2>
                    <p className="text-slate-500">
                        Detailed assessment of performance against program targets for each review cycle.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-full md:w-fit mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {reviews.map((review) => (
                        <button
                            key={review.id}
                            onClick={() => setActiveTab(review.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-shrink-0 ${activeTab === review.id
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {review.title}
                        </button>
                    ))}
                </div>

                {/* Review Content */}
                <div className="space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="bg-primary-50 rounded-lg p-6 border border-primary-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                            <h3 className="text-lg font-bold text-primary-900">{activeReview.title}</h3>
                            <span className="text-sm font-medium text-primary-600">{activeReview.date}</span>
                        </div>
                        <p className="text-primary-800/80 leading-relaxed max-w-3xl mb-4">
                            {activeReview.summary}
                        </p>
                        {activeReview.link && (
                            <a
                                href={activeReview.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-white text-primary-700 text-sm font-medium rounded-md shadow-sm border border-primary-200 hover:bg-primary-50 transition-colors"
                            >
                                View Full Report
                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>

                    {/* Key Stats Section */}
                    {activeReview.stats && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {activeReview.stats.map((stat, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                                    <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
                                    <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                                    {stat.subtext && <div className="text-xs text-slate-400 mt-1">{stat.subtext}</div>}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeReview.qpcs.length > 0 || activeReview.narratives.length > 0 ? (
                        <>
                            {/* Narratives Grid */}
                            {activeReview.narratives.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeReview.narratives.map((narrative, idx) => (
                                        <div key={idx} className="bg-slate-50 rounded-lg p-5 border border-slate-100 hover:shadow-sm transition-shadow">
                                            <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">{narrative.title}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{narrative.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Tables Section */}
                            {activeReview.qpcs.length > 0 && (
                                <div className="space-y-8">
                                    <ReviewTable title="Quantitative Performance Criteria (QPCs)" data={activeReview.qpcs} getStatusColor={getStatusColor} />
                                    <ReviewTable title="Indicative Targets (ITs)" data={activeReview.its} getStatusColor={getStatusColor} />
                                    <ReviewTable title="Structural Benchmarks (SBs)" data={activeReview.sbs} getStatusColor={getStatusColor} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <p className="text-slate-400">Detailed data for this review is not yet available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ReviewTable({ title, data, getStatusColor }: any) {
    return (
        <div className="overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-800">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-slate-500 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Indicator</th>
                            <th className="px-6 py-3 font-medium">Target</th>
                            <th className="px-6 py-3 font-medium">Performance Detail</th>
                            <th className="px-6 py-3 font-medium w-32">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{row.indicator}</td>
                                <td className="px-6 py-4 text-slate-600">{row.target}</td>
                                <td className="px-6 py-4 text-slate-600">{row.performance}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
