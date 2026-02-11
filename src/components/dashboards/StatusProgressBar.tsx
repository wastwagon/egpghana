'use client';

interface StatusCounts {
    met: number;
    inProgress: number;
    notMet: number;
    pending: number;
}

interface StatusProgressBarProps {
    counts: StatusCounts;
    total: number;
}

export default function StatusProgressBar({ counts, total }: StatusProgressBarProps) {
    const getPercentage = (count: number) => ((count / total) * 100);

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold text-slate-900">Program Commitment Status</h3>
                <span className="text-sm font-bold text-slate-500">{total} Total Commitments</span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative h-8 w-full rounded-full overflow-hidden flex bg-slate-100">
                {/* Met Segment */}
                <div
                    className="h-full bg-green-500 hover:bg-green-600 transition-colors relative group"
                    style={{ width: `${getPercentage(counts.met)}%` }}
                >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.round(getPercentage(counts.met))}%
                    </div>
                </div>

                {/* In Progress Segment */}
                <div
                    className="h-full bg-blue-500 hover:bg-blue-600 transition-colors relative group"
                    style={{ width: `${getPercentage(counts.inProgress)}%` }}
                >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.round(getPercentage(counts.inProgress))}%
                    </div>
                </div>

                {/* Not Met Segment */}
                <div
                    className="h-full bg-red-500 hover:bg-red-600 transition-colors relative group"
                    style={{ width: `${getPercentage(counts.notMet)}%` }}
                >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.round(getPercentage(counts.notMet))}%
                    </div>
                </div>

                {/* Pending Segment */}
                <div
                    className="h-full bg-slate-300 hover:bg-slate-400 transition-colors relative group"
                    style={{ width: `${getPercentage(counts.pending)}%` }}
                >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.round(getPercentage(counts.pending))}%
                    </div>
                </div>
            </div>

            {/* Legend / Key Stats */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 leading-none">{counts.met}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Met</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 leading-none">{counts.inProgress}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">In Progress</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 leading-none">{counts.notMet}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Not Met</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-300 mr-2"></div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 leading-none">{counts.pending}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Pending</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
