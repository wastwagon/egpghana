'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { parseDashboardRange, rangeCutoff } from '@/lib/dashboard-range';

export type DashboardSection = { id: string; label: string };

export default function DashboardToolbar({
    dashboard,
    sections,
}: {
    dashboard: 'economy' | 'debt' | 'imf';
    sections: DashboardSection[];
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const section = searchParams.get('section');
        if (!section) return;
        const el = document.getElementById(section);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [searchParams]);

    const chartRange = parseDashboardRange(searchParams.get('range') ?? undefined);

    const withQuery = useCallback(
        (overrides: Record<string, string>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(overrides)) {
                params.set(key, value);
            }
            const q = params.toString();
            return q ? `${pathname}?${q}` : pathname;
        },
        [pathname, searchParams],
    );

    const rangeExportHref = useCallback(() => {
        const to = new Date();
        const fmt = (d: Date) => d.toISOString().slice(0, 10);
        const cutoff = rangeCutoff(chartRange);
        if (cutoff) {
            return `/api/dashboards/export?dashboard=${dashboard}&from=${fmt(cutoff)}&to=${fmt(to)}`;
        }
        const from = new Date();
        from.setFullYear(from.getFullYear() - 1);
        return `/api/dashboards/export?dashboard=${dashboard}&from=${fmt(from)}&to=${fmt(to)}`;
    }, [chartRange, dashboard]);

    const briefingHref = `/api/dashboards/briefing?dashboard=${dashboard}&range=${chartRange}&print=1`;

    const share = useCallback(async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: document.title, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* user cancelled share */
        }
    }, []);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="flex flex-wrap gap-2">
                {sections.map((s) => (
                    <Link
                        key={s.id}
                        href={withQuery({ section: s.id })}
                        className="text-xs sm:text-sm font-medium px-3 py-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-primary-50 hover:text-primary-800 min-h-[36px] inline-flex items-center"
                    >
                        {s.label}
                    </Link>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
                <button type="button" onClick={share} className="btn-secondary text-sm px-4 py-2 min-h-[44px]">
                    {copied ? 'Link copied' : 'Share'}
                </button>
                <a
                    href={rangeExportHref()}
                    className="btn-secondary text-sm px-4 py-2 min-h-[44px]"
                    download
                >
                    CSV ({chartRange === 'all' ? '12 mo' : chartRange})
                </a>
                <a
                    href={`/api/dashboards/export?dashboard=${dashboard}`}
                    className="btn-primary text-sm px-4 py-2 min-h-[44px]"
                    download
                >
                    CSV (all)
                </a>
                <a
                    href={briefingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm px-4 py-2 min-h-[44px]"
                >
                    Print briefing
                </a>
                <a
                    href="/embed/indicators"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm px-4 py-2 min-h-[44px]"
                >
                    Embed widget
                </a>
            </div>
        </div>
    );
}
