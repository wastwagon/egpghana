import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteBaseUrl } from '@/lib/seo';

const baseUrl = siteBaseUrl();

const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/articles',
    '/careers',
    '/contact',
    '/dashboards',
    '/dashboards/debt',
    '/dashboards/economy',
    '/dashboards/imf',
    '/events',
    '/privacy',
    '/programs',
    '/resources',
    '/team',
    '/terms',
    '/search',
].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'weekly',
    priority: route === '' ? 1 : route.startsWith('/dashboards') ? 0.85 : 0.8,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const [articles, events, programs, careers] = await Promise.all([
        prisma.article.findMany({
            select: { slug: true, updatedAt: true, publishedAt: true },
            where: { publishedAt: { lte: now } },
            orderBy: { publishedAt: 'desc' },
        }),
        prisma.event.findMany({
            select: { slug: true, updatedAt: true },
            orderBy: { startDate: 'desc' },
        }),
        prisma.program.findMany({
            select: { slug: true, updatedAt: true },
        }),
        prisma.careerOpportunity.findMany({
            select: { slug: true, updatedAt: true },
            where: { status: { not: 'draft' } },
        }),
    ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [
        ...articles.map((a) => ({
            url: `${baseUrl}/articles/${a.slug}`,
            lastModified: a.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
        ...events.map((e) => ({
            url: `${baseUrl}/events/${e.slug}`,
            lastModified: e.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
        ...programs.map((p) => ({
            url: `${baseUrl}/programs/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.65,
        })),
        ...careers.map((c) => ({
            url: `${baseUrl}/careers/${c.slug}`,
            lastModified: c.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.75,
        })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
}
