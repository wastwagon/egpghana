import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { findLatestDebtHeadline } from '@/lib/economic-authority';
import type { FetchedObservation, SyncRunSummary } from './types';

const EPS = 1e-6;

function asJson(value: Record<string, unknown> | undefined): Prisma.InputJsonValue | undefined {
    if (!value) return undefined;
    return value as Prisma.InputJsonValue;
}

function nearlyEqual(a: number, b: number) {
    return Math.abs(a - b) < EPS;
}

export async function getLatestValue(indicator: string, source: string) {
    return prisma.economicData.findFirst({
        where: { indicator, source },
        orderBy: { date: 'desc' },
    });
}

export async function upsertEconomicObservation(obs: FetchedObservation) {
    const date = new Date(obs.asOfDate);
    date.setUTCHours(0, 0, 0, 0);

    return prisma.economicData.upsert({
        where: {
            indicator_date_source: {
                indicator: obs.indicator,
                date,
                source: obs.source,
            },
        },
        update: {
            value: obs.value,
            unit: obs.unit,
            metadata: asJson({
                ...(obs.metadata || {}),
                sourceUrl: obs.sourceUrl,
                note: obs.note,
                syncedAt: new Date().toISOString(),
            }),
        },
        create: {
            indicator: obs.indicator,
            value: obs.value,
            date,
            source: obs.source,
            unit: obs.unit,
            metadata: asJson({
                ...(obs.metadata || {}),
                sourceUrl: obs.sourceUrl,
                note: obs.note,
                syncedAt: new Date().toISOString(),
            }),
        },
    });
}

async function createOrRefreshProposal(obs: FetchedObservation, currentValue: number | null, sourceKey: string) {
    const pending = await prisma.dataSyncProposal.findFirst({
        where: {
            indicator: obs.indicator,
            source: obs.source,
            status: 'pending',
        },
        orderBy: { createdAt: 'desc' },
    });

    if (pending) {
        return prisma.dataSyncProposal.update({
            where: { id: pending.id },
            data: {
                proposedValue: obs.value,
                currentValue: currentValue ?? undefined,
                asOfDate: obs.asOfDate,
                sourceUrl: obs.sourceUrl,
                note: obs.note,
                sourceKey,
                metadata: asJson(obs.metadata),
            },
        });
    }

    return prisma.dataSyncProposal.create({
        data: {
            indicator: obs.indicator,
            source: obs.source,
            sourceKey,
            currentValue: currentValue ?? undefined,
            proposedValue: obs.value,
            unit: obs.unit,
            asOfDate: obs.asOfDate,
            sourceUrl: obs.sourceUrl,
            note: obs.note,
            status: 'pending',
            autoApplied: false,
            metadata: asJson(obs.metadata),
        },
    });
}

export async function processObservations(
    sourceKey: string,
    observations: FetchedObservation[],
    summary: SyncRunSummary
) {
    for (const obs of observations) {
        summary.checked += 1;
        const latest = await getLatestValue(obs.indicator, obs.source);
        const current = latest?.value ?? null;

        if (current != null && nearlyEqual(current, obs.value)) {
            // Same value — still refresh date/metadata if newer as-of
            if (latest && obs.asOfDate > latest.date) {
                await upsertEconomicObservation(obs);
                summary.applied += 1;
            } else {
                summary.unchanged += 1;
            }
            continue;
        }

        // Never let an older bulletin overwrite a newer observation (e.g. MoF Q4-2025 vs BoG May-2026)
        if (latest && obs.asOfDate < latest.date) {
            summary.unchanged += 1;
            continue;
        }

        if (obs.mode === 'auto') {
            await upsertEconomicObservation(obs);
            await prisma.dataSyncProposal.create({
                data: {
                    indicator: obs.indicator,
                    source: obs.source,
                    sourceKey,
                    currentValue: current ?? undefined,
                    proposedValue: obs.value,
                    unit: obs.unit,
                    asOfDate: obs.asOfDate,
                    sourceUrl: obs.sourceUrl,
                    note: obs.note || 'Auto-applied from external source',
                    status: 'approved',
                    autoApplied: true,
                    metadata: asJson(obs.metadata),
                    reviewedAt: new Date(),
                    reviewedBy: 'system',
                },
            });
            summary.applied += 1;
        } else if (obs.mode === 'propose') {
            await createOrRefreshProposal(obs, current, sourceKey);
            summary.proposed += 1;
        }
    }
}

export async function approveProposal(id: string, reviewer: string) {
    const proposal = await prisma.dataSyncProposal.findUnique({ where: { id } });
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.status !== 'pending') throw new Error('Proposal is not pending');

    await upsertEconomicObservation({
        indicator: proposal.indicator,
        value: proposal.proposedValue,
        unit: proposal.unit || undefined,
        source: proposal.source,
        asOfDate: proposal.asOfDate,
        sourceUrl: proposal.sourceUrl || undefined,
        note: proposal.note || undefined,
        metadata: (proposal.metadata as Record<string, unknown> | null) || undefined,
        mode: 'propose',
    });

    return prisma.dataSyncProposal.update({
        where: { id },
        data: {
            status: 'approved',
            reviewedAt: new Date(),
            reviewedBy: reviewer,
        },
    });
}

export async function rejectProposal(id: string, reviewer: string) {
    const proposal = await prisma.dataSyncProposal.findUnique({ where: { id } });
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.status !== 'pending') throw new Error('Proposal is not pending');

    return prisma.dataSyncProposal.update({
        where: { id },
        data: {
            status: 'rejected',
            reviewedAt: new Date(),
            reviewedBy: reviewer,
        },
    });
}

/** When debt stock + population both exist, refresh debt per capita. */
export async function maybeDeriveDebtPerCapita(summary: SyncRunSummary) {
    const debt =
        (await findLatestDebtHeadline('DEBT_STOCK_TOTAL', ['Bank of Ghana']))
        ?? (await findLatestDebtHeadline('TOTAL_DEBT', ['Bank of Ghana']));
    const population = await prisma.economicData.findFirst({
        where: { indicator: 'POPULATION_TOTAL', source: 'World Bank' },
        orderBy: { date: 'desc' },
    });

    if (!debt || !population || !population.value) return;

    const perCapita = debt.value / population.value;
    const asOfDate = debt.date > population.date ? debt.date : population.date;

    await processObservations(
        'derived',
        [{
            indicator: 'DEBT_PER_CAPITA',
            value: Math.round(perCapita * 100) / 100,
            unit: 'GHS',
            source: 'World Bank',
            asOfDate,
            note: 'Derived: debt stock ÷ World Bank population',
            mode: 'auto',
            metadata: { derivedFrom: ['DEBT_STOCK_TOTAL|TOTAL_DEBT', 'POPULATION_TOTAL'] },
        }],
        summary
    );
}
