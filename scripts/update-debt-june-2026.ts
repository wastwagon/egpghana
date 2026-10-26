/**
 * Sync end-June 2026 debt pack from MoF Mid-Year Fiscal Policy Review.
 * Run: npx tsx scripts/update-debt-june-2026.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SNAPSHOT = '2026-06-30';

const DEBT_PACK = {
    total: 719_500_000_000,
    external: 328_400_000_000,
    domestic: 391_100_000_000,
    externalShare: 45.6,
    domesticShare: 54.4,
    debtToGdp: 45.0,
    domesticToGdp: 24.5,
    externalToGdp: 20.5,
    interestPayment: 25_400_000_000,
    interestToExpenditure: 9.45,
    debtPerCapita: 22_477,
    debtServiceToRevenue: 25.1,
    perCapitaIncomeUsd: 2_235,
    gdpNominalUsd: 111_960_000_000,
    inflation: 5.3,
    policyRate: 14,
    treasuryBill91d: 5.73,
    gdpNominalGhs: 1_599_000_000_000,
} as const;

const INDICATORS = [
    { indicator: 'DEBT_STOCK_TOTAL', value: DEBT_PACK.total, unit: 'GHS', source: 'Bank of Ghana' },
    { indicator: 'DEBT_EXTERNAL', value: DEBT_PACK.external, unit: 'GHS', source: 'Bank of Ghana' },
    { indicator: 'DEBT_DOMESTIC', value: DEBT_PACK.domestic, unit: 'GHS', source: 'Bank of Ghana' },
    { indicator: 'DEBT_EXTERNAL_SHARE', value: DEBT_PACK.externalShare, unit: '%', source: 'MOF' },
    { indicator: 'DEBT_DOMESTIC_SHARE', value: DEBT_PACK.domesticShare, unit: '%', source: 'MOF' },
    { indicator: 'DEBT_TO_GDP_RATIO', value: DEBT_PACK.debtToGdp, unit: '%', source: 'MOF' },
    { indicator: 'DEBT_DOMESTIC_TO_GDP', value: DEBT_PACK.domesticToGdp, unit: '%', source: 'MOF' },
    { indicator: 'DEBT_EXTERNAL_TO_GDP', value: DEBT_PACK.externalToGdp, unit: '%', source: 'MOF' },
    { indicator: 'DEBT_INTEREST_PAYMENT_REVISED', value: DEBT_PACK.interestPayment, unit: 'GHS', source: 'MOF' },
    { indicator: 'DEBT_INTEREST_TO_EXPENDITURE', value: DEBT_PACK.interestToExpenditure, unit: '%', source: 'Bank of Ghana' },
    { indicator: 'DEBT_PER_CAPITA', value: DEBT_PACK.debtPerCapita, unit: 'GHS', source: 'World Bank' },
    { indicator: 'DEBT_SERVICE_TO_REVENUE', value: DEBT_PACK.debtServiceToRevenue, unit: '%', source: 'MOF' },
    { indicator: 'PER_CAPITA_INCOME_USD', value: DEBT_PACK.perCapitaIncomeUsd, unit: 'USD', source: 'World Bank' },
    { indicator: 'GDP_NOMINAL_USD', value: DEBT_PACK.gdpNominalUsd, unit: 'USD', source: 'World Bank' },
    { indicator: 'INFLATION_RATE', value: DEBT_PACK.inflation, unit: '%', source: 'Bank of Ghana' },
    { indicator: 'INFLATION_TARGET_MID', value: 8, unit: '%', source: 'Bank of Ghana', metadata: { band: '+/- 2%' } },
    { indicator: 'POLICY_RATE', value: DEBT_PACK.policyRate, unit: '%', source: 'Bank of Ghana' },
    { indicator: 'TREASURY_BILL_91D', value: DEBT_PACK.treasuryBill91d, unit: '%', source: 'Bank of Ghana' },
    { indicator: 'GDP_NOMINAL_GHS', value: DEBT_PACK.gdpNominalGhs, unit: 'GHS', source: 'Bank of Ghana' },
] as const;

async function syncTotalDebt() {
    await prisma.economicData.upsert({
        where: {
            indicator_date_source: {
                indicator: 'TOTAL_DEBT',
                date: new Date(SNAPSHOT),
                source: 'Bank of Ghana',
            },
        },
        update: {
            value: DEBT_PACK.total,
            unit: 'GHS',
            metadata: {
                currency: 'GHS',
                domestic: DEBT_PACK.domestic,
                external: DEBT_PACK.external,
                domestic_share: DEBT_PACK.domesticShare,
                external_share: DEBT_PACK.externalShare,
                note: 'Debt data update as at June 2026',
            },
        },
        create: {
            indicator: 'TOTAL_DEBT',
            value: DEBT_PACK.total,
            date: new Date(SNAPSHOT),
            source: 'Bank of Ghana',
            unit: 'GHS',
            metadata: {
                currency: 'GHS',
                domestic: DEBT_PACK.domestic,
                external: DEBT_PACK.external,
                domestic_share: DEBT_PACK.domesticShare,
                external_share: DEBT_PACK.externalShare,
                note: 'Debt data update as at June 2026',
            },
        },
    });

    await prisma.economicData.upsert({
        where: {
            indicator_date_source: {
                indicator: 'TOTAL_DEBT',
                date: new Date(SNAPSHOT),
                source: 'Ministry of Finance',
            },
        },
        update: {
            value: DEBT_PACK.total,
            unit: 'GHS',
            metadata: { domestic: DEBT_PACK.domestic, external: DEBT_PACK.external },
        },
        create: {
            indicator: 'TOTAL_DEBT',
            value: DEBT_PACK.total,
            date: new Date(SNAPSHOT),
            source: 'Ministry of Finance',
            unit: 'GHS',
            metadata: { domestic: DEBT_PACK.domestic, external: DEBT_PACK.external },
        },
    });
}

async function syncIndicators() {
    for (const item of INDICATORS) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: item.indicator,
                    date: new Date(SNAPSHOT),
                    source: item.source,
                },
            },
            update: {
                value: item.value,
                unit: item.unit,
                metadata: {
                    ...('metadata' in item ? item.metadata : {}),
                    reportDate: '2026-06',
                },
            },
            create: {
                indicator: item.indicator,
                value: item.value,
                date: new Date(SNAPSHOT),
                source: item.source,
                unit: item.unit,
                metadata: {
                    ...('metadata' in item ? item.metadata : {}),
                    reportDate: '2026-06',
                },
            },
        });
    }
}

async function main() {
    console.log('Syncing June 2026 debt data pack...');
    await syncTotalDebt();
    await syncIndicators();
    console.log('Done. Total debt: GH₵ 719.5B | Debt/GDP: 45.0% (Mid-Year)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
