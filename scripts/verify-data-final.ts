import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('--- IMF DISBURSEMENT CHECK ---');
    const imf = await prisma.economicData.findMany({ where: { indicator: 'IMF_DISBURSEMENT' } });
    console.log('Count:', imf.length);
    imf.forEach(r => {
        const meta = r.metadata as any;
        console.log(`Date: ${r.date.toISOString().split('T')[0]}, Value: ${r.value}, SDR: ${meta?.sdr}, Status: ${meta?.status}`);
    });

    console.log('\n--- CREDITOR DEBT CHECK ---');
    const creditors = await prisma.economicData.findMany({ where: { indicator: 'DEBT_BY_CREDITOR' } });
    console.log('Count:', creditors.length);
    creditors.forEach(r => {
        const meta = r.metadata as any;
        console.log(`Indicator: ${r.indicator}, Creditor: ${meta?.creditor}, Type: ${meta?.type}, Value: ${r.value}`);
    });

    await prisma.$disconnect();
}
main();
