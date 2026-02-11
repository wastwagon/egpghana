
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDashboardData() {
    console.log('🔍 Verifying Dashboard Data Seeding...\n');

    // --- 1. Economy Dashboard ---
    console.log('--- 📊 Economy Dashboard ---');

    // GDP Growth
    const gdp = await prisma.economicData.findMany({
        where: { indicator: 'GDP_GROWTH' },
        orderBy: { date: 'desc' },
        take: 5
    });
    console.log(`GDP_GROWTH: Found ${await prisma.economicData.count({ where: { indicator: 'GDP_GROWTH' } })} records`);
    console.log('Latest GDP:', gdp.map(d => `${d.date.toISOString().split('T')[0]}: ${d.value}%`).join(', '));

    // Inflation
    const inflation = await prisma.economicData.findMany({
        where: { indicator: 'INFLATION_RATE' },
        orderBy: { date: 'desc' },
        take: 5
    });
    console.log(`INFLATION_RATE: Found ${await prisma.economicData.count({ where: { indicator: 'INFLATION_RATE' } })} records`);
    console.log('Latest Inflation:', inflation.map(d => `${d.date.toISOString().split('T')[0]}: ${d.value}%`).join(', '));

    // Exchange Rate
    const forex = await prisma.economicData.findMany({
        where: { indicator: 'EXCHANGE_RATE_USD' },
        orderBy: { date: 'desc' },
        take: 5
    });
    console.log(`EXCHANGE_RATE_USD: Found ${await prisma.economicData.count({ where: { indicator: 'EXCHANGE_RATE_USD' } })} records`);
    console.log('Latest FX:', forex.map(d => `${d.date.toISOString().split('T')[0]}: ${d.value}`).join(', '));


    // --- 2. Debt Dashboard ---
    console.log('\n--- 📉 Debt Dashboard ---');

    // Total Debt
    const debt = await prisma.economicData.findMany({
        where: { indicator: 'TOTAL_DEBT' },
        orderBy: { date: 'desc' },
        take: 3
    });
    console.log(`TOTAL_DEBT: Found ${await prisma.economicData.count({ where: { indicator: 'TOTAL_DEBT' } })} records`);
    console.log('Latest Debt:', debt.map(d => `${d.date.toISOString().split('T')[0]}: ${d.value}`).join(', '));

    // Debt Composition (Creditors)
    const creditors = await prisma.economicData.findMany({
        where: { indicator: 'DEBT_BY_CREDITOR' },
    });
    console.log(`DEBT_BY_CREDITOR: Found ${creditors.length} records`);
    const externalCreditors = creditors.filter(c => (c.metadata as any)?.type === 'External');
    const domesticCreditors = creditors.filter(c => (c.metadata as any)?.type === 'Domestic');
    console.log(`External Creditors: ${externalCreditors.length} (${externalCreditors.map(c => (c.metadata as any)?.creditor).join(', ')})`);
    console.log(`Domestic Creditors: ${domesticCreditors.length} (${domesticCreditors.map(c => (c.metadata as any)?.creditor).join(', ')})`);


    // --- 3. IMF Dashboard ---
    console.log('\n--- 🏛️ IMF Dashboard ---');

    // Disbursements
    const disbursements = await prisma.economicData.findMany({
        where: { indicator: 'IMF_DISBURSEMENT' },
        orderBy: { date: 'asc' }
    });
    console.log(`IMF_DISBURSEMENT: Found ${disbursements.length} records`);
    console.log('Disbursements:', disbursements.map(d => `${d.date.toISOString().split('T')[0]}: ${d.value}M`).join(', '));

    // Conditionalities
    const conditions = await prisma.economicData.findMany({
        where: { indicator: 'IMF_CONDITIONALITY' },
    });
    console.log(`IMF_CONDITIONALITY: Found ${conditions.length} records`);

    // Check status distribution
    const statuses = conditions.map(c => (c.metadata as any)?.status);
    const statusCounts = statuses.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    console.log('Conditionality Statuses:', statusCounts);

    // Milestones
    const milestones = await prisma.economicData.findMany({
        where: { indicator: 'IMF_MILESTONE' },
    });
    console.log(`IMF_MILESTONE: Found ${milestones.length} records`);

}

verifyDashboardData()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
