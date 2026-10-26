'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw, Check, X, ExternalLink } from 'lucide-react';

type Proposal = {
    id: string;
    indicator: string;
    source: string;
    sourceKey: string;
    currentValue: number | null;
    proposedValue: number;
    unit: string | null;
    asOfDate: string;
    sourceUrl: string | null;
    note: string | null;
    status: string;
    createdAt: string;
};

type SyncRun = {
    id: string;
    sourceKey: string;
    status: string;
    startedAt: string;
    finishedAt: string | null;
    summary: {
        checked?: number;
        applied?: number;
        proposed?: number;
        unchanged?: number;
        alerts?: number;
        errors?: string[];
    } | null;
    error: string | null;
};

type LatestRow = {
    id: string;
    indicator: string;
    value: number;
    date: string;
    source: string;
    unit: string | null;
};

export default function DataSyncPanel() {
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [embeddingRefresh, setEmbeddingRefresh] = useState(false);
    const [embeddingMessage, setEmbeddingMessage] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState<Proposal[]>([]);
    const [recentRuns, setRecentRuns] = useState<SyncRun[]>([]);
    const [latest, setLatest] = useState<LatestRow[]>([]);
    const [lastResult, setLastResult] = useState<string>('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/data-sync');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load');
            setPending(data.pending || []);
            setRecentRuns(data.recentRuns || []);
            setLatest(data.latest || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const runSync = async (source = 'all') => {
        setSyncing(true);
        setError('');
        setLastResult('');
        try {
            const res = await fetch('/api/admin/data-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Sync failed');
            const a = data.aggregate;
            setLastResult(
                `Checked ${a.checked}, applied ${a.applied}, proposed ${a.proposed}, alerts ${a.alerts}, unchanged ${a.unchanged}`
            );
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    const runEmbeddingRefresh = async () => {
        setEmbeddingRefresh(true);
        setEmbeddingMessage('');
        setError('');
        try {
            const res = await fetch('/api/admin/embeddings', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Embedding refresh failed');
            setEmbeddingMessage(`Updated ${data.articles} articles and ${data.resources} resources.`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Embedding refresh failed');
        } finally {
            setEmbeddingRefresh(false);
        }
    };

    const review = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`/api/admin/data-sync/proposals/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Review failed');
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Review failed');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading sync status…
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">External sources</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Preferred debt authority: MoF Mid-Year Fiscal Policy Review (H1). BoG SEFD fills monthly gaps; older extracts never overwrite newer dates.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => runSync('all')}
                        disabled={syncing}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Check all sources
                    </button>
                    <button
                        type="button"
                        onClick={() => runSync('gss_cpi')}
                        disabled={syncing}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                        GSS CPI
                    </button>
                    <button
                        type="button"
                        onClick={() => runSync('gss_qgdp')}
                        disabled={syncing}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                        GSS QGDP
                    </button>
                    <button
                        type="button"
                        onClick={() => runSync('bog_homepage')}
                        disabled={syncing}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                        BoG only
                    </button>
                    <button
                        type="button"
                        onClick={() => runSync('world_bank')}
                        disabled={syncing}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                        World Bank
                    </button>
                    <button
                        type="button"
                        onClick={() => runSync('mof_midyear')}
                        disabled={syncing}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                        Mid-Year budget
                    </button>
                    <button
                        type="button"
                        onClick={() => runSync('bog_sefd')}
                        disabled={syncing}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                        BoG SEFD
                    </button>
                    <button
                        type="button"
                        onClick={() => runSync('mof_watcher')}
                        disabled={syncing}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                        MoF bulletin
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">{error}</div>
            )}
            {lastResult && (
                <div className="p-3 text-sm text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-100">{lastResult}</div>
            )}

            {/* Pending approvals / alerts */}
            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        Pending review ({pending.length})
                    </h3>
                </div>
                {pending.length === 0 ? (
                    <p className="p-5 text-sm text-gray-500">No pending proposals. Market rates auto-apply when they change.</p>
                ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {pending.map((p) => (
                            <li key={p.id} className="p-5 flex flex-col md:flex-row md:items-start gap-4 justify-between">
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-white">{p.indicator}</p>
                                    <p className="text-sm text-gray-500 mt-1">{p.note || p.sourceKey}</p>
                                    {p.indicator !== 'SOURCE_ALERT' && (
                                        <p className="text-sm mt-2">
                                            <span className="text-gray-500">Current:</span>{' '}
                                            {p.currentValue ?? '—'} →{' '}
                                            <span className="font-semibold text-blue-600">{p.proposedValue}{p.unit ? ` ${p.unit}` : ''}</span>
                                        </p>
                                    )}
                                    {p.sourceUrl && (
                                        <a
                                            href={p.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-blue-600 mt-2 hover:underline"
                                        >
                                            Open source <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {p.indicator !== 'SOURCE_ALERT' && (
                                        <button
                                            type="button"
                                            onClick={() => review(p.id, 'approve')}
                                            className="inline-flex items-center px-3 py-1.5 text-sm text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
                                        >
                                            <Check className="w-4 h-4 mr-1" /> Approve
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => review(p.id, 'reject')}
                                        className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-200 dark:border-gray-600"
                                    >
                                        <X className="w-4 h-4 mr-1" /> Dismiss
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Latest live values */}
            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Latest stored values</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-left text-gray-500">
                            <tr>
                                <th className="px-5 py-3 font-medium">Indicator</th>
                                <th className="px-5 py-3 font-medium">Value</th>
                                <th className="px-5 py-3 font-medium">Source</th>
                                <th className="px-5 py-3 font-medium">As of</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {latest.map((row) => (
                                <tr key={row.id}>
                                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{row.indicator}</td>
                                    <td className="px-5 py-3">{row.value}{row.unit ? ` ${row.unit}` : ''}</td>
                                    <td className="px-5 py-3 text-gray-500">{row.source}</td>
                                    <td className="px-5 py-3 text-gray-500">
                                        {new Date(row.date).toLocaleDateString('en-GB')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Recent runs */}
            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Recent sync runs</h3>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentRuns.length === 0 ? (
                        <li className="p-5 text-sm text-gray-500">No sync runs yet. Click “Check all sources”.</li>
                    ) : (
                        recentRuns.map((run) => (
                            <li key={run.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-900 dark:text-white">{run.sourceKey}</span>
                                    <span className="text-gray-500 ml-2">
                                        {new Date(run.startedAt).toLocaleString('en-GB')}
                                    </span>
                                </div>
                                <div className="text-gray-500">
                                    <span className={`font-medium ${run.status === 'success' ? 'text-emerald-600' : run.status === 'failed' ? 'text-red-600' : 'text-amber-600'}`}>
                                        {run.status}
                                    </span>
                                    {run.summary && (
                                        <span className="ml-2">
                                            applied {run.summary.applied ?? 0} · proposed {run.summary.proposed ?? 0}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">AI search index</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Regenerate embeddings for the public chatbot after bulk content imports. Requires OpenAI API key.
                </p>
                <button
                    type="button"
                    onClick={runEmbeddingRefresh}
                    disabled={embeddingRefresh}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                    {embeddingRefresh ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Refresh embeddings
                </button>
                {embeddingMessage && <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{embeddingMessage}</p>}
            </section>
        </div>
    );
}
