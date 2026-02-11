import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEconomyData() {
    console.log('🌱 Seeding economy data...');

    try {
        // Clear existing economy data
        await prisma.economicData.deleteMany({
            where: {
                indicator: {
                    in: ['GDP_GROWTH', 'INFLATION_RATE', 'EXCHANGE_RATE_USD', 'UNEMPLOYMENT_RATE', 'TRADE_BALANCE', 'FOREX_RESERVES'],
                },
            },
        });
        console.log('✅ Cleared existing economy data');

        // 1. GDP Growth Data (Quarterly, last 7 years)
        const gdpData = [];
        const gdpStartDate = new Date('2019-01-01');

        for (let i = 0; i < 28; i++) {
            const date = new Date(gdpStartDate);
            date.setMonth(gdpStartDate.getMonth() + i * 3);

            // Realistic GDP Trend:
            // 2024 (Indices ~20-23): ~5.7% (Stronger than expected)
            // 2025 (Indices ~24-27): ~4.5% (Stabilizing)
            let growth = 3.5;

            if (i >= 20 && i <= 23) { // 2024
                growth = 5.7 + (Math.random() * 0.5 - 0.25);
            } else if (i >= 24) { // 2025
                growth = 4.3 + (Math.random() * 0.4 - 0.2);
            } else {
                growth = 3.5 + Math.random() * 2.5; // Older data variance
            }

            gdpData.push({
                indicator: 'GDP_GROWTH',
                value: parseFloat(growth.toFixed(1)),
                date: date,
                source: 'Ghana Statistical Service',
                unit: '%',
                metadata: {
                    quarter: `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`,
                },
            });
        }

        await prisma.economicData.createMany({ data: gdpData });
        console.log(`✅ Created ${gdpData.length} GDP growth records`);

        // 2. Inflation Rate (Monthly, last 3 years)
        const inflationData = [];
        const inflStartDate = new Date('2023-01-01');
        let currentInf = 54.0; // Start high in 2023

        for (let i = 0; i < 37; i++) { // Up to Jan 2026
            const date = new Date(inflStartDate);
            date.setMonth(inflStartDate.getMonth() + i);

            // Trend: Drop to ~23% by late 2024, then sharp drop to ~5% by late 2025
            if (date.getFullYear() === 2024) {
                // Dec 2024 target ~23%
                const progress = date.getMonth() / 11;
                currentInf = 54 - (54 - 23.2) * progress; // Linear-ish drop
            } else if (date.getFullYear() === 2025) {
                // Dec 2025 target ~5.4%
                const progress = date.getMonth() / 11;
                currentInf = 23.2 - (23.2 - 5.4) * progress;
            } else if (date.getFullYear() === 2026) {
                currentInf = 5.0; // Stable low
            }

            // Add small noise
            currentInf += (Math.random() - 0.5) * 0.5;

            inflationData.push({
                indicator: 'INFLATION_RATE',
                value: parseFloat(currentInf.toFixed(1)),
                date: date,
                source: 'Ghana Statistical Service',
                unit: '%',
                metadata: {
                    policyRate: parseFloat((currentInf + (currentInf > 10 ? 6 : 2)).toFixed(1)),
                },
            });
        }

        await prisma.economicData.createMany({ data: inflationData });
        console.log(`✅ Created ${inflationData.length} inflation records`);

        // 3. Exchange Rate (Monthly, last 3 years)
        const exchangeData = [];
        const exStartDate = new Date('2023-01-01');
        let rate = 11.0;

        for (let i = 0; i < 37; i++) {
            const date = new Date(exStartDate);
            date.setMonth(exStartDate.getMonth() + i);

            // Depreciating trend but stabilizing in 2025
            if (date.getFullYear() <= 2024) {
                rate += 0.2 + Math.random() * 0.1; // Faster dep
            } else {
                rate += 0.05 + Math.random() * 0.05; // Slower/Stable in 2025
            }
            // Cap at realistic max ~16-17
            if (rate > 16.5) rate = 16.5 + (Math.random() - 0.5) * 0.2;

            exchangeData.push({
                indicator: 'EXCHANGE_RATE_USD',
                value: parseFloat(rate.toFixed(2)),
                date: date,
                source: 'Bank of Ghana',
                unit: 'GHS',
                metadata: undefined,
            });
        }

        await prisma.economicData.createMany({ data: exchangeData });
        console.log(`✅ Created ${exchangeData.length} exchange rate records`);

        // 4. Other Indicators (Snapshot/Latest)
        const otherIndicators = [
            {
                indicator: 'UNEMPLOYMENT_RATE',
                value: 3.9,
                date: new Date('2025-12-31'),
                source: 'Ghana Statistical Service',
                unit: '%',
            },
            {
                indicator: 'TRADE_BALANCE',
                value: 1200000000, // 1.2B USD
                date: new Date('2025-12-31'),
                source: 'Bank of Ghana',
                unit: 'USD',
            },
            {
                indicator: 'FOREX_RESERVES',
                value: 5900000000, // 5.9B USD
                date: new Date('2025-12-31'),
                source: 'Bank of Ghana',
                unit: 'USD',
            }
        ];

        await prisma.economicData.createMany({ data: otherIndicators });
        console.log(`✅ Created ${otherIndicators.length} other indicator records`);

        console.log('\n🎉 Economy data seeding completed successfully!');
        console.log(`📊 Total records created: ${gdpData.length + inflationData.length + exchangeData.length + otherIndicators.length}`);

    } catch (error) {
        console.error('❌ Error seeding economy data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedEconomyData()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
