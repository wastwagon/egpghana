interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
    description?: string;
    date?: string;
}

export default function StatCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
    description,
    date,
}: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wide">{title}</p>
                    <p className="text-slate-900 text-3xl md:text-4xl font-bold font-heading">
                        {value}
                    </p>
                </div>
                {icon && (
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-300">
                        {icon}
                    </div>
                )}
            </div>

            {change && (
                <div className="flex items-center space-x-2 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-bold ${changeType === 'positive' ? 'bg-green-100 text-green-700' :
                        changeType === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-600'
                        }`}>
                        {changeType === 'positive' && '↑'}
                        {changeType === 'negative' && '↓'}
                        <span className="ml-1">{change}</span>
                    </span>
                    <span className="text-slate-400 text-xs font-medium">vs last review</span>
                </div>
            )}

            {description && (
                <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-100 pt-3 mt-1">
                    {description}
                </p>
            )}
            {date && (
                <div className="absolute top-4 right-4 text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                    {date}
                </div>
            )}
        </div>
    );
}
