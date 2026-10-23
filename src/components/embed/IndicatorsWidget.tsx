'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type IndicatorRow = {
    key: string;
    label: string;
    value: number | null;
    unit: string | null;
    asOf: string | null;
};

function formatValue(row: IndicatorRow) {
    if (row.value == null) return '—';
    if (row.key === 'forex_reserves') return `$${(row.value / 1000).toFixed(2)}B`;
    if (row.key === 'exchange_rate_usd') return row.value.toFixed(2);
    if (row.key.includes('gdp') || row.key.includes('inflation') || row.key.includes('debt_to') || row.key === 'policy_rate') {
        return `${row.value.toFixed(1)}%`;
    }
    if (row.key === 'debt_stock_total') return `GHS ${(row.value / 1000).toFixed(1)}B`;
    return row.value.toLocaleString('en-GB');
}

export default function IndicatorsWidget({ compact = false }: { compact?: boolean }) {
    const [rows, setRows] = useState<IndicatorRow[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('/api/indicators/latest');
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || 'Failed to load');
                if (!cancelled) setRows(json.indicators ?? []);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className={`bg-white text-slate-900 ${compact ? 'p-3' : 'p-4 sm:p-5'} rounded-xl border border-slate-200 shadow-sm`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">EGP Ghana</p>
                    <h1 className={`font-heading font-bold text-slate-900 ${compact ? 'text-base' : 'text-lg'}`}>
                        Headline indicators
                    </h1>
                </div>
                <Link
                    href="/dashboards/economy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary-700 hover:text-primary-900 whitespace-nowrap min-h-[36px] inline-flex items-center"
                >
                    Full dashboards →
                </Link>
            </div>

            {loading && <p className="text-sm text-slate-500">Loading…</p>}
            {error && <p className="text-sm text-red-700">{error}</p>}

            {!loading && !error && (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-100">
                            <th className="py-2 pr-2 font-medium">Indicator</th>
                            <th className="py-2 pr-2 font-medium text-right">Latest</th>
                            {!compact && <th className="py-2 font-medium text-right hidden sm:table-cell">As of</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.key} className="border-b border-slate-50 last:border-0">
                                <td className="py-2 pr-2 text-slate-700">{row.label}</td>
                                <td className="py-2 pr-2 text-right font-semibold tabular-nums">{formatValue(row)}</td>
                                {!compact && (
                                    <td className="py-2 text-right text-slate-500 hidden sm:table-cell tabular-nums">
                                        {row.asOf ?? '—'}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <p className="text-[10px] text-slate-400 mt-3 leading-snug">
                Indicative only; verify against official publications. Data via{' '}
                <Link href="/" target="_blank" rel="noopener noreferrer" className="underline">
                    egpghana.org
                </Link>
                .
            </p>
        </div>
    );
}
