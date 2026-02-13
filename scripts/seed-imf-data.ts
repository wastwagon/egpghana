import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedIMFData() {
    console.log('🌱 Seeding IMF program data...');

    try {
        // Clear existing IMF data
        await prisma.economicData.deleteMany({
            where: {
                indicator: {
                    in: ['IMF_PROGRAM_TOTAL', 'IMF_DISBURSEMENT', 'IMF_MILESTONE', 'IMF_CONDITIONALITY'],
                },
            },
        });
        console.log('✅ Cleared existing IMF data');

        // Create program overview
        await prisma.economicData.create({
            data: {
                indicator: 'IMF_PROGRAM_TOTAL',
                value: 3000000000, // SDR 3B
                date: new Date('2023-05-17'),
                source: 'IMF',
                unit: 'SDR',
                metadata: {
                    programType: 'Extended Credit Facility',
                    duration: '36 months',
                    endDate: '2026-05-17',
                },
            },
        });
        console.log('✅ Created program overview');

        // Create disbursement schedule (12 quarters)
        const disbursements = [
            { quarter: 'Q2 2023', date: '2023-06-01', planned: 600000000, actual: 600000000, status: 'Completed' },
            { quarter: 'Q3 2023', date: '2023-09-01', planned: 250000000, actual: 250000000, status: 'Completed' },
            { quarter: 'Q4 2023', date: '2023-12-01', planned: 250000000, actual: 250000000, status: 'Completed' },
            { quarter: 'Q1 2024', date: '2024-03-01', planned: 250000000, actual: 250000000, status: 'Completed' },
            { quarter: 'Q2 2024', date: '2024-06-01', planned: 250000000, actual: 250000000, status: 'Completed' },
            { quarter: 'Q3 2024', date: '2024-09-01', planned: 250000000, actual: 200000000, status: 'Completed' },
            { quarter: 'Q4 2024', date: '2024-12-01', planned: 250000000, actual: 0, status: 'Pending' },
            { quarter: 'Q1 2025', date: '2025-03-01', planned: 250000000, actual: 0, status: 'Pending' },
            { quarter: 'Q2 2025', date: '2025-06-01', planned: 250000000, actual: 0, status: 'Pending' },
            { quarter: 'Q3 2025', date: '2025-09-01', planned: 250000000, actual: 0, status: 'Pending' },
            { quarter: 'Q4 2025', date: '2025-12-01', planned: 200000000, actual: 0, status: 'Pending' },
            { quarter: 'Q1 2026', date: '2026-03-01', planned: 200000000, actual: 0, status: 'Pending' },
        ];

        for (const disb of disbursements) {
            await prisma.economicData.create({
                data: {
                    indicator: 'IMF_DISBURSEMENT',
                    value: (disb.actual || disb.planned) / 1000000, // Seed in Millions
                    date: new Date(disb.date),
                    source: 'IMF',
                    unit: 'SDR',
                    metadata: {
                        quarter: disb.quarter,
                        planned: disb.planned / 1000000,
                        actual: disb.actual / 1000000,
                        sdr: (disb.actual || disb.planned) / 1000000,
                        status: disb.status,
                    },
                },
            });
        }
        console.log(`✅ Created ${disbursements.length} disbursement records`);

        // Create program milestones
        const milestones = [
            {
                date: '2023-05-17',
                title: 'Program Start',
                description: 'IMF Board approves SDR 3 billion Extended Credit Facility for Ghana',
                status: 'completed',
                type: 'start',
            },
            {
                date: '2023-06-01',
                title: 'First Disbursement',
                description: 'Initial disbursement of SDR 600 million',
                status: 'completed',
                type: 'disbursement',
            },
            {
                date: '2023-12-15',
                title: 'First Review',
                description: 'Successful completion of first program review',
                status: 'completed',
                type: 'review',
            },
            {
                date: '2024-06-15',
                title: 'Second Review',
                description: 'Second program review completed with waivers',
                status: 'completed',
                type: 'review',
            },
            {
                date: '2024-12-15',
                title: 'Third Review',
                description: 'Third program review scheduled',
                status: 'upcoming',
                type: 'review',
            },
            {
                date: '2025-06-15',
                title: 'Fourth Review',
                description: 'Fourth program review scheduled',
                status: 'pending',
                type: 'review',
            },
            {
                date: '2025-12-15',
                title: 'Fifth Review',
                description: 'Fifth program review scheduled',
                status: 'pending',
                type: 'review',
            },
            {
                date: '2026-05-17',
                title: 'Program Completion',
                description: 'Expected completion of 36-month ECF program',
                status: 'pending',
                type: 'end',
            },
        ];

        for (const milestone of milestones) {
            await prisma.economicData.create({
                data: {
                    indicator: 'IMF_MILESTONE',
                    value: 1,
                    date: new Date(milestone.date),
                    source: 'IMF',
                    unit: 'milestone',
                    metadata: milestone,
                },
            });
        }
        console.log(`✅ Created ${milestones.length} milestone records`);

        // Create conditionalities
        const conditionalities = [
            {
                title: 'Reduce fiscal deficit to 7.7% of GDP',
                category: 'Fiscal',
                status: 'Met',
                deadline: '2023-12-31',
                description: 'Achieve primary fiscal deficit target through revenue mobilization and expenditure rationalization',
                target: 7.7,
                actual: 7.5,
                unit: '% of GDP',
            },
            {
                title: 'Increase tax revenue to 15.5% of GDP',
                category: 'Fiscal',
                status: 'In Progress',
                deadline: '2024-12-31',
                description: 'Enhance domestic revenue mobilization through tax policy reforms and improved administration',
                target: 15.5,
                actual: 14.8,
                unit: '% of GDP',
            },
            {
                title: 'Limit wage bill to 35% of tax revenue',
                category: 'Fiscal',
                status: 'Met',
                deadline: '2023-12-31',
                description: 'Control public sector wage expenditure relative to tax revenue',
                target: 35,
                actual: 34.2,
                unit: '% of tax revenue',
            },
            {
                title: 'Implement E-Levy reforms',
                category: 'Fiscal',
                status: 'Met',
                deadline: '2023-06-30',
                description: 'Enhance electronic transactions levy to improve revenue collection',
            },
            {
                title: 'Strengthen VAT compliance',
                category: 'Fiscal',
                status: 'In Progress',
                deadline: '2024-12-31',
                description: 'Improve VAT registration and compliance monitoring systems',
            },
            {
                title: 'Reduce inflation to single digits',
                category: 'Monetary',
                status: 'In Progress',
                deadline: '2025-12-31',
                description: 'Achieve inflation target through tight monetary policy',
                target: 9.5,
                actual: 23.2,
                unit: '%',
            },
            {
                title: 'Maintain positive real interest rates',
                category: 'Monetary',
                status: 'Met',
                deadline: '2024-06-30',
                description: 'Keep policy rate above inflation to anchor expectations',
            },
            {
                title: 'Rebuild foreign exchange reserves',
                category: 'Monetary',
                status: 'In Progress',
                deadline: '2025-12-31',
                description: 'Accumulate reserves to cover at least 3 months of imports',
                target: 3.0,
                actual: 2.4,
                unit: 'months of imports',
            },
            {
                title: 'Complete domestic debt restructuring',
                category: 'Structural',
                status: 'Met',
                deadline: '2023-12-31',
                description: 'Finalize Domestic Debt Exchange Program (DDEP)',
            },
            {
                title: 'Finalize external debt restructuring',
                category: 'Structural',
                status: 'In Progress',
                deadline: '2024-12-31',
                description: 'Reach agreement with external creditors under Common Framework',
            },
            {
                title: 'Reform state-owned enterprises',
                category: 'Structural',
                status: 'In Progress',
                deadline: '2025-06-30',
                description: 'Improve governance and reduce fiscal risks from SOEs',
            },
            {
                title: 'Strengthen public financial management',
                category: 'Structural',
                status: 'In Progress',
                deadline: '2024-12-31',
                description: 'Enhance budget preparation, execution, and monitoring',
            },
            {
                title: 'Implement Treasury Single Account',
                category: 'Structural',
                status: 'Met',
                deadline: '2023-12-31',
                description: 'Consolidate government cash balances in single account',
            },
            {
                title: 'Enhance social protection programs',
                category: 'Structural',
                status: 'In Progress',
                deadline: '2025-12-31',
                description: 'Expand Livelihood Empowerment Against Poverty (LEAP) coverage',
                target: 350000,
                actual: 280000,
                unit: 'households',
            },
            {
                title: 'Improve electricity sector viability',
                category: 'Structural',
                status: 'In Progress',
                deadline: '2025-06-30',
                description: 'Reduce losses and improve cost recovery in power sector',
            },
            {
                title: 'Strengthen anti-corruption framework',
                category: 'Structural',
                status: 'In Progress',
                deadline: '2024-12-31',
                description: 'Enhance transparency and accountability in public procurement',
            },
            {
                title: 'Publish beneficial ownership register',
                category: 'Structural',
                status: 'Not Met',
                deadline: '2024-06-30',
                description: 'Establish public register of beneficial owners of companies',
            },
            {
                title: 'Implement petroleum revenue management reforms',
                category: 'Structural',
                status: 'In Progress',
                deadline: '2025-12-31',
                description: 'Strengthen governance of oil and gas revenues',
            },
        ];


        for (let i = 0; i < conditionalities.length; i++) {
            const cond = conditionalities[i];
            const date = new Date(cond.deadline);
            date.setHours(i); // Use different hours to avoid unique constraint

            await prisma.economicData.create({
                data: {
                    indicator: 'IMF_CONDITIONALITY',
                    value: 1,
                    date: date,
                    source: 'IMF',
                    unit: 'status',
                    metadata: cond,
                },
            });
        }
        console.log(`✅ Created ${conditionalities.length} conditionality records`);

        console.log('\n🎉 IMF data seeding completed successfully!');
        console.log(`📊 Total records created: ${1 + disbursements.length + milestones.length + conditionalities.length}`);
    } catch (error) {
        console.error('❌ Error seeding IMF data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedIMFData()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
