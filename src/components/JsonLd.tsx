import { absoluteAssetUrl, siteBaseUrl } from '@/lib/seo';

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function WebSiteJsonLd() {
    const base = siteBaseUrl();
    return (
        <JsonLdScript
            data={{
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Economic Governance Platform Ghana',
                url: base,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${base}/search?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                },
            }}
        />
    );
}

export function OrganizationJsonLd() {
    const base = siteBaseUrl();
    return (
        <JsonLdScript
            data={{
        '@context': 'https://schema.org',
        '@type': 'NGO',
        name: 'Economic Governance Platform Ghana',
        alternateName: 'EGP Ghana',
        url: base,
        logo: absoluteAssetUrl('/images/EGPLOGO.jpg'),
        email: 'info@egpghana.org',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'C1173/12-Kotobabi Road, Pig Farm',
            addressLocality: 'Accra',
            addressCountry: 'GH',
        },
        sameAs: [
            'https://twitter.com/egpghana',
            'https://facebook.com/egpghana',
            'https://linkedin.com/company/egpghana',
        ],
            }}
        />
    );
}

export function ArticleJsonLd({
    title,
    description,
    slug,
    publishedAt,
    author,
    imageUrl,
}: {
    title: string;
    description: string;
    slug: string;
    publishedAt: Date;
    author?: string | null;
    imageUrl?: string | null;
}) {
    return (
        <JsonLdScript
            data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        datePublished: publishedAt.toISOString(),
        author: author ? { '@type': 'Person', name: author } : { '@type': 'Organization', name: 'EGP Ghana' },
        publisher: {
            '@type': 'Organization',
            name: 'Economic Governance Platform Ghana',
            logo: { '@type': 'ImageObject', url: absoluteAssetUrl('/images/EGPLOGO.jpg') },
        },
        mainEntityOfPage: `${siteBaseUrl()}/articles/${slug}`,
        image: imageUrl ? [absoluteAssetUrl(imageUrl)] : [absoluteAssetUrl(null)],
            }}
        />
    );
}

export function WebPageJsonLd({
    name,
    description,
    path,
}: {
    name: string;
    description: string;
    path: string;
}) {
    const base = siteBaseUrl();
    const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
    return (
        <JsonLdScript
            data={{
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name,
                description,
                url,
                isPartOf: { '@type': 'WebSite', name: 'Economic Governance Platform Ghana', url: base },
            }}
        />
    );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
    const base = siteBaseUrl();
    return (
        <JsonLdScript
            data={{
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: items.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    item: `${base}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
                })),
            }}
        />
    );
}

export function EventJsonLd({
    title,
    description,
    slug,
    startDate,
    endDate,
    location,
    imageUrl,
}: {
    title: string;
    description?: string | null;
    slug: string;
    startDate: Date;
    endDate?: Date | null;
    location?: string | null;
    imageUrl?: string | null;
}) {
    return (
        <JsonLdScript
            data={{
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: title,
        description: description || title,
        startDate: startDate.toISOString(),
        endDate: endDate?.toISOString(),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: location
            ? { '@type': 'Place', name: location, address: { '@type': 'PostalAddress', addressLocality: location } }
            : undefined,
        image: imageUrl ? [absoluteAssetUrl(imageUrl)] : undefined,
        url: `${siteBaseUrl()}/events/${slug}`,
            }}
        />
    );
}

export function JobPostingJsonLd({
    title,
    description,
    slug,
    deadline,
}: {
    title: string;
    description: string;
    slug: string;
    deadline?: Date | null;
}) {
    return (
        <JsonLdScript
            data={{
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title,
        description,
        hiringOrganization: {
            '@type': 'Organization',
            name: 'Economic Governance Platform Ghana',
            sameAs: siteBaseUrl(),
        },
        jobLocation: {
            '@type': 'Place',
            address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' },
        },
        datePosted: new Date().toISOString(),
        validThrough: deadline?.toISOString(),
        url: `${siteBaseUrl()}/careers/${slug}`,
            }}
        />
    );
}
