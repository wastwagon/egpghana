import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🏗️ Starting master restoration script...');

    // 1. Clear everything one last time
    console.log('🗑️ Clearing ALL economic data...');
    await prisma.economicData.deleteMany({});

    // 2. Run economic seed (GDP, Inf, Ex, Forex, Policy)
    // I'll manually seed the latest values to be 100% sure
    console.log('💹 Seeding core indicators...');
    const now = new Date('2026-02-13');

    const indicators = [
        { indicator: 'GDP_GROWTH', value: 5.5, unit: '%' },
        { indicator: 'INFLATION_RATE', value: 3.8, unit: '%' },
        { indicator: 'EXCHANGE_RATE_USD', value: 10.99, unit: 'GHS per USD' },
        { indicator: 'FOREX_RESERVES', value: 13.8, unit: 'Billion USD' },
        { indicator: 'POLICY_RATE', value: 15.5, unit: '%' },
        { indicator: 'TOTAL_DEBT', value: 674100000000, unit: 'GHS', metadata: { domestic: 360400000000, external: 313700000000 } },
        { indicator: 'DEBT_TO_GDP_RATIO', value: 42.2, unit: '%' },
        { indicator: 'DEBT_SERVICE_TO_REVENUE', value: 25.1, unit: '%' }
    ];

    for (const ind of indicators) {
        await prisma.economicData.create({
            data: {
                ...ind,
                date: now,
                source: 'Bank of Ghana / GSS',
                metadata: ind.metadata || {}
            }
        });
        console.log(`✅ Seeded ${ind.indicator}`);
    }

    // 3. Seed IMF Disbursements
    console.log('🏦 Seeding IMF disbursements...');
    const imfDisbursements = [
        { amount: 600000000 },
        { amount: 250000000 },
        { amount: 250000000 },
        { amount: 250000000 },
        { amount: 250000000 },
        { amount: 200000000 }
    ];

    for (let i = 0; i < imfDisbursements.length; i++) {
        await prisma.economicData.create({
            data: {
                indicator: 'IMF_DISBURSEMENT',
                value: imfDisbursements[i].amount,
                date: new Date(2023 + Math.floor(i / 4), (i % 4) * 3 + 3, 1),
                source: 'IMF',
                unit: 'SDR'
            }
        });
    }
    console.log('✅ IMF data seeded');

    console.log('🎉 Master restoration complete!');
    await prisma.$disconnect();
}

main();
