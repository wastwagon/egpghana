import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getDashboardData() {
    const [gdp, debt, inflation, debtGdp, exchangeRate, forexReserves, debtService, policyRate] = await Promise.all([
        prisma.economicData.findFirst({
            where: { indicator: 'GDP_GROWTH' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'TOTAL_DEBT' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'INFLATION_RATE' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'DEBT_TO_GDP_RATIO' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'EXCHANGE_RATE_USD' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'FOREX_RESERVES' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'DEBT_SERVICE_TO_REVENUE' },
            orderBy: { date: 'desc' },
        }),
        prisma.economicData.findFirst({
            where: { indicator: 'POLICY_RATE' },
            orderBy: { date: 'desc' },
        }),
    ]);

    const imfDisbursements = await prisma.economicData.findMany({
        where: { indicator: 'IMF_DISBURSEMENT' },
    });

    const totalIMF = 3000000000;
    const disbursedIMF = imfDisbursements.reduce((sum, record) => sum + (record.value as number), 0);
    const imfProgress = (disbursedIMF / totalIMF) * 100;

    const debtMetadata = debt?.metadata as any;
    const domesticDebt = debtMetadata?.domestic || 0;
    const externalDebt = debtMetadata?.external || 0;
    const totalDebtValue = debt?.value || 0;
    const externalShare = totalDebtValue > 0 ? (externalDebt / totalDebtValue) * 100 : 0;

    return {
        gdpGrowth: { value: gdp?.value ?? 0, date: gdp?.date },
        totalDebt: { value: debt?.value ?? 0, date: debt?.date },
        debtToGdp: { value: debtGdp?.value ?? 0, date: debtGdp?.date },
        imfProgress,
        disbursedIMF,
        externalShare,
        debtService: { value: debtService?.value ?? 0, date: debtService?.date },
    };
}

async function main() {
    const stats = await getDashboardData();
    console.log(JSON.stringify(stats, null, 2));
    await prisma.$disconnect();
}
main();
