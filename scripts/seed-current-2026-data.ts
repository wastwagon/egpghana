import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCurrentData() {
    console.log('🌱 Seeding current economic data (February 2026)...');

    try {
        // GDP Growth - Latest projection for 2026
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'GDP_GROWTH',
                    date: new Date('2026-01-31'),
                    source: 'Fitch Solutions / IMF',
                },
            },
            update: {
                value: 5.9,
                unit: '%',
                metadata: {
                    quarter: '2026 Q1 Projection',
                    note: 'Projected growth driven by strong domestic demand, improved exports',
                },
            },
            create: {
                indicator: 'GDP_GROWTH',
                value: 5.9,
                date: new Date('2026-01-31'),
                source: 'Fitch Solutions / IMF',
                unit: '%',
                metadata: {
                    quarter: '2026 Q1 Projection',
                    note: 'Projected growth driven by strong domestic demand, improved exports',
                },
            },
        });

        // Inflation Rate - January 2026 actual data
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'INFLATION_RATE',
                    date: new Date('2026-01-31'),
                    source: 'Ghana Statistical Service',
                },
            },
            update: {
                value: 3.8,
                unit: '%',
                metadata: {
                    month: 'Jan 26',
                    policyRate: 26.0,
                    targetLow: 6,
                    targetHigh: 10,
                    note: '13th consecutive month of decline, lowest since 2021 rebasing',
                },
            },
            create: {
                indicator: 'INFLATION_RATE',
                value: 3.8,
                date: new Date('2026-01-31'),
                source: 'Ghana Statistical Service',
                unit: '%',
                metadata: {
                    month: 'Jan 26',
                    policyRate: 26.0,
                    targetLow: 6,
                    targetHigh: 10,
                    note: '13th consecutive month of decline, lowest since 2021 rebasing',
                },
            },
        });

        // Exchange Rate - February 2026
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'EXCHANGE_RATE_USD',
                    date: new Date('2026-02-06'),
                    source: 'Bank of Ghana',
                },
            },
            update: {
                value: 10.99,
                unit: 'GHS per USD',
                metadata: {
                    month: 'Feb 26',
                    interbankRate: 10.99,
                    note: 'Interbank selling rate',
                },
            },
            create: {
                indicator: 'EXCHANGE_RATE_USD',
                value: 10.99,
                date: new Date('2026-02-06'),
                source: 'Bank of Ghana',
                unit: 'GHS per USD',
                metadata: {
                    month: 'Feb 26',
                    interbankRate: 10.99,
                    note: 'Interbank selling rate',
                },
            },
        });

        // Total Debt - June 2026 (most recent)
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'TOTAL_DEBT',
                    date: new Date('2026-06-30'),
                    source: 'Bank of Ghana',
                },
            },
            update: {
                value: 719500000000,
                unit: 'GHS',
                metadata: {
                    currency: 'GHS',
                    domestic: 391100000000,
                    external: 328400000000,
                    domestic_share: 54.4,
                    external_share: 45.6,
                    note: 'MoF Mid-Year Fiscal Policy Review (end-June 2026)',
                    authoritative: 'mid_year_budget',
                },
            },
            create: {
                indicator: 'TOTAL_DEBT',
                value: 719500000000,
                date: new Date('2026-06-30'),
                source: 'Bank of Ghana',
                unit: 'GHS',
                metadata: {
                    currency: 'GHS',
                    domestic: 391100000000,
                    external: 328400000000,
                    domestic_share: 54.4,
                    external_share: 45.6,
                    note: 'MoF Mid-Year Fiscal Policy Review (end-June 2026)',
                    authoritative: 'mid_year_budget',
                },
            },
        });

        // Debt to GDP Ratio - end-June 2026 (Mid-Year)
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'DEBT_TO_GDP_RATIO',
                    date: new Date('2026-06-30'),
                    source: 'MOF',
                },
            },
            update: {
                value: 45.0,
                unit: '%',
                metadata: { note: 'MoF Mid-Year Fiscal Policy Review' },
            },
            create: {
                indicator: 'DEBT_TO_GDP_RATIO',
                value: 45.0,
                date: new Date('2026-06-30'),
                source: 'MOF',
                unit: '%',
                metadata: { note: 'MoF Mid-Year Fiscal Policy Review' },
            },
        });

        // Debt service to revenue - June 2026
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'DEBT_SERVICE_TO_REVENUE',
                    date: new Date('2026-06-30'),
                    source: 'KPMG',
                },
            },
            update: {
                value: 25.1,
                unit: '%',
            },
            create: {
                indicator: 'DEBT_SERVICE_TO_REVENUE',
                value: 25.1,
                date: new Date('2026-06-30'),
                source: 'KPMG',
                unit: '%',
            },
        });

        // Legacy Nov 2025 debt record (retained)
        await prisma.economicData.updateMany({
            where: {
                indicator: 'TOTAL_DEBT',
                date: new Date('2025-11-01'),
            },
            data: {
                value: 641000000000,
                metadata: {
                    currency: 'GHS',
                    domestic: 333800000000,
                    external: 307200000000,
                    domestic_share: 52.08,
                    external_share: 47.92,
                    note: 'Debt data update as at Nov 2025',
                },
            },
        });

        // Legacy debt-to-GDP Q4 2025
        await prisma.economicData.updateMany({
            where: {
                indicator: 'DEBT_TO_GDP_RATIO',
                date: {
                    gte: new Date('2025-10-01'),
                    lte: new Date('2025-12-31'),
                },
                source: 'MOF',
            },
            data: {
                value: 45.3,
                metadata: {
                    note: 'Nov 2025 official update',
                },
            },
        });

        // Forex Reserves - Update latest record
        await prisma.economicData.updateMany({
            where: {
                indicator: 'FOREX_RESERVES',
                date: {
                    gte: new Date('2025-01-01'),
                },
            },
            data: {
                value: 13.8,
                metadata: {
                    importCover: 5.7,
                    note: 'Up from $9.1B in Dec 2024, target to reach $20B in 3 years',
                },
            },
        });

        // Debt Service to Revenue - Update latest record
        await prisma.economicData.updateMany({
            where: {
                indicator: 'DEBT_SERVICE_TO_REVENUE',
                date: {
                    gte: new Date('2025-01-01'),
                },
            },
            data: {
                value: 48.0,
                metadata: {
                    note: 'Post-debt restructuring relief',
                },
            },
        });

        // Trade Balance - Update latest record
        await prisma.economicData.updateMany({
            where: {
                indicator: 'TRADE_BALANCE',
                date: {
                    gte: new Date('2024-12-01'),
                },
            },
            data: {
                value: 1500000000, // $1.5B surplus
                metadata: {
                    month: 'Jan 26 Estimate',
                    note: 'Strong gold and oil exports, offset by rising import demand',
                },
            },
        });

        // Policy Rate - February 2026
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'POLICY_RATE',
                    date: new Date('2026-02-13'),
                    source: 'Bank of Ghana',
                },
            },
            update: {
                value: 15.5,
                unit: '%',
                metadata: {
                    month: 'Feb 26',
                    note: 'Monetary Policy Rate reaching historic low to support private sector borrowing',
                },
            },
            create: {
                indicator: 'POLICY_RATE',
                value: 15.5,
                date: new Date('2026-02-13'),
                source: 'Bank of Ghana',
                unit: '%',
                metadata: {
                    month: 'Feb 26',
                    note: 'Monetary Policy Rate reaching historic low to support private sector borrowing',
                },
            },
        });

        console.log('✅ Current economic data seeded successfully!');
        console.log('   - GDP Growth: 5.9% (2026 projection)');
        console.log('   - Total Debt: GH₵ 719.5B (Mid-Year / end-June 2026)');
        console.log('   - Debt to GDP: 45.0% (Mid-Year)');
        console.log('   - Composition: domestic 391.1B (54.4%) / external 328.4B (45.6%)');
    } catch (error) {
        console.error('❌ Error seeding current data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedCurrentData()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
