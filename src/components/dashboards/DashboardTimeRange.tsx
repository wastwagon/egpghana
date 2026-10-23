'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { DashboardRange } from '@/lib/dashboard-range';

const RANGES: { id: DashboardRange; label: string }[] = [
    { id: '1y', label: '1 year' },
    { id: '3y', label: '3 years' },
    { id: '5y', label: '5 years' },
    { id: 'all', label: 'All data' },
];

export default function DashboardTimeRange() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const section = searchParams.get('section');
    const current = (searchParams.get('range') as DashboardRange) || '3y';

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-medium text-slate-500 mr-1">Chart range</span>
            {RANGES.map((r) => {
                const params = new URLSearchParams();
                if (section) params.set('section', section);
                if (r.id !== '3y') params.set('range', r.id);
                const href = params.toString() ? `${pathname}?${params}` : pathname;
                const active = current === r.id || (current === '3y' && r.id === '3y' && !searchParams.get('range'));
                return (
                    <Link
                        key={r.id}
                        href={href}
                        className={`text-xs font-medium px-3 py-2 rounded-lg min-h-[36px] inline-flex items-center transition-colors ${
                            active
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-50 text-slate-700 hover:bg-primary-50 hover:text-primary-800'
                        }`}
                    >
                        {r.label}
                    </Link>
                );
            })}
        </div>
    );
}
