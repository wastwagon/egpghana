import { prisma } from '@/lib/prisma';

const DEBT_HEADLINE_INDICATORS = [
    'DEBT_STOCK_TOTAL',
    'DEBT_EXTERNAL',
    'DEBT_DOMESTIC',
    'TOTAL_DEBT',
] as const;

function endOfJune(year: number): Date {
    return new Date(Date.UTC(year, 6, 0));
}

function isBogSefd(metadata: unknown): boolean {
    const m = metadata as Record<string, unknown> | null;
    return m?.provider === 'bog_sefd';
}

/** Tag end-June debt rows with Mid-Year metadata when provider was missing (legacy seeds). */
export async function backfillMidYearDebtMetadata(year: number): Promise<number> {
    const asOf = endOfJune(year);
    const dayStart = new Date(asOf);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(asOf);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const rows = await prisma.economicData.findMany({
        where: {
            indicator: { in: [...DEBT_HEADLINE_INDICATORS] },
            date: { gte: dayStart, lte: dayEnd },
        },
    });

    let updated = 0;
    for (const row of rows) {
        if (isBogSefd(row.metadata)) continue;
        const m = (row.metadata as Record<string, unknown> | null) || {};
        if (m.provider === 'mof_midyear' && m.authoritative === 'mid_year_budget') continue;

        await prisma.economicData.update({
            where: { id: row.id },
            data: {
                metadata: {
                    ...m,
                    provider: 'mof_midyear',
                    authoritative: 'mid_year_budget',
                    period: `H1-${year}`,
                    note:
                        typeof m.note === 'string'
                            ? m.note
                            : `MoF ${year} Mid-Year Fiscal Policy Review (H1 / end-June ${year})`,
                },
            },
        });
        updated += 1;
    }

    return updated;
}
