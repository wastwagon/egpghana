import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEconomicData() {
    console.log('🌱 Seeding economic data...');

    // Clear specific economic indicators
    const indicatorsToClear = [
        'GDP_GROWTH',
        'INFLATION_RATE',
        'EXCHANGE_RATE_USD',
        'UNEMPLOYMENT_RATE',
        'TRADE_BALANCE',
        'FOREX_RESERVES',
        'POLICY_RATE'
    ];
    await prisma.economicData.deleteMany({
        where: { indicator: { in: indicatorsToClear } }
    });

    // GDP Growth Data (Quarterly 2022-2025)
    const gdpData = [
        // 2022
        { quarter: '2022 Q1', date: new Date('2022-03-31'), growth: 3.2, agriculture: 4.1, industry: 2.8, services: 3.0 },
        { quarter: '2022 Q2', date: new Date('2022-06-30'), growth: 4.8, agriculture: 5.2, industry: 4.5, services: 4.7 },
        { quarter: '2022 Q3', date: new Date('2022-09-30'), growth: 6.5, agriculture: 6.8, industry: 6.2, services: 6.4 },
        { quarter: '2022 Q4', date: new Date('2022-12-31'), growth: 4.2, agriculture: 4.5, industry: 3.9, services: 4.3 },
        // 2023
        { quarter: '2023 Q1', date: new Date('2023-03-31'), growth: 2.5, agriculture: 3.2, industry: 2.1, services: 2.4 },
        { quarter: '2023 Q2', date: new Date('2023-06-30'), growth: 3.2, agriculture: 3.8, industry: 2.9, services: 3.1 },
        { quarter: '2023 Q3', date: new Date('2023-09-30'), growth: 2.8, agriculture: 3.5, industry: 2.5, services: 2.7 },
        { quarter: '2023 Q4', date: new Date('2023-12-31'), growth: 3.1, agriculture: 3.7, industry: 2.8, services: 3.0 },
        // 2024
        { quarter: '2024 Q1', date: new Date('2024-03-31'), growth: 4.7, agriculture: 5.2, industry: 4.5, services: 4.6 },
        { quarter: '2024 Q2', date: new Date('2024-06-30'), growth: 6.2, agriculture: 6.8, industry: 5.9, services: 6.1 },
        { quarter: '2024 Q3', date: new Date('2024-09-30'), growth: 6.9, agriculture: 7.5, industry: 6.5, services: 6.8 },
        { quarter: '2024 Q4', date: new Date('2024-12-31'), growth: 5.0, agriculture: 5.5, industry: 4.8, services: 4.9 },
        // 2025
        { quarter: '2025 Q1', date: new Date('2025-03-31'), growth: 4.5, agriculture: 5.0, industry: 4.2, services: 4.4 },
        { quarter: '2025 Q2', date: new Date('2025-06-30'), growth: 5.2, agriculture: 5.8, industry: 4.9, services: 5.1 },
        { quarter: '2025 Q3', date: new Date('2025-09-30'), growth: 6.1, agriculture: 6.5, industry: 5.8, services: 6.0 },
        { quarter: '2025 Q4', date: new Date('2025-12-31'), growth: 5.8, agriculture: 6.2, industry: 5.4, services: 5.6 },
        // 2026
        { quarter: '2026 Q1', date: new Date('2026-03-31'), growth: 5.5, agriculture: 5.2, industry: 5.0, services: 5.8 },
    ];

    for (const data of gdpData) {
        await prisma.economicData.create({
            data: {
                indicator: 'GDP_GROWTH',
                value: data.growth,
                date: data.date,
                source: 'Ghana Statistical Service',
                unit: '%',
                metadata: {
                    quarter: data.quarter,
                    agriculture: data.agriculture,
                    industry: data.industry,
                    services: data.services,
                },
            },
        });
    }

    // Inflation Data (Monthly 2023-2025)
    const inflationData = [
        // 2023
        { month: 'Jan 23', date: new Date('2023-01-31'), inflation: 53.6, policyRate: 29.5 },
        { month: 'Feb 23', date: new Date('2023-02-28'), inflation: 52.8, policyRate: 29.5 },
        { month: 'Mar 23', date: new Date('2023-03-31'), inflation: 52.2, policyRate: 29.5 },
        { month: 'Apr 23', date: new Date('2023-04-30'), inflation: 45.0, policyRate: 30.0 },
        { month: 'May 23', date: new Date('2023-05-31'), inflation: 42.5, policyRate: 30.0 },
        { month: 'Jun 23', date: new Date('2023-06-30'), inflation: 42.2, policyRate: 30.0 },
        { month: 'Jul 23', date: new Date('2023-07-31'), inflation: 40.1, policyRate: 30.0 },
        { month: 'Aug 23', date: new Date('2023-08-31'), inflation: 38.1, policyRate: 30.0 },
        { month: 'Sep 23', date: new Date('2023-09-30'), inflation: 38.0, policyRate: 30.0 },
        { month: 'Oct 23', date: new Date('2023-10-31'), inflation: 26.9, policyRate: 30.0 },
        { month: 'Nov 23', date: new Date('2023-11-30'), inflation: 25.8, policyRate: 30.0 },
        { month: 'Dec 23', date: new Date('2023-12-31'), inflation: 23.2, policyRate: 30.0 },
        // 2024
        { month: 'Jan 24', date: new Date('2024-01-31'), inflation: 23.5, policyRate: 29.0 },
        { month: 'Feb 24', date: new Date('2024-02-29'), inflation: 25.8, policyRate: 29.0 },
        { month: 'Mar 24', date: new Date('2024-03-31'), inflation: 25.0, policyRate: 29.0 },
        { month: 'Apr 24', date: new Date('2024-04-30'), inflation: 25.0, policyRate: 29.0 },
        { month: 'May 24', date: new Date('2024-05-31'), inflation: 23.1, policyRate: 29.0 },
        { month: 'Jun 24', date: new Date('2024-06-30'), inflation: 22.8, policyRate: 29.0 },
        { month: 'Jul 24', date: new Date('2024-07-31'), inflation: 20.9, policyRate: 29.0 },
        { month: 'Aug 24', date: new Date('2024-08-31'), inflation: 20.4, policyRate: 29.0 },
        { month: 'Sep 24', date: new Date('2024-09-30'), inflation: 22.1, policyRate: 29.0 },
        { month: 'Oct 24', date: new Date('2024-10-31'), inflation: 22.8, policyRate: 27.0 },
        { month: 'Nov 24', date: new Date('2024-11-30'), inflation: 23.8, policyRate: 27.0 },
        { month: 'Dec 24', date: new Date('2024-12-31'), inflation: 23.8, policyRate: 27.0 },
        // 2025
        { month: 'Jan 25', date: new Date('2025-01-31'), inflation: 23.5, policyRate: 26.0 },
        { month: 'Feb 25', date: new Date('2025-02-28'), inflation: 23.2, policyRate: 26.0 },
        { month: 'Mar 25', date: new Date('2025-03-31'), inflation: 25.8, policyRate: 26.0 },
        { month: 'Apr 25', date: new Date('2025-04-30'), inflation: 25.0, policyRate: 26.0 },
        { month: 'May 25', date: new Date('2025-05-31'), inflation: 23.1, policyRate: 26.0 },
        { month: 'Jun 25', date: new Date('2025-06-30'), inflation: 22.8, policyRate: 26.0 },
        { month: 'Jul 25', date: new Date('2025-07-31'), inflation: 20.9, policyRate: 26.0 },
        { month: 'Aug 25', date: new Date('2025-08-31'), inflation: 20.4, policyRate: 26.0 },
        { month: 'Sep 25', date: new Date('2025-09-30'), inflation: 21.5, policyRate: 26.0 },
        { month: 'Oct 25', date: new Date('2025-10-31'), inflation: 22.1, policyRate: 26.0 },
        { month: 'Nov 25', date: new Date('2025-11-30'), inflation: 21.0, policyRate: 25.0 },
        { month: 'Dec 25', date: new Date('2025-12-31'), inflation: 19.8, policyRate: 25.0 },
        // 2026
        { month: 'Jan 26', date: new Date('2026-01-31'), inflation: 3.8, policyRate: 20.0 },
        { month: 'Feb 26', date: new Date('2026-02-13'), inflation: 3.8, policyRate: 20.0 },
    ];

    for (const data of inflationData) {
        await prisma.economicData.create({
            data: {
                indicator: 'INFLATION_RATE',
                value: data.inflation,
                date: data.date,
                source: 'Ghana Statistical Service',
                unit: '%',
                metadata: {
                    month: data.month,
                    policyRate: data.policyRate,
                    targetLow: 6,
                    targetHigh: 10,
                },
            },
        });
    }

    // Exchange Rate Data (Monthly 2023-2025)
    const exchangeRateData = [
        // 2023
        { month: 'Jan 23', date: new Date('2023-01-31'), rate: 11.85 },
        { month: 'Feb 23', date: new Date('2023-02-28'), rate: 12.20 },
        { month: 'Mar 23', date: new Date('2023-03-31'), rate: 12.45 },
        { month: 'Apr 23', date: new Date('2023-04-30'), rate: 12.10 },
        { month: 'May 23', date: new Date('2023-05-31'), rate: 11.95 },
        { month: 'Jun 23', date: new Date('2023-06-30'), rate: 11.80 },
        { month: 'Jul 23', date: new Date('2023-07-31'), rate: 11.50 },
        { month: 'Aug 23', date: new Date('2023-08-31'), rate: 11.35 },
        { month: 'Sep 23', date: new Date('2023-09-30'), rate: 11.40 },
        { month: 'Oct 23', date: new Date('2023-10-31'), rate: 11.60 },
        { month: 'Nov 23', date: new Date('2023-11-30'), rate: 11.75 },
        { month: 'Dec 23', date: new Date('2023-12-31'), rate: 12.00 },
        // 2024
        { month: 'Jan 24', date: new Date('2024-01-31'), rate: 12.15 },
        { month: 'Feb 24', date: new Date('2024-02-29'), rate: 12.45 },
        { month: 'Mar 24', date: new Date('2024-03-31'), rate: 12.80 },
        { month: 'Apr 24', date: new Date('2024-04-30'), rate: 13.20 },
        { month: 'May 24', date: new Date('2024-05-31'), rate: 14.50 },
        { month: 'Jun 24', date: new Date('2024-06-30'), rate: 14.85 },
        { month: 'Jul 24', date: new Date('2024-07-31'), rate: 15.20 },
        { month: 'Aug 24', date: new Date('2024-08-31'), rate: 15.50 },
        { month: 'Sep 24', date: new Date('2024-09-30'), rate: 15.75 },
        { month: 'Oct 24', date: new Date('2024-10-31'), rate: 16.10 },
        { month: 'Nov 24', date: new Date('2024-11-30'), rate: 16.35 },
        { month: 'Dec 24', date: new Date('2024-12-31'), rate: 16.20 },
        // 2025
        { month: 'Jan 25', date: new Date('2025-01-31'), rate: 15.85 },
        { month: 'Feb 25', date: new Date('2025-02-28'), rate: 16.10 },
        { month: 'Mar 25', date: new Date('2025-03-31'), rate: 16.45 },
        { month: 'Apr 25', date: new Date('2025-04-30'), rate: 16.80 },
        { month: 'May 25', date: new Date('2025-05-31'), rate: 17.20 },
        { month: 'Jun 25', date: new Date('2025-06-30'), rate: 17.50 },
        { month: 'Jul 25', date: new Date('2025-07-31'), rate: 17.85 },
        { month: 'Aug 25', date: new Date('2025-08-31'), rate: 18.20 },
        { month: 'Sep 25', date: new Date('2025-09-30'), rate: 18.50 },
        { month: 'Oct 25', date: new Date('2025-10-31'), rate: 18.80 },
        { month: 'Nov 25', date: new Date('2025-11-30'), rate: 19.10 },
        { month: 'Dec 25', date: new Date('2025-12-31'), rate: 15.20 },
        // 2026
        { month: 'Jan 26', date: new Date('2026-01-31'), rate: 11.05 },
        { month: 'Feb 26', date: new Date('2026-02-13'), rate: 10.9920 },
    ];

    for (const data of exchangeRateData) {
        await prisma.economicData.create({
            data: {
                indicator: 'EXCHANGE_RATE_USD',
                value: data.rate,
                date: data.date,
                source: 'Bank of Ghana',
                unit: 'GHS per USD',
                metadata: {
                    month: data.month,
                },
            },
        });
    }

    // Unemployment Rate (Quarterly 2024-2025)
    const unemploymentData = [
        { quarter: '2024 Q1', date: new Date('2024-03-31'), rate: 12.9 },
        { quarter: '2024 Q2', date: new Date('2024-06-30'), rate: 12.7 },
        { quarter: '2024 Q3', date: new Date('2024-09-30'), rate: 12.8 },
        { quarter: '2024 Q4', date: new Date('2024-12-31'), rate: 13.1 },
        { quarter: '2025 Q1', date: new Date('2025-03-31'), rate: 12.8 },
    ];

    for (const data of unemploymentData) {
        await prisma.economicData.create({
            data: {
                indicator: 'UNEMPLOYMENT_RATE',
                value: data.rate,
                date: data.date,
                source: 'Ghana Statistical Service',
                unit: '%',
                metadata: {
                    quarter: data.quarter,
                },
            },
        });
    }

    // Trade Balance (Monthly 2024)
    const tradeBalanceData = [
        { month: 'Jan 24', date: new Date('2024-01-31'), balance: 0.4 },
        { month: 'Feb 24', date: new Date('2024-02-29'), balance: 0.1 },
        { month: 'Mar 24', date: new Date('2024-03-31'), balance: 0.8 },
        { month: 'Apr 24', date: new Date('2024-04-30'), balance: 0.7 },
        { month: 'May 24', date: new Date('2024-05-31'), balance: 0.9 },
        { month: 'Jun 24', date: new Date('2024-06-30'), balance: 1.2 },
        { month: 'Jul 24', date: new Date('2024-07-31'), balance: 1.4 },
        { month: 'Aug 24', date: new Date('2024-08-31'), balance: 1.6 },
        { month: 'Sep 24', date: new Date('2024-09-30'), balance: 1.8 },
        { month: 'Oct 24', date: new Date('2024-10-31'), balance: 2.0 },
        { month: 'Nov 24', date: new Date('2024-11-30'), balance: 2.1 },
        { month: 'Dec 24', date: new Date('2024-12-31'), balance: 3.9 },
        // 2025
        { month: 'Jun 25', date: new Date('2025-06-30'), balance: 2.5 },
        { month: 'Dec 25', date: new Date('2025-12-31'), balance: 3.2 },
    ];

    for (const data of tradeBalanceData) {
        await prisma.economicData.create({
            data: {
                indicator: 'TRADE_BALANCE',
                value: data.balance,
                date: data.date,
                source: 'Ghana Statistical Service',
                unit: 'Billion USD',
                metadata: {
                    month: data.month,
                },
            },
        });
    }

    // Forex Reserves (Quarterly 2023-2025)
    const forexReservesData = [
        { quarter: '2023 Q1', date: new Date('2023-03-31'), reserves: 5.2 },
        { quarter: '2023 Q2', date: new Date('2023-06-30'), reserves: 5.1 },
        { quarter: '2023 Q3', date: new Date('2023-09-30'), reserves: 5.0 },
        { quarter: '2023 Q4', date: new Date('2023-12-31'), reserves: 5.0 },
        { quarter: '2024 Q1', date: new Date('2024-03-31'), reserves: 6.2 },
        { quarter: '2024 Q2', date: new Date('2024-06-30'), reserves: 6.8 },
        { quarter: '2024 Q3', date: new Date('2024-09-30'), reserves: 7.5 },
        { quarter: '2024 Q4', date: new Date('2024-12-31'), reserves: 7.2 },
        { quarter: '2025 Q1', date: new Date('2025-03-31'), reserves: 5.4 },
        { quarter: '2025 Q2', date: new Date('2025-06-30'), reserves: 5.8 },
        { quarter: '2025 Q3', date: new Date('2025-09-30'), reserves: 6.1 },
        { quarter: '2025 Q4', date: new Date('2025-12-31'), reserves: 6.4 },
        { quarter: '2026 Q1', date: new Date('2026-02-13'), reserves: 6.7 },
    ];

    for (const data of forexReservesData) {
        await prisma.economicData.create({
            data: {
                indicator: 'FOREX_RESERVES',
                value: data.reserves,
                date: data.date,
                source: 'Bank of Ghana',
                unit: 'Billion USD',
                metadata: {
                    quarter: data.quarter,
                },
            },
        });
    }

    // Policy Rate (Monthly 2025-2026)
    const policyRateData = [
        { month: 'Jul 25', date: new Date('2025-07-31'), rate: 26.0 },
        { month: 'Sep 25', date: new Date('2025-09-30'), rate: 23.5 },
        { month: 'Oct 25', date: new Date('2025-10-31'), rate: 18.0 },
        { month: 'Jan 26', date: new Date('2026-01-31'), rate: 15.5 },
        { month: 'Feb 26', date: new Date('2026-02-13'), rate: 15.5 },
    ];

    for (const data of policyRateData) {
        await prisma.economicData.create({
            data: {
                indicator: 'POLICY_RATE',
                value: data.rate,
                date: data.date,
                source: 'Bank of Ghana',
                unit: '%',
                metadata: {
                    month: data.month,
                    note: 'Aggressive monetary easing to stimulate growth',
                },
            },
        });
    }

    console.log('✅ Economic data seeded successfully!');
    console.log(`   - ${gdpData.length} GDP growth records`);
    console.log(`   - ${inflationData.length} inflation records`);
    console.log(`   - ${exchangeRateData.length} exchange rate records`);
    console.log(`   - ${unemploymentData.length} unemployment records`);
    console.log(`   - ${tradeBalanceData.length} trade balance records`);
    console.log(`   - ${forexReservesData.length} forex reserves records`);
}

async function main() {
    try {
        await seedEconomicData();
    } catch (error) {
        console.error('Error seeding economic data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
