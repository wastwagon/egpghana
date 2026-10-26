import type { EconomicData } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/** National debt headline figures (MoF Mid-Year / quarterly bulletins). */
export const MOF_DEBT_SOURCES = ['Ministry of Finance', 'MOF'] as const;

const DEBT_HEADLINE_INDICATORS = new Set([
    'DEBT_STOCK_TOTAL',
    'DEBT_EXTERNAL',
    'DEBT_DOMESTIC',
    'TOTAL_DEBT',
]);

function isMidYearAuthority(metadata: unknown): boolean {
    const m = metadata as Record<string, unknown> | null;
    return m?.authoritative === 'mid_year_budget' || m?.provider === 'mof_midyear';
}

function isBogSefdRow(metadata: unknown): boolean {
    const m = metadata as Record<string, unknown> | null;
    return m?.provider === 'bog_sefd';
}

function isMofSource(source: string): boolean {
    return (MOF_DEBT_SOURCES as readonly string[]).includes(source);
}

async function pickDebtHeadlineFromRows(rows: EconomicData[]): Promise<EconomicData | null> {
    const midYear = rows.find((r) => isMidYearAuthority(r.metadata));
    if (midYear) return midYear;

    const mofClean = rows.find((r) => isMofSource(r.source) && !isBogSefdRow(r.metadata));
    if (mofClean) return mofClean;

    const bogClean = rows.find((r) => r.source === 'Bank of Ghana' && !isBogSefdRow(r.metadata));
    if (bogClean) return bogClean;

    const mofAny = rows.find((r) => isMofSource(r.source));
    if (mofAny) return mofAny;

    return rows[0] ?? null;
}

/**
 * Latest row for dashboard debt headlines: MoF / Mid-Year authority before BoG SEFD snapshots.
 */
export async function findLatestDebtHeadline(
    indicator: string,
    fallbackSources: string[] = ['Bank of Ghana'],
): Promise<EconomicData | null> {
    const rows = await prisma.economicData.findMany({
        where: { indicator },
        orderBy: { date: 'desc' },
        take: 24,
    });

    if (rows.length) {
        const picked = await pickDebtHeadlineFromRows(rows);
        if (picked) return picked;
    }

    for (const source of fallbackSources) {
        const row = await prisma.economicData.findFirst({
            where: { indicator, source },
            orderBy: { date: 'desc' },
        });
        if (row) return row;
    }

    return null;
}

export async function findPreviousForRow(row: EconomicData): Promise<EconomicData | null> {
    return prisma.economicData.findFirst({
        where: {
            indicator: row.indicator,
            source: row.source,
            date: { lt: row.date },
        },
        orderBy: { date: 'desc' },
    });
}

export function isDebtHeadlineIndicator(indicator: string): boolean {
    return DEBT_HEADLINE_INDICATORS.has(indicator);
}

export function isMidYearDebtRow(row: EconomicData): boolean {
    if (isMidYearAuthority(row.metadata)) return true;
    const m = row.metadata as Record<string, unknown> | null;
    const note = m?.note;
    if (typeof note === 'string' && /mid-year/i.test(note)) return true;
    if (!DEBT_HEADLINE_INDICATORS.has(row.indicator)) return false;
    if (isBogSefdRow(row.metadata)) return false;
    const d = row.date;
    return d.getUTCMonth() === 5 && d.getUTCDate() === 30;
}

/** User-facing source + reference period for indicator cards. */
export function formatIndicatorProvenance(row: EconomicData): { sourceLabel: string; asOfLabel: string } {
    const m = row.metadata as Record<string, unknown> | null;
    const period = typeof m?.period === 'string' ? m.period : null;

    let sourceLabel = row.source;
    let cpiReference: string | null = null;
    if (isMidYearDebtRow(row)) {
        sourceLabel = 'Ministry of Finance';
    } else if (row.indicator === 'INFLATION_RATE' && row.source === 'Bank of Ghana') {
        sourceLabel = 'Ghana Statistical Service (via BoG)';
    } else if (row.indicator === 'INFLATION_RATE' && row.source === 'Ghana Statistical Service') {
        sourceLabel = 'Ghana Statistical Service';
        if (typeof m?.cpiReference === 'string') cpiReference = m.cpiReference;
    }

    let asOfLabel: string;
    const quarterRef = typeof m?.quarterReference === 'string' ? m.quarterReference : null;

    if (cpiReference) {
        asOfLabel = cpiReference;
    } else if (quarterRef && row.indicator === 'GDP_GROWTH') {
        asOfLabel = quarterRef;
    } else if (period) {
        asOfLabel = period.replace(/^H1-/i, 'H1 ');
    } else if (isMidYearDebtRow(row)) {
        asOfLabel = `End-June ${row.date.getUTCFullYear()}`;
    } else if (
        row.indicator === 'INFLATION_RATE'
        || row.indicator === 'GDP_NOMINAL_USD'
        || row.indicator === 'PER_CAPITA_INCOME_USD'
    ) {
        asOfLabel = row.date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    } else {
        asOfLabel = row.date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    return { sourceLabel, asOfLabel };
}
