import { prisma } from '@/lib/prisma';

const SITE = 'https://egpghana.org';

function escapeXml(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export async function GET() {
    const [articles, events] = await Promise.all([
        prisma.article.findMany({
            where: { publishedAt: { lte: new Date() } },
            orderBy: { publishedAt: 'desc' },
            take: 40,
            select: { title: true, slug: true, excerpt: true, publishedAt: true },
        }),
        prisma.event.findMany({
            orderBy: { startDate: 'desc' },
            take: 20,
            select: { title: true, slug: true, description: true, startDate: true },
        }),
    ]);

    const items = [
        ...articles.map((a) => ({
            title: a.title,
            link: `${SITE}/articles/${a.slug}`,
            pubDate: a.publishedAt,
            description: a.excerpt || a.title,
        })),
        ...events.map((e) => ({
            title: e.title,
            link: `${SITE}/events/${e.slug}`,
            pubDate: e.startDate,
            description: e.description || e.title,
        })),
    ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>EGP Ghana — Updates</title>
    <link>${SITE}</link>
    <description>Publications and events from the Economic Governance Platform Ghana</description>
    <language>en-gh</language>
    ${items
        .map(
            (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
        )
        .join('')}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
    });
}
