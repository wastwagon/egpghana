/**
 * Sync IMF dashboard data — verified against IMF press releases & mission statements (May–Jul 2026).
 * Run: npx tsx scripts/update-imf-sixth-review.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMF_SIXTH_SLA =
    'https://www.imf.org/en/news/articles/2026/05/15/pr26152-ghana-imf-staff-completes-2026-aiv-consult-reaches-sla-6th-rev-ecf-arr-36mo-pci-request';
const IMF_FIFTH_REVIEW =
    'https://www.imf.org/en/news/articles/2025/12/17/pr-25429-ghana-imf-completes-the-fifth-review-under-the-ecf-arrangement';

/** Official disbursement schedule (IMF press releases). */
const DISBURSEMENTS = [
    { date: '2023-05-17', amount: 600, sdr: 451.4, status: 'Completed', quarter: 'May 2023', type: 'Program Approval' },
    { date: '2024-01-19', amount: 600, sdr: 451.4, status: 'Completed', quarter: 'Jan 2024', type: '1st Review' },
    { date: '2024-06-28', amount: 360, sdr: 269.1, status: 'Completed', quarter: 'Jun 2024', type: '2nd Review' },
    { date: '2024-12-02', amount: 360, sdr: 269.1, status: 'Completed', quarter: 'Dec 2024', type: '3rd Review' },
    { date: '2025-07-07', amount: 367, sdr: 267.5, status: 'Completed', quarter: 'Jul 2025', type: '4th Review' },
    { date: '2025-12-17', amount: 385, sdr: 267.5, status: 'Completed', quarter: 'Dec 2025', type: '5th Review' },
    {
        date: '2026-07-27',
        amount: 318,
        sdr: 266.0,
        status: 'Pending',
        quarter: 'Jul 2026',
        type: '6th Review (Final)',
        note: 'US$318m (est.) upon Executive Board approval — Mission Chief Ruben Atoyan, May 2026. Brings total disbursements to ~US$3.2bn.',
    },
];

const MILESTONES = [
    { date: '2023-05-17', title: 'IMF Board Approval', description: 'Executive Board approves US$3 billion, 36-month ECF arrangement (extended to 39 months). Initial disbursement SDR 451.4 million (~US$600 million).', status: 'completed', type: 'approval' },
    { date: '2024-01-19', title: '1st Review Completion', description: 'Board completes first review; disbursement SDR 451.4 million (~US$600 million). Cumulative disbursements ~US$1.2 billion.', status: 'completed', type: 'review' },
    { date: '2024-06-28', title: '2nd Review Completion', description: 'Board completes second review; disbursement SDR 269.1 million (~US$360 million). Cumulative disbursements ~US$1.6 billion.', status: 'completed', type: 'review' },
    { date: '2024-12-02', title: '3rd Review Completion', description: 'Board completes third review; disbursement SDR 269.1 million (~US$360 million). Cumulative disbursements ~US$1.9 billion.', status: 'completed', type: 'review' },
    { date: '2025-07-07', title: '4th Review Completion', description: 'Board completes fourth review; disbursement SDR 267.5 million (~US$367 million). Cumulative disbursements ~US$2.3 billion.', status: 'completed', type: 'review' },
    { date: '2025-12-17', title: '5th Review Completion', description: 'Board completes fifth review of 39-month ECF; disbursement SDR 267.5 million (~US$385 million). Cumulative disbursements ~US$2.8 billion.', status: 'completed', type: 'review' },
    { date: '2026-05-15', title: '6th Review — Staff-Level Agreement', description: 'IMF staff completed 2026 Article IV consultation and reached SLA on sixth and final ECF review and 36-month non-financing PCI (mission 29 Apr – 15 May 2026, led by Dr Ruben Atoyan). ECF not yet formally concluded.', status: 'completed', type: 'review' },
    { date: '2026-07-27', title: '6th Review — Executive Board', description: 'Expected IMF Executive Board decision on final ECF review, ~US$318 million disbursement, and 36-month PCI request (per Mission Chief, May 2026).', status: 'pending', type: 'review' },
    { date: '2026-05-17', title: 'ECF Arrangement (Scheduled End)', description: 'Original 36-month ECF timeline ends. Formal program conclusion pending Executive Board approval of the sixth review; transition to PCI under discussion.', status: 'pending', type: 'end' },
];

async function syncDisbursements() {
    for (const item of DISBURSEMENTS) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'IMF_DISBURSEMENT',
                    date: new Date(item.date),
                    source: 'IMF',
                },
            },
            update: {
                value: item.amount,
                unit: 'Million USD',
                metadata: {
                    sdr: item.sdr,
                    status: item.status,
                    quarter: item.quarter,
                    type: item.type,
                    note: item.note,
                },
            },
            create: {
                indicator: 'IMF_DISBURSEMENT',
                value: item.amount,
                date: new Date(item.date),
                source: 'IMF',
                unit: 'Million USD',
                metadata: {
                    sdr: item.sdr,
                    status: item.status,
                    quarter: item.quarter,
                    type: item.type,
                    note: item.note,
                },
            },
        });
    }

    // Remove superseded placeholder dates
    for (const staleDate of ['2026-06-15', '2026-05-15', '2025-12-15']) {
        await prisma.economicData.deleteMany({
            where: {
                indicator: 'IMF_DISBURSEMENT',
                date: new Date(staleDate),
                source: 'IMF',
            },
        });
    }
}

async function syncMilestones() {
    for (const m of MILESTONES) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'IMF_MILESTONE',
                    date: new Date(m.date),
                    source: 'IMF',
                },
            },
            update: {
                value: 0,
                unit: 'Event',
                metadata: m,
            },
            create: {
                indicator: 'IMF_MILESTONE',
                value: 0,
                date: new Date(m.date),
                source: 'IMF',
                unit: 'Event',
                metadata: m,
            },
        });
    }

    for (const staleDate of ['2026-04-15', '2026-06-30']) {
        await prisma.economicData.deleteMany({
            where: {
                indicator: 'IMF_MILESTONE',
                date: new Date(staleDate),
                source: 'IMF',
            },
        });
    }
}

async function updateConditionalities() {
    const updates: Record<string, { verificationNote: string; sourceLink?: string; sourceTitle?: string }> = {
        'IMF-cond-18': {
            verificationNote:
                '6th review SLA reached May 2026: quantitative targets mostly met in 2025; primary surplus overperformed. Structural reforms implemented with delays. Pending Executive Board approval (expected 27 Jul 2026).',
            sourceLink: IMF_SIXTH_SLA,
            sourceTitle: 'IMF Press Release No. 26/152',
        },
        'IMF-cond-3': {
            verificationNote:
                'Bilateral debt relief agreements with about half of official creditors under G20 Common Framework (May 2026). Domestic T-bond issuance resumed. Remaining official and commercial creditor agreements in progress.',
            sourceLink: IMF_SIXTH_SLA,
            sourceTitle: 'IMF Press Release No. 26/152',
        },
    };

    for (const [source, patch] of Object.entries(updates)) {
        const row = await prisma.economicData.findFirst({
            where: { indicator: 'IMF_CONDITIONALITY', source },
        });
        if (!row) continue;
        const meta = (row.metadata as Record<string, unknown>) || {};
        await prisma.economicData.update({
            where: { id: row.id },
            data: { metadata: { ...meta, ...patch } },
        });
    }
}

async function main() {
    console.log('Syncing verified IMF disbursements, milestones, and conditionalities...');
    await syncDisbursements();
    await syncMilestones();
    await updateConditionalities();
    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
