import React from 'react';

export interface IndicatorData {
    id: string;
    category: 'debt' | 'gdp' | 'market';
    title: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    trendValue: string;
    analysis: string;
    source: string;
    tag?: {
        label: string;
        type: 'high' | 'moderate' | 'target' | 'improving';
    };
}

interface IndicatorCardProps {
    data: IndicatorData;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ data }) => {
    const { category, title, value, trend, trendValue, analysis, source, tag } = data;

    const getTrendColor = (trend: string, category: string) => {
        // For debt/inflation, down is usually good (green), up is bad (red)
        // For GDP/Revenue, up is good (green), down is bad (red)

        const isPositiveMetric = ['gdp'].includes(category);
        const isNegativeMetric = ['debt', 'market'].includes(category); // market includes inflation/interest rates

        if (trend === 'stable') return 'text-amber-500 bg-amber-50';

        if (isNegativeMetric) {
            return trend === 'down' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50';
        }
        return trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50';
    };

    const getTagStyle = (type: string) => {
        switch (type) {
            case 'high': return 'bg-rose-100 text-rose-700';
            case 'moderate': return 'bg-amber-100 text-amber-700';
            case 'target': return 'bg-emerald-100 text-emerald-700';
            case 'improving': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'debt': return 'border-t-4 border-rose-600';
            case 'gdp': return 'border-t-4 border-emerald-600';
            case 'market': return 'border-t-4 border-amber-500';
            default: return 'border-t-4 border-slate-200';
        }
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col h-full ${getCategoryColor(category)}`}>
            <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-800 leading-snug min-h-[40px]">{title}</h3>
            </div>

            <div className="flex items-end gap-2 mb-3">
                <span className="text-2xl font-bold text-slate-900">{value}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-1 flex items-center gap-1 ${getTrendColor(trend, category)}`}>
                    {trend === 'down' ? '↘' : trend === 'up' ? '↗' : '→'} {trendValue}
                </span>
            </div>

            {tag && (
                <div className="mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${getTagStyle(tag.type)}`}>
                        {tag.label}
                    </span>
                </div>
            )}

            <div className="bg-slate-50 border-l-2 border-slate-300 p-3 rounded-r-md mb-4 flex-grow">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {analysis}
                </p>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                <svg className="w-3 h-3 mr-1.5 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
                Source: {source}
            </div>
        </div>
    );
};

export default IndicatorCard;
