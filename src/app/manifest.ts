import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Economic Governance Platform Ghana',
        short_name: 'EGP Ghana',
        description: 'Economic governance data, dashboards, and publications for Ghana.',
        start_url: '/',
        display: 'browser',
        background_color: '#00467e',
        theme_color: '#00467e',
        lang: 'en-GH',
        icons: [
            {
                src: '/images/egp-mark.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any',
            },
            {
                src: '/images/egp-icon-512.jpg',
                sizes: '512x512',
                type: 'image/jpeg',
                purpose: 'any',
            },
        ],
    };
}
