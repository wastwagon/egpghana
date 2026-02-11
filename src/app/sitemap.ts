import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://egpghana.org'

    // Base routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/dashboards',
        '/dashboards/economy',
        '/dashboards/imf',
        '/events',
        '/privacy',
        '/programs',
        '/resources',
        '/team',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return routes
}
