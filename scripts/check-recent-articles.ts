import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
    console.log('Checking recent articles...');
    const articles = await prisma.article.findMany({
        take: 5,
        orderBy: { publishedAt: 'desc' },
        select: {
            title: true,
            slug: true,
            publishedAt: true,
            category: { select: { name: true } }
        }
    });

    console.log(JSON.stringify(articles, null, 2));
}

checkData()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
