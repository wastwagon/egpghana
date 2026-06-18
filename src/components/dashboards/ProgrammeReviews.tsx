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
        date: 'January 2024',
        link: 'https://www.imf.org/en/news/articles/2024/01/19/pr2417-gha-imf-exec-brd-conclude-2023-aiv-consult-complete-1st-rev-under-ecf-arrgmt',
        summary: 'The IMF Executive Board completed the first review on 19 January 2024, enabling an immediate disbursement of SDR 451.4 million (about US$600 million). Cumulative disbursements reached about US$1.2 billion.',
        stats: [
            { label: 'Disbursement', value: 'US$600M', subtext: 'SDR 451.4 million' },
            { label: 'Cumulative Disbursements', value: 'US$1.2B', subtext: 'After 1st review' },
            { label: 'Board Date', value: '19 Jan 2024', subtext: 'Executive Board completion' },
        ],
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
        link: 'https://www.imf.org/en/news/articles/2024/06/28/pr24241-ghana-imf-exec-board-completes-2nd-rev-ecf-arr',
        summary: 'The IMF Executive Board completed the second review on 28 June 2024, enabling an immediate disbursement of SDR 269.1 million (about US$360 million). Cumulative disbursements reached about US$1.6 billion.',
        stats: [
            { label: 'Disbursement', value: 'US$360M', subtext: 'SDR 269.1 million' },
            { label: 'Cumulative Disbursements', value: 'US$1.6B', subtext: 'After 2nd review' },
            { label: 'Board Date', value: '28 Jun 2024', subtext: 'Executive Board completion' },
        ],
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
        title: 'Third Review',
        date: 'December 2024',
        summary: 'The IMF Executive Board completed the third review on 2 December 2024, enabling an immediate disbursement of SDR 269.1 million (about US$360 million). Total disbursements under the arrangement reached about US$1.9 billion.',
        link: 'https://www.imf.org/en/news/articles/2024/12/02/pr-24447-ghana-imf-executive-board-completes-3rd-review-under-the-ecf-arrangement',
        stats: [
            { label: 'Disbursement', value: 'US$360M', subtext: 'SDR 269.1 million' },
            { label: 'Cumulative Disbursements', value: 'US$1.9B', subtext: 'After 3rd review' },
            { label: 'Board Date', value: '2 Dec 2024', subtext: 'Executive Board completion' },
        ],
        qpcs: [],
        its: [],
        sbs: [],
        narratives: [
            { title: 'Board Completion', content: 'The Executive Board completed the third review of Ghana\'s US$3 billion, 36-month ECF arrangement approved in May 2023.' },
            { title: 'Economic Performance', content: 'Ghana\'s policy and reform efforts under the IMF-supported program continued to yield results, with progress on fiscal consolidation, inflation reduction, and debt restructuring.' },
            { title: 'Debt Restructuring', content: 'Domestic debt restructuring completed; MOU with Official Creditors Committee under the G20 Common Framework; Eurobond restructuring advanced.' },
            { title: 'External Sector', content: 'International reserves improved and exceeded program targets, supported by strong gold exports and remittances.' },
        ]
    },
    {
        id: 'fourth-review',
        title: 'Fourth Review',
        date: 'July 2025',
        summary: 'The IMF Executive Board completed the fourth review on 7 July 2025, enabling an immediate disbursement of about US$367 million (SDR 267.5 million). Total disbursements reached about US$2.3 billion. Performance was broadly satisfactory after corrective actions following 2024 fiscal slippages.',
        link: 'https://www.imf.org/en/news/articles/2025/07/07/pr-25242-ghana-imf-completes-the-4th-review-under-the-ecf-arrange',
        stats: [
            { label: 'Disbursement', value: 'US$367M', subtext: 'SDR 267.5 million' },
            { label: 'Cumulative Disbursements', value: 'US$2.3B', subtext: 'After 4th review' },
            { label: 'Real GDP Growth 2024', value: '5.7%', subtext: 'IMF staff report' },
            { label: 'Inflation (end-2024)', value: '23.8%', subtext: 'Declining toward target band' },
        ],
        qpcs: [],
        its: [],
        sbs: [],
        narratives: [
            { title: 'Program Performance', content: 'The fourth review followed staff-level agreement in April 2025. Ghana implemented corrective actions after 2024 policy slippages, including fiscal audits and a 2025 budget aligned with program objectives.' },
            { title: 'Macroeconomic Stabilization', content: 'Growth through September 2025 exceeded expectations. Inflation moved toward the Bank of Ghana target range. Reserves accumulation surpassed ECF targets and the cedi strengthened.' },
            { title: 'Debt Restructuring', content: 'Continued progress on bilateral and commercial creditor agreements. Domestic debt exchange completed; Eurobond restructuring finalized in 2024.' },
            { title: 'Fiscal & Financial Sector', content: 'Authorities targeted a 1.5% of GDP primary surplus by year-end 2025. Bank recapitalization and resolution frameworks advanced; energy sector arrears remained a fiscal risk.' },
        ]
    },
    {
        id: 'fifth-review',
        title: 'Fifth Review',
        date: 'December 2025',
        summary: 'The IMF Executive Board completed the fifth review on 17 December 2025 of Ghana\'s 39-month ECF arrangement, enabling an immediate disbursement of about US$385 million (SDR 267.5 million). Total disbursements reached about US$2.8 billion. All QPCs and indicative targets for the fifth review were met.',
        link: 'https://www.imf.org/en/news/articles/2025/12/17/pr-25429-ghana-imf-completes-the-fifth-review-under-the-ecf-arrangement',
        stats: [
            { label: 'Disbursement', value: 'US$385M', subtext: 'SDR 267.5 million' },
            { label: 'Cumulative Disbursements', value: 'US$2.8B', subtext: 'After 5th review' },
            { label: 'Real GDP Growth 2025', value: '4.8%', subtext: 'IMF projection' },
            { label: 'Inflation (end-2025)', value: '8.0%', subtext: 'Single-digit since 2021' },
            { label: 'Public Debt (2025)', value: '56.6% GDP', subtext: 'Down from 69.8% in 2024' },
        ],
        qpcs: [],
        its: [],
        sbs: [],
        narratives: [
            { title: 'Board Completion', content: 'The Executive Board completed the fifth review on 17 December 2025. Ghana\'s performance was generally satisfactory; all quantitative performance criteria and indicative targets for the review were met.' },
            { title: 'Macroeconomic Gains', content: 'Growth through September 2025 exceeded expectations, driven by strong services and agriculture. Inflation is within the Bank of Ghana target range. Reserves surpassed ECF targets and Ghana\'s debt trajectory improved significantly.' },
            { title: 'Debt Restructuring', content: 'Bilateral debt relief agreements signed with many Official Creditor Committee members; Agreements in Principle finalized with several external commercial creditors.' },
            { title: 'Fiscal & Structural Reforms', content: 'Ghana on track for 1.5% of GDP primary surplus by year-end. 2026 budget aligns with program objectives. SOE governance, energy sector arrears, and anti-corruption frameworks remain priorities.' },
        ]
    },
    {
        id: 'sixth-review',
        title: 'Sixth Review (Final)',
        date: 'May 2026',
        summary: 'IMF staff completed the 2026 Article IV consultation and reached staff-level agreement on the sixth and final ECF review and a 36-month non-financing PCI. The ECF has not officially ended until Executive Board approval. Mission Chief Dr Ruben Atoyan indicated the Board is expected to decide on 27 July 2026, with a final disbursement of about US$318 million if approved (bringing total disbursements to ~US$3.2 billion).',
        link: 'https://www.imf.org/en/news/articles/2026/05/15/pr26152-ghana-imf-staff-completes-2026-aiv-consult-reaches-sla-6th-rev-ecf-arr-36mo-pci-request',
        stats: [
            { label: 'Review Status', value: 'Staff-Level Agreement', subtext: 'Board decision expected 27 Jul 2026' },
            { label: 'Final Disbursement (est.)', value: 'US$318M', subtext: 'If Board approves 6th review' },
            { label: 'Disbursed to Date', value: 'US$2.8B', subtext: 'After 5th review (Dec 2025)' },
            { label: 'Debt Anchor', value: '45% of GDP', subtext: 'Legislated target by 2034' },
        ],
        qpcs: [
            { indicator: 'Quantitative Performance Criteria', target: 'Meet program QPCs', performance: 'Mostly met; primary surplus overperformed 2025 target', status: 'Achieved' },
            { indicator: 'Fiscal Primary Balance (2025)', target: 'Program primary balance target', performance: 'Overperformed; fiscal performance strengthened markedly', status: 'Exceeded' },
            { indicator: 'Public Debt Ratio', target: 'Reduce debt-to-GDP', performance: 'Declined sharply; debt trajectory improved', status: 'Achieved' },
            { indicator: 'International Reserves', target: 'Rebuild external buffers', performance: 'Reserves rebuilt; external position strengthened', status: 'Achieved' },
        ],
        its: [
            { indicator: 'Inflation', target: 'Anchor inflation expectations', performance: 'Declined rapidly from earlier peaks; cedi confidence improved', status: 'Achieved' },
            { indicator: 'Real GDP Growth (2025)', target: 'Support recovery', performance: 'Exceeded expectations; broad-based activity', status: 'Exceeded' },
            { indicator: 'Gold Export Receipts', target: 'Strengthen external sector', performance: 'Historically high receipts supported external position', status: 'Exceeded' },
        ],
        sbs: [
            { indicator: 'Public Debt Restructuring', target: 'Advance domestic & external restructuring', performance: 'Bilateral agreements with ~half of official creditors; T-bond issuance resumed', status: 'In Progress' },
            { indicator: 'PFM & SOE Governance', target: 'Strengthen fiscal risk management', performance: 'Key PCI priority; reforms needed on quasi-fiscal activities', status: 'In Progress' },
            { indicator: 'Energy Sector (ECG)', target: 'Reduce distribution losses & arrears', performance: 'Priority reforms on collection, PSP in distribution, generation costs', status: 'In Progress' },
            { indicator: 'Cocoa Sector (Cocobod)', target: 'Ensure long-term sustainability', performance: 'Interventions provided relief; deeper legislative and pricing reforms needed', status: 'In Progress' },
            { indicator: 'Financial Sector Stability', target: 'Recapitalization & supervision', performance: 'Progress on bank recapitalization and unwinding forbearance; NPLs remain a focus', status: 'In Progress' },
            { indicator: 'Anti-Corruption Framework', target: 'Close governance gaps', performance: 'Asset declaration disclosure identified as key next step', status: 'In Progress' },
        ],
        narratives: [
            { title: 'Stabilization Gains Under the ECF', content: 'Ghana\'s ECF-supported program delivered substantial stabilization gains driven by strong reform efforts and significant progress in public debt restructuring. Inflation declined rapidly, international reserves were rebuilt, confidence in the cedi improved, and the public debt ratio fell sharply. Growth exceeded expectations in 2025, supported by broad-based activity, while the external position strengthened on historically high gold export receipts.' },
            { title: 'Sixth & Final ECF Review', content: 'The IMF mission (29 April – 15 May 2026, led by Dr Ruben Atoyan) combined the 2026 Article IV consultation, the sixth and final ECF review, and PCI negotiations. Staff-level agreement was reached on 15 May 2026, but the ECF has not officially ended until the Executive Board decides — expected 27 July 2026 per the Mission Chief.' },
            { title: 'Final Disbursement & Program Totals', content: 'If the Board approves the sixth review, Ghana is expected to receive about US$318 million immediately afterward (Mission Chief, May 2026), bringing total disbursements under the ECF to about US$3.2 billion. Disbursements to date stand at about US$2.8 billion following the fifth review in December 2025.' },
            { title: 'Transition to the Policy Coordination Instrument', content: 'As macroeconomic stability takes hold, IMF engagement is pivoting from crisis stabilization toward consolidation. Staff and the authorities reached agreement on a non-financing 36-month PCI focused on: (i) sustaining growth-friendly fiscal adjustment; (ii) safeguarding debt sustainability; (iii) strengthening fiscal transparency and SOE governance; (iv) enhancing monetary and exchange-rate policy; (v) reinforcing financial sector stability; and (vi) supporting economic diversification and inclusive growth.' },
            { title: 'Fiscal Space & Debt Sustainability', content: 'Improvements in the debt trajectory created carefully calibrated fiscal space under the PCI to address development needs, youth employment, and social spending while preserving the legislated 45% of GDP debt anchor by 2034. Staff assess that lowering the primary surplus to 0.5% of GDP from 2027 could remain consistent with debt sustainability, provided further progress is made on public financial management, fiscal risk management, SOE governance, and quasi-fiscal activities.' },
            { title: 'Debt Restructuring & Market Access', content: 'Significant progress continued on domestic and external debt restructuring. Bilateral debt relief agreements were reached with about half of official creditors under the G20 Common Framework, with steady progress toward remaining official and commercial creditors. The successful resumption of domestic T-bond issuance signals returning investor confidence. Prudent borrowing, the IMF-supported debt rollover strategy for 2027–28, and stronger debt management and transparency remain priorities.' },
            { title: 'Monetary Policy & Central Bank Balance Sheet', content: 'Forward-looking, prudent monetary policy remains essential to anchor inflation expectations. Staff emphasized strengthening monetary policy transmission and the Bank of Ghana\'s balance sheet. Losses linked to the Domestic Gold Purchase Programme underscore the need to limit quasi-fiscal activities, increase transparency, and recognize future costs in the budget to enhance accountability and oversight.' },
            { title: 'Sector Reforms & Governance', content: 'Energy sector priorities include tackling ECG distribution and collection losses, finalizing private sector participation in distribution, enhancing payment discipline, clearing legacy arrears, and reducing generation costs. In cocoa, deeper reforms are needed on farmgate price adjustments, cost efficiency, and Cocobod\'s long-term sustainability. Closing gaps in the anti-corruption framework—including meaningful public disclosure of standardized asset declarations—would strengthen governance and investor confidence.' },
            { title: 'Risks & External Environment', content: 'The global environment remains uncertain. While direct spillovers from conflict in the Middle East have so far been limited, higher energy, food, and fertilizer prices could transmit through trade channels. Elevated fiscal risks—notably from SOEs and ongoing quasi-fiscal activities—underscore the PCI agenda\'s focus on stronger safeguards, transparency, and accountability to entrench policy credibility and rebuild buffers.' },
        ]
    }
];

export default function ProgrammeReviews() {
    const [activeTab, setActiveTab] = useState('sixth-review');
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
