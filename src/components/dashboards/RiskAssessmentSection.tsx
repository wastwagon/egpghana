import React from 'react';

interface RiskItem {
    label: string;
    description: string;
    severity: 'positive' | 'resolved' | 'medium' | 'high' | 'stable';
}

const RiskBadge = ({ severity }: { severity: RiskItem['severity'] }) => {
    const styles = {
        positive: 'bg-green-100 text-green-700 border-green-200',
        resolved: 'bg-blue-100 text-blue-700 border-blue-200',
        medium: 'bg-amber-100 text-amber-700 border-amber-200',
        high: 'bg-rose-100 text-rose-700 border-rose-200',
        stable: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    const labels = {
        positive: 'POSITIVE',
        resolved: 'RESOLVED',
        medium: 'MEDIUM RISK',
        high: 'HIGH RISK',
        stable: 'STABLE',
    };

    return (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${styles[severity]}`}>
            {labels[severity]}
        </span>
    );
};

export default function RiskAssessmentSection() {
    const externalRisks: RiskItem[] = [
        { label: 'Debt Restructuring', description: 'Major 23.1% reduction reflects successful debt restructuring efforts', severity: 'positive' },
        { label: 'Eurobond Restructuring', description: 'Completed Oct 2024 with 37% haircut', severity: 'resolved' },
        { label: 'China Debt', description: '28% of external debt, renegotiation ongoing', severity: 'medium' },
        { label: 'FX Risk', description: 'Currency volatility impacts debt servicing costs', severity: 'medium' },
        { label: 'IMF Program', description: '$3B Extended Credit Facility ongoing', severity: 'stable' },
    ];

    const domesticRisks: RiskItem[] = [
        { label: 'Increased Borrowing', description: '15.4% rise indicates higher domestic financing needs', severity: 'high' },
        { label: 'Banking Exposure', description: '65% held by local banks, systemic risk', severity: 'high' },
        { label: 'Short-term Bills', description: '36.5% in T-bills, rollover pressure', severity: 'high' },
        { label: 'Interest Burden', description: '18% policy rate drives up costs', severity: 'medium' },
        { label: 'Pension Funds', description: 'Major holders, social security impact', severity: 'medium' },
    ];

    return (
        <section className="section py-8 md:py-12 bg-white border-t border-slate-100" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div className="container">
                <div className="mb-8 md:mb-10 max-w-3xl">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Risk & Impact Analysis</h2>
                    <p className="text-black leading-relaxed">
                        Assessment of external and domestic risks potentially improving or threatening debt sustainability.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* External Risks */}
                    <div className="bg-white rounded-xl border-l-4 border-yellow-400 shadow-sm p-6 border-y border-r border-slate-200">
                        <h3 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-100 pb-3">External Debt Key Risks</h3>
                        <ul className="space-y-4">
                            {externalRisks.map((risk, index) => (
                                <li key={index} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-sm">
                                    <div className="flex-1">
                                        <span className="font-bold text-slate-900 block mb-1">{risk.label}</span>
                                        <span className="text-black leading-relaxed">{risk.description}</span>
                                    </div>
                                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                                        <RiskBadge severity={risk.severity} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Domestic Risks */}
                    <div className="bg-white rounded-xl border-l-4 border-emerald-600 shadow-sm p-6 border-y border-r border-slate-200">
                        <h3 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-100 pb-3">Domestic Debt Key Risks</h3>
                        <ul className="space-y-4">
                            {domesticRisks.map((risk, index) => (
                                <li key={index} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-sm">
                                    <div className="flex-1">
                                        <span className="font-bold text-slate-900 block mb-1">{risk.label}</span>
                                        <span className="text-black leading-relaxed">{risk.description}</span>
                                    </div>
                                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                                        <RiskBadge severity={risk.severity} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
