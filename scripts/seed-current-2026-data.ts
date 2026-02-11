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

        // Total Debt - November 2025 (most recent) - Update existing record
        await prisma.economicData.updateMany({
            where: {
                indicator: 'TOTAL_DEBT',
                date: new Date('2025-11-01'),
            },
            data: {
                value: 644600000000, // GH₵ 644.6B
                metadata: {
                    currency: 'GHS',
                    domestic: 314400000000, // GH₵ 314.4B
                    external: 330200000000, // GH₵ 330.2B
                    domestic_share: 48.8,
                    external_share: 51.2,
                    externalUSD: 29300000000, // US$29.3B
                    note: 'Significant reduction from GH₵726.7B in Dec 2024',
                },
            },
        });

        // Debt to GDP Ratio - Update existing 2025 Q4 record
        await prisma.economicData.updateMany({
            where: {
                indicator: 'DEBT_TO_GDP_RATIO',
                date: {
                    gte: new Date('2025-10-01'),
                    lte: new Date('2025-12-31'),
                },
            },
            data: {
                value: 45.5,
                metadata: {
                    note: 'Down from 61.8% in December 2024',
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

        console.log('✅ Current economic data seeded successfully!');
        console.log('   - GDP Growth: 5.9% (2026 projection)');
        console.log('   - Inflation: 3.8% (Jan 2026)');
        console.log('   - Exchange Rate: GHS 10.99 per USD (Feb 2026)');
        console.log('   - Total Debt: GH₵ 644.6B (Nov 2025)');
        console.log('   - Debt to GDP: 45.5% (Nov 2025)');
        console.log('   - Forex Reserves: $13.8B (Dec 2025)');
        console.log('   - Debt Service: 48.0% (2025)');
        console.log('   - Trade Balance: $1.5B surplus (Jan 2026 est.)');
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
