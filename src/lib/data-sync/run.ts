import { prisma } from '@/lib/prisma';
import { processObservations, maybeDeriveDebtPerCapita } from './apply';
import { fetchBogHomepage, fetchBogTbill } from './fetchers/bog';
import { fetchBogSefdDebt } from './fetchers/bog-sefd';
import { fetchWorldBank } from './fetchers/worldbank';
import { fetchGssInflation, fetchGssQgdp } from './fetchers/gss';
import { fetchMofDebtWatcher } from './fetchers/mof';
import { fetchMofMidYear } from './fetchers/mof-midyear';
import type { SourceFetchResult, SyncRunSummary } from './types';

export type SyncSourceKey =
    | 'all'
    | 'gss_cpi'
    | 'gss_qgdp'
    | 'bog_homepage'
    | 'bog_tbill'
    | 'bog_sefd'
    | 'world_bank'
    | 'mof_midyear'
    | 'mof_watcher';

async function runFetcher(
    sourceKey: string,
    fetcher: () => Promise<SourceFetchResult>
): Promise<{ result: SourceFetchResult; summary: SyncRunSummary }> {
    const summary: SyncRunSummary = {
        checked: 0,
        unchanged: 0,
        applied: 0,
        proposed: 0,
        alerts: 0,
        errors: [],
    };

    const run = await prisma.dataSyncRun.create({
        data: {
            sourceKey,
            status: 'running',
        },
    });

    try {
        const result = await fetcher();
        if (result.warnings?.length) {
            summary.errors.push(...result.warnings);
        }

        await processObservations(sourceKey, result.observations, summary);

        if (result.alerts?.length) {
            for (const alert of result.alerts) {
                summary.alerts += 1;
                await prisma.dataSyncProposal.create({
                    data: {
                        indicator: 'SOURCE_ALERT',
                        source: result.label,
                        sourceKey,
                        proposedValue: 0,
                        asOfDate: new Date(),
                        sourceUrl: alert.sourceUrl,
                        note: `${alert.title}: ${alert.detail}`,
                        status: 'pending',
                        autoApplied: false,
                        metadata: { kind: 'alert', title: alert.title },
                    },
                });
            }
        }

        await prisma.dataSyncRun.update({
            where: { id: run.id },
            data: {
                status: summary.errors.length ? 'partial' : 'success',
                finishedAt: new Date(),
                summary: summary as object,
                error: summary.errors.length ? summary.errors.join('; ') : null,
            },
        });

        return { result, summary };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        summary.errors.push(message);
        await prisma.dataSyncRun.update({
            where: { id: run.id },
            data: {
                status: 'failed',
                finishedAt: new Date(),
                summary: summary as object,
                error: message,
            },
        });
        throw err;
    }
}

export async function runDataSync(source: SyncSourceKey = 'all') {
    const results: Array<{ sourceKey: string; summary: SyncRunSummary }> = [];
    const aggregate: SyncRunSummary = {
        checked: 0,
        unchanged: 0,
        applied: 0,
        proposed: 0,
        alerts: 0,
        errors: [],
    };

    const jobs: Array<{ key: SyncSourceKey; run: () => Promise<{ result: SourceFetchResult; summary: SyncRunSummary }> }> = [];

    if (source === 'all' || source === 'gss_cpi') {
        jobs.push({ key: 'gss_cpi', run: () => runFetcher('gss_cpi', fetchGssInflation) });
    }
    if (source === 'all' || source === 'gss_qgdp') {
        jobs.push({ key: 'gss_qgdp', run: () => runFetcher('gss_qgdp', fetchGssQgdp) });
    }
    if (source === 'all' || source === 'bog_homepage') {
        jobs.push({ key: 'bog_homepage', run: () => runFetcher('bog_homepage', fetchBogHomepage) });
    }
    if (source === 'all' || source === 'bog_tbill') {
        jobs.push({ key: 'bog_tbill', run: () => runFetcher('bog_tbill', fetchBogTbill) });
    }
    if (source === 'all' || source === 'world_bank') {
        jobs.push({ key: 'world_bank', run: () => runFetcher('world_bank', fetchWorldBank) });
    }
    // Monthly BoG SEFD, then Mid-Year budget (preferred H1 authority), then quarterly bulletin
    if (source === 'all' || source === 'bog_sefd') {
        jobs.push({ key: 'bog_sefd', run: () => runFetcher('bog_sefd', fetchBogSefdDebt) });
    }
    if (source === 'all' || source === 'mof_midyear') {
        jobs.push({ key: 'mof_midyear', run: () => runFetcher('mof_midyear', fetchMofMidYear) });
    }
    if (source === 'all' || source === 'mof_watcher') {
        jobs.push({ key: 'mof_watcher', run: () => runFetcher('mof_watcher', fetchMofDebtWatcher) });
    }

    for (const job of jobs) {
        try {
            const { summary } = await job.run();
            results.push({ sourceKey: job.key, summary });
            aggregate.checked += summary.checked;
            aggregate.unchanged += summary.unchanged;
            aggregate.applied += summary.applied;
            aggregate.proposed += summary.proposed;
            aggregate.alerts += summary.alerts;
            aggregate.errors.push(...summary.errors);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            results.push({
                sourceKey: job.key,
                summary: { checked: 0, unchanged: 0, applied: 0, proposed: 0, alerts: 0, errors: [message] },
            });
            aggregate.errors.push(`${job.key}: ${message}`);
        }
    }

    // Derive debt/capita after debt + population sources may have updated
    if (source === 'all' || source === 'world_bank') {
        try {
            await maybeDeriveDebtPerCapita(aggregate);
        } catch (err) {
            aggregate.errors.push(err instanceof Error ? err.message : String(err));
        }
    }

    return { aggregate, results };
}

export async function getSyncDashboard() {
    const [pending, recentRuns, latestByIndicator] = await Promise.all([
        prisma.dataSyncProposal.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'desc' },
            take: 50,
        }),
        prisma.dataSyncRun.findMany({
            orderBy: { startedAt: 'desc' },
            take: 20,
        }),
        prisma.economicData.findMany({
            where: {
                indicator: {
                    in: [
                        'INFLATION_RATE',
                        'GDP_GROWTH',
                        'POLICY_RATE',
                        'TREASURY_BILL_91D',
                        'GDP_NOMINAL_USD',
                        'PER_CAPITA_INCOME_USD',
                        'DEBT_STOCK_TOTAL',
                        'TOTAL_DEBT',
                        'DEBT_TO_GDP_RATIO',
                        'DEBT_PER_CAPITA',
                    ],
                },
            },
            orderBy: { date: 'desc' },
            take: 40,
        }),
    ]);

    // Deduplicate latest per indicator+source
    const seen = new Set<string>();
    const latest = latestByIndicator.filter((row) => {
        const key = `${row.indicator}|${row.source}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return { pending, recentRuns, latest };
}
