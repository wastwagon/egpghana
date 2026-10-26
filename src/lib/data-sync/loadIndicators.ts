import { prisma } from '@/lib/prisma';
import type { IndicatorData } from '@/components/dashboards/IndicatorCard';
import type { EconomicData } from '@prisma/client';
import { findLatestDebtHeadline, findPreviousForRow, formatIndicatorProvenance } from '@/lib/economic-authority';
import { INDICATOR_CATALOG, type CatalogEntry } from './catalog';

const DEBT_HEADLINE_INDICATORS = new Set([
    'DEBT_STOCK_TOTAL',
    'DEBT_EXTERNAL',
    'DEBT_DOMESTIC',
    'TOTAL_DEBT',
]);

function formatValue(value: number, format: CatalogEntry['format']): string {
    switch (format) {
        case 'ghs_billions':
            return `GH₵ ${(value / 1_000_000_000).toLocaleString('en-US', { maximumFractionDigits: 1 })}B`;
        case 'usd_billions':
            return `$ ${(value / 1_000_000_000).toLocaleString('en-US', { maximumFractionDigits: 2 })}B`;
        case 'usd':
            return `$ ${Math.round(value).toLocaleString('en-US')}`;
        case 'ghs':
            return `GH₵ ${Math.round(value).toLocaleString('en-US')}`;
        case 'percent':
            return `${Number(value.toFixed(2))}%`;
        case 'percent_band':
            return `${Number(value.toFixed(0))}% ± 2%`;
        default:
            return String(value);
    }
}

function trendFromDelta(delta: number | null, category: CatalogEntry['category']): {
    trend: IndicatorData['trend'];
    trendValue: string;
} {
    if (delta == null || Math.abs(delta) < 1e-9) {
        return { trend: 'stable', trendValue: 'Stable' };
    }
    const up = delta > 0;
    const abs = Math.abs(delta);
    const pts = category === 'debt' || category === 'market' || category === 'gdp';
    return {
        trend: up ? 'up' : 'down',
        trendValue: pts
            ? `${up ? '+' : ''}${abs.toFixed(abs >= 10 ? 1 : 2)}${category === 'debt' && abs < 5 ? 'pts' : abs < 20 ? 'pts' : ''}`
            : `${up ? '+' : ''}${abs.toFixed(1)}`,
    };
}

async function latestForEntry(entry: CatalogEntry): Promise<EconomicData[]> {
    const sources = entry.sourcePriority?.length ? entry.sourcePriority : [entry.source];

    if (entry.indicator === 'GDP_GROWTH') {
        const gss = await prisma.economicData.findFirst({
            where: { indicator: 'GDP_GROWTH', source: 'Ghana Statistical Service' },
            orderBy: { date: 'desc' },
        });
        if (gss) {
            const previous = await findPreviousForRow(gss);
            return previous ? [gss, previous] : [gss];
        }
    }

    if (entry.indicator === 'INFLATION_RATE') {
        const gss = await prisma.economicData.findFirst({
            where: { indicator: 'INFLATION_RATE', source: 'Ghana Statistical Service' },
            orderBy: { date: 'desc' },
        });
        if (gss) {
            const previous = await findPreviousForRow(gss);
            return previous ? [gss, previous] : [gss];
        }
    }

    if (DEBT_HEADLINE_INDICATORS.has(entry.indicator)) {
        const current = await findLatestDebtHeadline(entry.indicator, sources);
        if (!current) return [];
        const previous = await findPreviousForRow(current);
        return previous ? [current, previous] : [current];
    }

    const candidates: EconomicData[] = [];
    for (const source of sources) {
        const row = await prisma.economicData.findFirst({
            where: { indicator: entry.indicator, source },
            orderBy: { date: 'desc' },
        });
        if (row) candidates.push(row);
    }

    if (!candidates.length) {
        const any = await prisma.economicData.findFirst({
            where: { indicator: entry.indicator },
            orderBy: { date: 'desc' },
        });
        if (!any) return [];
        const prev = await findPreviousForRow(any);
        return prev ? [any, prev] : [any];
    }

    candidates.sort((a, b) => {
        const dateDiff = b.date.getTime() - a.date.getTime();
        if (dateDiff !== 0) return dateDiff;
        return sources.indexOf(a.source) - sources.indexOf(b.source);
    });

    const current = candidates[0];
    const previous = await findPreviousForRow(current);
    return previous ? [current, previous] : [current];
}

export async function loadIndicatorGridData(): Promise<{
    indicators: IndicatorData[];
    asOfLabel: string;
    asOfDate: Date | null;
}> {
    const indicators: IndicatorData[] = [];
    let newest: Date | null = null;

    // Also try TOTAL_DEBT metadata for stock if DEBT_STOCK_TOTAL missing
    const totalDebtFallback = await findLatestDebtHeadline('TOTAL_DEBT', ['Bank of Ghana']);

    for (const entry of INDICATOR_CATALOG) {
        let rows = await latestForEntry(entry);

        if (!rows.length && entry.indicator === 'DEBT_STOCK_TOTAL' && totalDebtFallback) {
            rows = [totalDebtFallback];
        }

        // Fill external/domestic from TOTAL_DEBT metadata when dedicated rows missing
        if (!rows.length && totalDebtFallback && (entry.indicator === 'DEBT_EXTERNAL' || entry.indicator === 'DEBT_DOMESTIC')) {
            const meta = totalDebtFallback.metadata as { external?: number; domestic?: number } | null;
            const value = entry.indicator === 'DEBT_EXTERNAL' ? meta?.external : meta?.domestic;
            if (value != null) {
                rows = [{ ...totalDebtFallback, value, indicator: entry.indicator }];
            }
        }

        if (!rows.length) continue;

        const current = rows[0];
        const previous = rows[1];
        if (!newest || current.date > newest) newest = current.date;

        const numericDelta = previous
            ? (entry.format === 'ghs_billions' || entry.format === 'usd_billions'
                ? ((current.value - previous.value) / Math.max(previous.value, 1)) * 100
                : current.value - previous.value)
            : null;

        const { trend, trendValue } = trendFromDelta(numericDelta, entry.category);

        const displayTrendValue =
            previous && (entry.format === 'ghs_billions' || entry.format === 'usd_billions')
                ? `${trend === 'up' ? '+' : trend === 'down' ? '' : ''}${(((current.value - previous.value) / Math.max(previous.value, 1)) * 100).toFixed(1)}%`
                : previous && (entry.format === 'percent' || entry.format === 'percent_band')
                    ? `${current.value - previous.value >= 0 ? '+' : ''}${(current.value - previous.value).toFixed(2)}pts`
                    : trendValue;

        const { sourceLabel, asOfLabel: cardAsOf } = formatIndicatorProvenance(current);

        indicators.push({
            id: entry.id,
            category: entry.category,
            title: entry.title,
            value: formatValue(current.value, entry.format),
            trend: previous ? trend : 'stable',
            trendValue: previous ? displayTrendValue : 'Latest',
            analysis: entry.analysisFallback
                || `Official figure from ${sourceLabel} (${cardAsOf}).`,
            source: sourceLabel,
            asOf: cardAsOf,
            tag: entry.tag,
        });
    }

    const asOfLabel = newest
        ? `Sync through ${newest.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · reference period on each card`
        : 'Awaiting indicator data';

    return { indicators, asOfLabel, asOfDate: newest };
}
