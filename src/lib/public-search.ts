import { prisma } from '@/lib/prisma';

const DASHBOARD_INDEX = [
    { title: 'Macro Economy Dashboard', href: '/dashboards/economy', keywords: 'gdp inflation exchange rate policy' },
    { title: 'Public Debt Tracker', href: '/dashboards/debt', keywords: 'debt gdp servicing external domestic' },
    { title: 'IMF Bailout Monitor', href: '/dashboards/imf', keywords: 'imf disbursement conditionality program' },
];

export async function searchPublicContent(q: string, limit = 12) {
    const query = q.trim();
    if (query.length < 2) {
        return { query, articles: [], resources: [], dashboards: [] };
    }

    const take = Math.min(limit, 30);

    const [articles, resources] = await Promise.all([
        prisma.article.findMany({
            where: {
                publishedAt: { lte: new Date() },
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { excerpt: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                title: true,
                slug: true,
                excerpt: true,
                publishedAt: true,
                category: { select: { name: true } },
            },
            orderBy: { publishedAt: 'desc' },
            take,
        }),
        prisma.resource.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { fileName: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                title: true,
                description: true,
                fileUrl: true,
                category: true,
                publishedAt: true,
            },
            orderBy: { publishedAt: 'desc' },
            take,
        }),
    ]);

    const dashboards = DASHBOARD_INDEX.filter((d) => {
        const hay = `${d.title} ${d.keywords}`.toLowerCase();
        return hay.includes(query.toLowerCase());
    });

    return {
        query,
        articles: articles.map((a) => ({
            title: a.title,
            href: `/articles/${a.slug}`,
            excerpt: a.excerpt,
            category: a.category.name,
            publishedAt: a.publishedAt,
        })),
        resources: resources.map((r) => ({
            title: r.title,
            href: r.fileUrl,
            description: r.description,
            category: r.category,
            publishedAt: r.publishedAt,
        })),
        dashboards,
    };
}
