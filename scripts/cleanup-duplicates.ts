
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
    console.log('Cleaning up duplicate/old IMF conditionalities...');
    const { count } = await prisma.economicData.deleteMany({
        where: {
            indicator: 'IMF_CONDITIONALITY',
            source: 'IMF' // The old generic source
        }
    });
    console.log(`Deleted ${count} old records.`);
}

cleanup()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
