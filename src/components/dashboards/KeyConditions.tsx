'use client';

import { useState } from 'react';

type Condition = {
    title: string;
    description: string;
    details?: string;
    icon: string; // Using emojis for now as per the design icons
};

type TabData = {
    id: string;
    label: string;
    number: string;
    heading: string;
    subheading: string;
    items: Condition[];
    image?: string; // Placeholder for the side image
};

const tabs: TabData[] = [
    {
        id: 'prior-actions',
        label: 'Prior Actions',
        number: '1',
        heading: 'Prior Actions',
        subheading: 'The ECF for Ghana outlined 5 key prior actions necessary for the approval of the program. These actions were to ensure that Ghana was taking the necessary steps to stabilize the economy and meet the IMF\'s requirements.',
        items: [
            {
                title: 'Fiscal Consolidation Measures',
                description: '2023 Budget Approval: Ghana had to pass a budget that emphasized revenue enhancement and expenditure rationalizations.\n\nRevenue Mobilization: Implementation of measures to improve tax collection and broaden the tax base.',
                icon: '💰'
            },
            {
                title: 'Debt Restructuring',
                description: 'Agreement with External Creditors: Reaching agreements with external creditors to restructure debt, addressing severe financing constraints unsustainable public debt.',
                icon: '📊'
            },
            {
                title: 'Strengthening Public Financial Management',
                description: 'Implementing steps to enhance transparency and efficiency in the public spending through better audit and control mechanisms e.g. publication of Audit Report on Covid-19 Expenditure',
                icon: '🏛️'
            },
            {
                title: 'Banking Sector Reforms',
                description: 'Financial Sector Stability: Measures aimed at strengthening banking regulations and improving financial sector oversight to ensure stability',
                icon: '🏦'
            },
            {
                title: 'Energy Sector Reforms',
                description: 'Utility Tariffs: Adjusting utility tariffs to ensure cost recovery and reduce the financial burden on the government',
                icon: '⚡'
            }
        ]
    },
    {
        id: 'performance-indicators',
        label: 'Performance Indicators',
        number: '2',
        heading: 'Quantitative Performance Indicators',
        subheading: 'These are specific, measurable targets that Ghana must achieve to continue receiving funds from the IMF',
        items: [
            {
                title: 'Primary Fiscal Balance',
                description: 'Targets set to reduce the fiscal deficit.',
                icon: '📈'
            },
            {
                title: 'Net International Reserves',
                description: 'Specific levels of reserves Ghana must maintain.',
                icon: '💎'
            },
            {
                title: 'Inflation Rates',
                description: 'Targets to bring inflation back to single digit.',
                icon: '📉'
            },
            {
                title: 'Public Debt Levels',
                description: 'Specific reduction targets for the debt-to-GDP ratio.',
                icon: '📋'
            }
        ]
    },
    {
        id: 'structural-reforms',
        label: 'Structural Reforms',
        number: '3',
        heading: 'Structural Reforms',
        subheading: 'These are comprehensive reforms aimed at addressing systemic issues and enhancing economic stability',
        items: [
            {
                title: 'Tax Policy & Revenue Administration',
                description: 'Reforms to improve tax collection and broaden the tax base.',
                icon: '💼'
            },
            {
                title: 'Public Financial Management',
                description: 'Measures to enhance transparency and efficiency in public spending.',
                icon: '🎯'
            },
            {
                title: 'Energy and Cocoa Sectors',
                description: 'Reforms to address inefficiencies and vulnerabilities in these critical sectors.',
                icon: '🌱'
            },
            {
                title: 'Financial Sector Stability',
                description: 'Measures to strengthen banking regulations and improve financial sector oversight.',
                icon: '🛡️'
            }
        ]
    },
    {
        id: 'indicative-targets',
        label: 'Indicative Targets',
        number: '4',
        heading: 'Indicative Targets',
        subheading: 'These are benchmarks that, while not binding, are used to monitor Ghana\'s progress',
        items: [
            {
                title: 'Social Spending',
                description: 'Ensuring that budget adjustments do not disproportionately affect vulnerable populations, maintaining or increasing spending on social programs e.g. LEAP, School Feeding Program & Capitation Grant.',
                icon: '🤝'
            },
            {
                title: 'Private Sector Investment',
                description: 'Encouraging policies to boost private investment and economic growth.',
                icon: '🚀'
            },
            {
                title: 'Debt Service Payments',
                description: 'Maintaining specific levels of debt service to avoid defaults.',
                icon: '💳'
            }
        ]
    }
];

export default function KeyConditions() {
    const [activeTabId, setActiveTabId] = useState('prior-actions');
    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    return (
        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
            {/* Header - Left Aligned to Match Other Sections */}
            <div className="py-8 px-6 md:px-12 border-b border-slate-100">
                <div className="mb-8 md:mb-10 max-w-3xl">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                        Key Conditions of the IMF Bailout
                    </h2>
                    <p className="text-black leading-relaxed">
                        Comprehensive guide to Ghana's Economic Recovery Framework outlining prior actions, performance indicators, structural reforms, and indicative targets.
                    </p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200 bg-white sticky top-0 z-20">
                <div className="flex overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`flex items-center space-x-3 px-6 py-4 transition-colors whitespace-nowrap border-b-2 ${activeTabId === tab.id
                                ? 'border-red-600 bg-red-50/50'
                                : 'border-transparent hover:bg-slate-50'
                                }`}
                        >
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${activeTabId === tab.id ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-black'
                                }`}>
                                {tab.number}
                            </span>
                            <span className={`font-semibold ${activeTabId === tab.id ? 'text-slate-900' : 'text-slate-500'
                                }`}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-12 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {activeTab.heading}
                        </h3>
                        <p className="text-sm text-black leading-relaxed max-w-4xl">
                            {activeTab.subheading}
                        </p>
                    </div>

                    {/* Content Grid - Full Width Professional Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeTab.items.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 mb-2">
                                        {item.title}
                                    </h4>
                                    <div className="text-sm text-black leading-relaxed whitespace-pre-line">
                                        {item.description.split('\n\n').map((line, i) => (
                                            <p key={i} className={i > 0 ? 'mt-2' : ''}>
                                                {line.split(/(.*?): /).map((part, j, arr) => {
                                                    // Simple bolding logic for "Label: Description" format
                                                    if (j === 1 && arr[2]) return <strong key={j} className="text-red-700">{part}: </strong>;
                                                    if (j === 2) return part;
                                                    return part;
                                                })}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
