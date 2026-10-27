import type { Metadata } from 'next';

const SITE = 'https://egpghana.org';
const DEFAULT_OG = '/images/egp-icon-512.jpg';

export function siteBaseUrl() {
    const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
    return fromEnv || SITE;
}

/** Absolute URL for Open Graph / Twitter images (upload paths or external URLs). */
export function absoluteAssetUrl(path?: string | null) {
    const base = siteBaseUrl();
    if (!path?.trim()) {
        return `${base}${DEFAULT_OG}`;
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildPageMetadata({
    title,
    description,
    path,
    imageUrl,
    dynamicOgPath,
}: {
    title: string;
    description: string;
    path: string;
    imageUrl?: string | null;
    /** e.g. `/articles/my-slug/opengraph-image` when no upload is set */
    dynamicOgPath?: string;
}): Metadata {
    const image = imageUrl?.trim()
        ? absoluteAssetUrl(imageUrl)
        : dynamicOgPath
          ? `${siteBaseUrl()}${dynamicOgPath.startsWith('/') ? dynamicOgPath : `/${dynamicOgPath}`}`
          : absoluteAssetUrl(null);
    const canonical = path.startsWith('/') ? path : `/${path}`;
    const absolutePage = `${siteBaseUrl()}${canonical}`;

    return {
        title,
        description,
        alternates: {
            canonical,
            languages: {
                'en-GH': absolutePage,
                'x-default': absolutePage,
            },
        },
        openGraph: {
            title,
            description,
            url: absolutePage,
            siteName: 'EGP Ghana',
            locale: 'en_GH',
            type: 'article',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}
