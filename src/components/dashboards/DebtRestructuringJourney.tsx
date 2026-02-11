'use client';

import React, { useState } from 'react';
import styles from './DebtRestructuringJourney.module.css';

const timelineEvents = [
    { year: '2022', month: 'Dec', label: '2022', title: 'Domestic Debt Exchange Announcement', desc: 'Ghana officially announced a domestic debt exchange program (DDEP) as part of conditions to secure an IMF loan. The government suspended payments on most external debt, including Eurobonds and commercial loans.', tag: 'Policy' },
    { year: '2022', month: 'Dec 19', label: '2022', title: 'Default on External Debt Payments', desc: 'Ghana defaulted on most of its external debt payments after missing the 30-day grace period for a $41 million interest payment on its Eurobond due in 2026.', tag: 'Financial' },

    { year: '2023', month: 'Jan', label: '2023', title: 'DDEP Deadline Extensions', desc: 'The initial deadline for the DDEP was extended multiple times due to low participation rates.', tag: 'Policy' },
    { year: '2023', month: 'Feb', label: '2023', title: 'Agreement with Domestic Bondholders', desc: 'Ghana reached an agreement with domestic bondholders on a debt exchange program. The government extended the deadline for its domestic debt exchange, with approximately 85% of eligible bondholders ultimately participating.', tag: 'Negotiation' },
    { year: '2023', month: 'Mar', label: '2023', title: 'IMF Staff-Level Agreement', desc: 'Ghana secured a staff-level agreement with the IMF for a $3 billion Extended Credit Facility.', tag: 'IMF' },
    { year: '2023', month: 'May', label: '2023', title: 'IMF Loan Approval', desc: 'The IMF Executive Board approved the $3 billion loan program over three years to help restore macroeconomic stability and debt sustainability.', tag: 'IMF' },
    { year: '2023', month: 'Jun', label: '2023', title: 'Bilateral Creditors Committee Formation', desc: 'Ghana formed an official committee of bilateral creditors co-chaired by China and France to negotiate restructuring terms.', tag: 'Negotiation' },
    { year: '2023', month: 'Jul', label: '2023', title: 'Commercial Creditor Negotiations', desc: 'The government launched restructuring negotiations with its commercial creditors including Eurobond holders.', tag: 'Negotiation' },
    { year: '2023', month: 'Oct', label: '2023', title: 'Second IMF Review Announcement', desc: 'Ghana announced it would seek a second IMF review in November after completing the first review successfully.', tag: 'IMF' },
    { year: '2023', month: 'Dec', label: '2023', title: 'Official Creditor Financing Assurances', desc: 'The Official Creditor Committee (OCC) provided Ghana with financing assurances, a crucial step in the IMF program.', tag: 'Financial' },

    { year: '2024', month: 'Jan', label: '2024', title: 'Bilateral Debt Deal', desc: 'Ghana reached a deal in principle with official creditors to restructure $5.4 billion of bilateral debt.', tag: 'Agreement' },
    { year: '2024', month: 'Feb', label: '2024', title: 'Bondholder Agreement', desc: 'Ghana announced a tentative agreement with its bondholders to restructure $13 billion of international bonds.', tag: 'Agreement' },
    { year: '2024', month: 'Apr', label: '2024', title: 'Eurobond Restructuring Completion', desc: 'Ghana completed negotiations with its Eurobond creditors, restructuring approximately $13 billion in external debt with a 37% haircut.', tag: 'Milestone' },
    { year: '2024', month: 'Jun', label: '2024', title: 'Second IMF Review', desc: 'The government completed the second review of the IMF program, with continued implementation of fiscal consolidation measures.', tag: 'IMF' },
    { year: '2024', month: 'Oct', label: '2024', title: 'Final Eurobond Restructuring', desc: 'Ghana successfully completed the Eurobond restructuring process with creditor participation above 95%, achieving significant debt relief through maturity extensions and NPV reduction.', tag: 'Completion' },
    { year: '2024', month: 'Dec', label: '2024', title: 'Market Re-entry Preparation', desc: 'Ghana initiated preliminary discussions with international investors and rating agencies regarding potential market re-entry in 2025.', tag: 'Strategy' },

    { year: '2025', month: 'Mar', label: '2025', title: 'Third IMF Review Completion', desc: 'Ghana successfully completed the third review of its IMF Extended Credit Facility, unlocking additional funding and demonstrating continued progress in fiscal reforms.', tag: 'IMF' },
    { year: '2025', month: 'Jun', label: '2025', title: 'Debt Sustainability Milestone', desc: 'Ghana achieved significant improvement in debt-to-GDP ratio, falling to 55% from 62%, marking a critical milestone in debt sustainability targets under the IMF program.', tag: 'Achievement' },
    { year: '2025', month: 'Jul', label: '2025', title: 'Capital Market Re-entry Planning', desc: 'Ghana announced concrete plans for gradual return to international capital markets in Q4 2025, supported by improved macroeconomic indicators and successful debt restructuring outcomes.', tag: 'Planning' },
];

