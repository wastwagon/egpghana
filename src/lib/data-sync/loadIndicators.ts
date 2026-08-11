import { prisma } from '@/lib/prisma';
import type { IndicatorData } from '@/components/dashboards/IndicatorCard';
import { INDICATOR_CATALOG, type CatalogEntry } from './catalog';

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

async function latestForEntry(entry: CatalogEntry) {
    const sources = entry.sourcePriority?.length
        ? entry.sourcePriority
        : [entry.source];

    for (const source of sources) {
        const rows = await prisma.economicData.findMany({
            where: { indicator: entry.indicator, source },
            orderBy: { date: 'desc' },
            take: 2,
        });
        if (rows.length) return rows;
    }

    // Fallback: any source for this indicator
    return prisma.economicData.findMany({
        where: { indicator: entry.indicator },
        orderBy: { date: 'desc' },
        take: 2,
    });
}

export async function loadIndicatorGridData(): Promise<{
    indicators: IndicatorData[];
    asOfLabel: string;
    asOfDate: Date | null;
}> {
    const indicators: IndicatorData[] = [];
    let newest: Date | null = null;

    // Also try TOTAL_DEBT metadata for stock if DEBT_STOCK_TOTAL missing
    const totalDebtFallback = await prisma.economicData.findFirst({
        where: { indicator: 'TOTAL_DEBT', source: 'Bank of Ghana' },
        orderBy: { date: 'desc' },
    });

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

        indicators.push({
            id: entry.id,
            category: entry.category,
            title: entry.title,
            value: formatValue(current.value, entry.format),
            trend: previous ? trend : 'stable',
            trendValue: previous ? displayTrendValue : 'Latest',
            analysis: entry.analysisFallback
                || `Latest official figure from ${current.source}${current.date ? ` (${current.date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })})` : ''}.`,
            source: current.source,
            tag: entry.tag,
        });
    }

    const asOfLabel = newest
        ? `Updated ${newest.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
        : 'Awaiting indicator data';

    return { indicators, asOfLabel, asOfDate: newest };
}
