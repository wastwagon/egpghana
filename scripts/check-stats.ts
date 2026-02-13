import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const allIndicators = await prisma.economicData.groupBy({
        by: ['indicator'],
        _count: { _all: true }
    });
    console.log('Indicator Breakdown:', allIndicators);

    const imf = await prisma.economicData.findMany({ where: { indicator: 'IMF_DISBURSEMENT' } });
    console.log('IMF Count:', imf.length);
    console.log('IMF Total:', imf.reduce((s, r) => s + r.value, 0));

    const debt = await prisma.economicData.findFirst({
        where: { indicator: 'TOTAL_DEBT' },
        orderBy: { date: 'desc' },
    });
    console.log('Latest Debt:', debt);

    const debtGdp = await prisma.economicData.findFirst({
        where: { indicator: 'DEBT_TO_GDP_RATIO' },
        orderBy: { date: 'desc' },
    });
    console.log('Latest Debt to GDP:', debtGdp);

    await prisma.$disconnect();
}
main();
