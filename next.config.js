/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'egpghana.org', pathname: '/**' },
            { protocol: 'http', hostname: 'localhost', pathname: '/**' },
        ],
        formats: ['image/webp', 'image/avif'],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    // Optimize for production
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    // Environment variables
    env: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3456',
    },
};

module.exports = nextConfig;
