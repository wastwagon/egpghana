'use client';

interface EconomicIndicator {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    unit: string;
    icon: React.ReactNode;
}

interface EconomicSummaryCardsProps {
    indicators: EconomicIndicator[];
}

export default function EconomicSummaryCards({ indicators }: EconomicSummaryCardsProps) {
    const getChangeColor = (type: string) => {
        switch (type) {
            case 'positive':
                return 'text-emerald-600';
            case 'negative':
                return 'text-rose-600';
            default:
                return 'text-black';
        }
    };

    const getChangeIcon = (type: string) => {
        if (type === 'positive') {
            return (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            );
        } else if (type === 'negative') {
            return (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((indicator, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-black mb-1 uppercase tracking-wide">{indicator.title}</h4>
                            <div className="text-3xl font-bold text-slate-900">
                                {indicator.value}
                                <span className="text-sm font-medium text-slate-400 ml-1">{indicator.unit}</span>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-300">
                            {indicator.icon}
                        </div>
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${getChangeColor(indicator.changeType)}`}>
                        {getChangeIcon(indicator.changeType)}
                        <span>{indicator.change}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