export default function DebtRestructuringJourney() {
    const [filterYear, setFilterYear] = useState('all');

    const filteredEvents = filterYear === 'all'
        ? timelineEvents
        : timelineEvents.filter(e => e.year === filterYear);

    return (
        <div className={styles.debtRestructuringDashboard}>
            {/* Overview Section */}
            <section className={styles.section}>
                <div className="mb-8 md:mb-10 max-w-3xl">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Ghana's Debt Restructuring Journey</h2>
                    <p className="text-slate-600 leading-relaxed">Key milestones and activities in Ghana's path to debt sustainability</p>
                </div>

                <div className={styles.statsCards}>
                    <div className={styles.statCard}>
                        <div className={styles.statInfo}>
                            <h3>$13 Billion</h3>
                            <p>Eurobond Debt Restructured</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statInfo}>
                            <h3>$3 Billion</h3>
                            <p>IMF Extended Credit Facility</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statInfo}>
                            <h3>$5.4 Billion</h3>
                            <p>Bilateral Debt Restructured</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statInfo}>
                            <h3>85%</h3>
                            <p>Domestic Debt Exchange Participation</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className={styles.section}>
                <div className="mb-8 md:mb-10 max-w-3xl">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Restructuring Timeline</h2>
                    <p className="text-slate-600 leading-relaxed">A chronological view of Ghana's debt restructuring activities</p>

                    {/* Filter Controls - Responsive */}
                    <div className="mt-6 flex flex-col items-center">
                        {/* Mobile Dropdown */}
                        <div className="md:hidden w-full max-w-xs relative">
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm font-medium"
                            >
                                {['all', '2022', '2023', '2024', '2025'].map(yr => (
                                    <option key={yr} value={yr}>
                                        {yr === 'all' ? 'All Years' : yr}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>

                        {/* Desktop Pills */}
                        <div className="hidden md:inline-flex bg-slate-100 p-1 rounded-full shadow-sm border border-slate-200">
                            {['all', '2022', '2023', '2024', '2025'].map(yr => (
                                <button
                                    key={yr}
                                    onClick={() => setFilterYear(yr)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${filterYear === yr
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                        }`}
                                >
                                    {yr === 'all' ? 'All Years' : yr}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.timeline}>
                    {filteredEvents.map((event, index) => (
                        <div key={index} className={styles.timelineItem} data-year={event.year}>
                            <div className={styles.timelineDate}>
                                <div className={styles.month}>{event.month}</div>
                                <div className={styles.year}>{event.label}</div>
                            </div>
                            <div className={styles.timelineDot}></div>
                            <div className={styles.timelineContent}>
                                <h3>{event.title}</h3>
                                <p>{event.desc}</p>
                                <span className={styles.timelineTag}>{event.tag}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Info Cards Section */}
            <section className={styles.section}>
                <div className="mb-8 md:mb-10 max-w-3xl">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Key Features of Ghana's Debt Restructuring</h2>
                    <p className="text-slate-600 leading-relaxed">Understanding the core components of the restructuring strategy</p>
                </div>

                <div className={styles.infoCards}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <svg viewBox="0 0 24 24" width="40" height="40">
                                <path fill="currentColor" d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M5,3H19C20.11,3 21,3.89 21,5V13.03C20.5,12.23 19.81,11.54 19,11V5H5V19H9.5C9.81,19.75 10.26,20.42 10.81,21H5C3.89,21 3,20.11 3,19V5C3,3.89 3.89,3 5,3M7,7H17V9H7V7M7,11H12.03C11.23,11.5 10.54,12.19 10,13H7V11M7,15H9.17C9.06,15.5 9,16 9,16.5V17H7V15Z" />
                            </svg>
                        </div>
                        <h3>Domestic Debt Exchange Program (DDEP)</h3>
                        <p>Extended maturities and lowered interest rates on domestic bonds to create fiscal space and ensure debt sustainability. Successfully completed with 85% participation rate.</p>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <svg viewBox="0 0 24 24" width="40" height="40">
                                <path fill="currentColor" d="M21,13.1C20.9,13.1 20.7,13.2 20.6,13.3L19.6,14.3L21.7,16.4L22.7,15.4C22.9,15.2 22.9,14.8 22.7,14.6L21.4,13.3C21.3,13.2 21.2,13.1 21,13.1M19.1,14.9L13,20.9V23H15.1L21.2,16.9L19.1,14.9M12.5,7V12.2L16.5,16.2L16,16.8L11.5,12.2V7H12.5M10,4.4C10,3.1 8.9,2 7.5,2S5,3.1 5,4.4C5,5.8 6.1,6.9 7.5,6.9C8.9,6.9 10,5.8 10,4.4M16.6,7.9C18,7.9 19.1,6.8 19.1,5.4S18,2.9 16.6,2.9C15.2,2.9 14.1,4 14.1,5.4S15.2,7.9 16.6,7.9M11.2,10.3C8.8,8.1 7.5,8.3 7.5,8.3S6.2,8.1 3.8,10.3C1.4,12.4 2,19.5 7.5,19.5C8.2,19.5 8.6,19.4 8.9,19.2C9.9,20.3 11.1,20.9 12.8,20.9L10.9,19C8.5,18.3 7.3,14.5 7.3,14.5C9.2,16.2 11.5,16.3 11.5,16.3L11.2,10.3M11.6,11.5L11.8,16.1C9.5,15.6 8.1,13.4 8.1,13.4C8.4,16.9 11,17.8 11,17.8L12.8,19.6C8.1,19.6 3.3,13.9 7.5,10.3C9,9 10.1,9.1 10.1,9.1L11.6,11.5Z" />
                            </svg>
                        </div>
                        <h3>External Debt Restructuring</h3>
                        <p>Comprehensive restructuring of $13 billion Eurobonds and $5.4 billion bilateral debt, achieving significant NPV reduction and maturity extensions to restore debt sustainability.</p>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <svg viewBox="0 0 24 24" width="40" height="40">
                                <path fill="currentColor" d="M11.8,10.9C9.53,10.31 8.8,9.7 8.8,8.75C8.8,7.66 9.81,6.9 11.5,6.9C13.28,6.9 13.94,7.75 14,9H16.21C16.14,7.28 15.09,5.7 13,5.19V3H10V5.16C8.06,5.58 6.5,6.84 6.5,8.77C6.5,11.08 8.41,12.23 11.2,12.9C13.7,13.5 14.2,14.38 14.2,15.31C14.2,16 13.71,17.1 11.5,17.1C9.44,17.1 8.63,16.18 8.5,15H6.32C6.44,17.19 8.08,18.42 10,18.83V21H13V18.85C14.95,18.5 16.5,17.35 16.5,15.3C16.5,12.46 14.07,11.5 11.8,10.9Z" />
                            </svg>
                        </div>
                        <h3>IMF Program Support</h3>
                        <p>$3 billion Extended Credit Facility program with comprehensive policy reforms, including fiscal consolidation and structural changes to restore macroeconomic stability.</p>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <svg viewBox="0 0 24 24" width="40" height="40">
                                <path fill="currentColor" d="M13.07 20H5V18H3V20C3 21.1 3.9 22 5 22H13.07C13.03 21.67 13 21.34 13 21C13 20.66 13.03 20.33 13.07 20M19 2H9C7.9 2 7 2.9 7 4V16C7 17.1 7.9 18 9 18H19C20.1 18 21 17.1 21 16V4C21 2.9 20.1 2 19 2M10 4H12V12L11 11.27L10 12V4M19 16H9V4H8V16H9H19M15.5 15C14.12 15 13 16.12 13 17.5C13 18.88 14.12 20 15.5 20S18 18.88 18 17.5C18 16.12 16.88 15 15.5 15M15.5 19C14.67 19 14 18.33 14 17.5C14 16.67 14.67 16 15.5 16S17 16.67 17 17.5C17 18.33 16.33 19 15.5 19Z" />
                            </svg>
                        </div>
                        <h3>Fiscal Consolidation Measures</h3>
                        <p>Implementation of comprehensive revenue enhancement and expenditure rationalization measures, including tax reforms and improved public financial management.</p>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <svg viewBox="0 0 24 24" width="40" height="40">
                                <path fill="currentColor" d="M11.5,1L2,6V8H21V6M16,10V17H19V10M2,22H21V19H2M10,10V17H13V10M4,10V17H7V10H4Z" />
                            </svg>
                        </div>
                        <h3>Financial Sector Reforms</h3>
                        <p>Strengthening banking sector regulations, improving supervision frameworks, and addressing vulnerabilities to create a more resilient financial system.</p>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <svg viewBox="0 0 24 24" width="40" height="40">
                                <path fill="currentColor" d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z" />
                            </svg>
                        </div>
                        <h3>Market Re-entry Strategy</h3>
                        <p>Comprehensive planning for gradual return to international capital markets, supported by improved credit ratings and restored investor confidence.</p>
                    </div>
                </div>
            </section>

            {/* Conclusion Section */}
            <section className={styles.section}>
                <div className="mb-8 md:mb-10 max-w-3xl">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Looking Ahead</h2>
                    <p className="text-black leading-relaxed">Prospects for Ghana&apos;s financial future after restructuring</p>
                </div>

                <div className={styles.conclusionContent}>
                    <div className={styles.conclusionText}>
                        <p>Ghana&apos;s comprehensive debt restructuring efforts have yielded significant positive results by mid-2025. The successful completion of both domestic and external debt restructuring has restored debt sustainability, with the debt-to-GDP ratio improving dramatically from 88% to 55%.</p>
                        <p>The ongoing IMF program has provided crucial support for macroeconomic stabilization, with inflation declining from over 50% to 13.7% and foreign exchange reserves gradually rebuilding. The successful implementation of fiscal reforms has enhanced revenue collection and improved public financial management.</p>
                        <p>With the completion of major restructuring milestones, Ghana is now positioned for a gradual return to international capital markets in late 2025, marking a significant achievement in the country&apos;s economic recovery journey. Continued adherence to fiscal discipline and structural reforms will be essential for maintaining this positive trajectory.</p>
                    </div>

                    <div className={styles.nextSteps}>
                        <h3>Key Next Steps for 2025</h3>
                        <ul>
                            <li>Complete remaining IMF program reviews and maintain reform momentum</li>
                            <li>Strengthen domestic revenue mobilization through improved tax administration</li>
                            <li>Enhance public financial management and transparency measures</li>
                            <li>Build adequate foreign exchange reserves for market re-entry</li>
                            <li>Prepare comprehensive market re-entry strategy for Q4 2025</li>
                            <li>Continue structural reforms to support long-term economic growth</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
