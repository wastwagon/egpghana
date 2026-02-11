
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const events = await prisma.event.findMany({
        orderBy: { startDate: 'desc' }
    });
    console.log(`Found ${events.length} events:`);
    events.forEach(e => console.log(`- ${e.title} (${e.startDate.toISOString()})`));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
