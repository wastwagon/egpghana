
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.article.count();
    console.log(`Found ${count} articles in the database.`);

    const articles = await prisma.article.findMany({ take: 3 });
    console.log('Sample articles:', articles.map(a => a.title));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
