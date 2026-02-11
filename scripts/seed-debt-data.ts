import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDebtData() {
    console.log('🌱 Seeding debt data...');

    try {
        // Clear existing debt data
        await prisma.economicData.deleteMany({
            where: {
                indicator: {
                    in: ['TOTAL_DEBT', 'DEBT_TO_GDP_RATIO', 'DEBT_BY_CREDITOR', 'DEBT_SERVICE_TO_REVENUE'],
                },
            },
        });
        console.log('✅ Cleared existing debt data');

        // Generate monthly debt data (2019-2026, 84 months)
        const monthlyDebtData = [];
        const startDate = new Date('2019-01-01');
        let baseDebt = 200000000000; // Starting at GH₵ 200B in 2019

        // Target: ~685B by Nov 2025
        // 83 months from Jan 2019 to Nov 2025
        // CAGR approx 1.85% monthly

        for (let i = 0; i < 84; i++) {
            const date = new Date(startDate);
            date.setMonth(startDate.getMonth() + i);
            const currentDate = date;
            const year = date.getFullYear();

            // Nov 2025 (Last data point) - specific legacy data
            if (i === 83) {
                // Nov 2025 specific values
                baseDebt = 644600000000; // 644.6B
                const domestic = 314400000000; // 314.4B
                const external = 330200000000; // 330.2B

                monthlyDebtData.push({
                    indicator: 'TOTAL_DEBT',
                    value: baseDebt,
                    date: currentDate,
                    source: 'Ministry of Finance / IMF', // Added source and unit to match existing structure
                    unit: 'GHS',
                    metadata: {
                        currency: 'GHS',
                        domestic: domestic,
                        external: external,
                        domestic_share: 48.8,
                        external_share: 51.2,
                        source: 'Ministry of Finance'
                    }
                });
            }
            // Aug 2025 (3 months prior) - set to support the specific trend calculation
            // Trend: Domestic +15.4% (was ~290B), External -23.1% (was ~455B)
            else if (i === 80) {
                baseDebt = 290000000000 + 455000000000;
                monthlyDebtData.push({
                    indicator: 'TOTAL_DEBT',
                    value: baseDebt,
                    date: currentDate,
                    source: 'Ministry of Finance / IMF', // Added source and unit to match existing structure
                    unit: 'GHS',
                    metadata: {
                        currency: 'GHS',
                        domestic: 290000000000,
                        external: 455000000000,
                        domestic_share: (290 / 745) * 100,
                        external_share: (455 / 745) * 100,
                    }
                });
            }
            else {
                // Simulate debt growth logic
                let growthRate = 0.015; // Base growth 1.5%

                if (year >= 2022 && year < 2023) {
                    growthRate = 0.035; // High growth during crisis
                } else if (year >= 2023 && year < 2024) {
                    growthRate = 0.01; // Slowdown due to DDEP
                } else if (year >= 2024) {
                    growthRate = 0.018; // Steady rise
                }

                // Apply volatility
                const growth = 1 + (growthRate + (Math.random() * 0.01 - 0.005));
                baseDebt *= growth;

                // Shift composition: Domestic was higher, now External is higher (51% Ext / 49% Dom by late 2025)
                // 2019: ~50/50
                // 2023: Domestic hit by DDEP, External share rises
                let externalRatio = 0.50;
                if (year >= 2023) {
                    externalRatio = 0.55; // External share spiked due to cedi depreciation
                }
                if (year >= 2025) {
                    externalRatio = 0.51; // Rebalancing
                }

                // Add some noise
                externalRatio += (Math.random() * 0.02 - 0.01);

                const external = baseDebt * externalRatio;
                const domestic = baseDebt * (1 - externalRatio);

                monthlyDebtData.push({
                    indicator: 'TOTAL_DEBT',
                    value: baseDebt,
                    date: currentDate,
                    source: 'Ministry of Finance / IMF',
                    unit: 'GHS',
                    metadata: {
                        domestic: domestic,
                        external: external,
                    },
                });
            }
        }

        await prisma.economicData.createMany({
            data: monthlyDebtData,
        });
        console.log(`✅ Created ${monthlyDebtData.length} monthly debt records`);

        // Generate quarterly debt-to-GDP ratio data (2019-2026, 28 quarters)
        const quarterlyGDPData = [];
        const gdpStartDate = new Date('2019-01-01');
        let baseRatio = 61.2; // Starting ratio 2019

        for (let i = 0; i < 28; i++) {
            const date = new Date(gdpStartDate);
            date.setMonth(gdpStartDate.getMonth() + i * 3);
            const year = date.getFullYear();

            // Logic matching reality:
            // 2019: ~62%
            // 2020: ~76% (Covid)
            // 2022: Peak ~93% (Crisis)
            // 2023: ~84%
            // 2024: ~75%
            // 2025: Targeting ~60-70%

            if (year === 2019) baseRatio = 62.0 + Math.random();
            if (year === 2020) baseRatio = 74.0 + Math.random() * 2;
            if (year === 2021) baseRatio = 79.0 + Math.random() * 2;
            if (year === 2022) baseRatio = 91.0 + Math.random() * 3;
            if (year === 2023) baseRatio = 84.0 - (Math.random());
            if (year === 2024) baseRatio = 71.0 + Math.random();
            if (year === 2025) {
                // 2025 drop to 45.5% specific target
                baseRatio = 45.5;
            } else {
                baseRatio = 60.0 + (Math.random() * 2 - 1);
            }
            quarterlyGDPData.push({
                indicator: 'DEBT_TO_GDP_RATIO',
                value: parseFloat(baseRatio.toFixed(1)),
                date: date,
                source: 'Bank of Ghana / IMF',
                unit: '%',
                metadata: {},
            });
        }

        await prisma.economicData.createMany({
            data: quarterlyGDPData,
        });
        console.log(`✅ Created ${quarterlyGDPData.length} quarterly debt-to-GDP records`);

        // Generate annual Debt Service to Revenue data
        const debtServiceData = [];
        const serviceStartDate = new Date('2019-12-31');

        for (let i = 0; i < 7; i++) {
            const date = new Date(serviceStartDate);
            date.setFullYear(serviceStartDate.getFullYear() + i);
            const year = date.getFullYear();

            // Reality:
            // 2019: ~45%
            // 2020: ~70%
            // 2021: ~73%
            // 2022: >100% (Crisis peak)
            // 2023: ~40% (Post-DDEP relief)
            // 2024: ~45%
            // 2025: ~48%

            let ratio = 45.0;
            if (year === 2020) ratio = 70.0;
            if (year === 2021) ratio = 73.0;
            if (year === 2022) ratio = 110.0; // Consumed all revenue
            if (year === 2023) ratio = 42.0;
            if (year === 2024) ratio = 45.0;
            if (year === 2025) ratio = 48.0;

            debtServiceData.push({
                indicator: 'DEBT_SERVICE_TO_REVENUE',
                value: ratio,
                date: date,
                source: 'Ministry of Finance',
                unit: '%',
                metadata: {},
            });
        }

        await prisma.economicData.createMany({
            data: debtServiceData,
        });
        console.log(`✅ Created ${debtServiceData.length} debt service records`);

        // Create debt by creditor data (2025 snapshot)
        // Total External ~ 29.1B USD -> ~367B GHS
        // Total Domestic ~ 317B GHS
        const creditors = [
            // External (Total ~367B)
            { name: 'Eurobond Holders', amount: 130000000000, type: 'Commercial' }, // Restructured
            { name: 'World Bank (IDA)', amount: 95000000000, type: 'Multilateral' },
            { name: 'IMF', amount: 45000000000, type: 'Multilateral' },
            { name: 'China', amount: 25000000000, type: 'Bilateral' },
            { name: 'Paris Club', amount: 20000000000, type: 'Bilateral' },
            { name: 'Other Multilaterals', amount: 52000000000, type: 'Multilateral' },
            // Domestic (Total ~317B) - Just showing top categories for simplicity in chart
            { name: 'Banking Sector', amount: 150000000000, type: 'Domestic' },
            { name: 'Bank of Ghana', amount: 80000000000, type: 'Domestic' },
            { name: 'Other Domestic', amount: 87000000000, type: 'Domestic' },
        ];

        const currentDate = new Date('2025-11-01');
        const creditorData = creditors.map((creditor, index) => {
            const date = new Date(currentDate);
            date.setHours(index); // Use different hours to avoid unique constraint
            return {
                indicator: 'DEBT_BY_CREDITOR',
                value: creditor.amount,
                date: date,
                source: 'Ministry of Finance',
                unit: 'GHS',
                metadata: {
                    creditor: creditor.name,
                    type: creditor.type,
                },
            };
        });

        await prisma.economicData.createMany({
            data: creditorData,
        });
        console.log(`✅ Created ${creditorData.length} creditor debt records`);

        console.log('\n🎉 Debt data seeding completed successfully!');
        console.log(`📊 Total records created: ${monthlyDebtData.length + quarterlyGDPData.length + debtServiceData.length + creditorData.length}`);
    } catch (error) {
        console.error('❌ Error seeding debt data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedDebtData()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
