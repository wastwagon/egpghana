/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    // Serve /uploads/* via API (ensures uploads work behind reverse proxies)
    async rewrites() {
        return [{ source: '/uploads/:path*', destination: '/api/uploads/:path*' }];
    },
    async headers() {
        return [
            {
                source: '/embed/:path*',
                headers: [
                    { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                ],
            },
            {
                source: '/((?!embed).*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'egpghana.org', pathname: '/**' },
            { protocol: 'http', hostname: 'localhost', pathname: '/**' },
        ],
        formats: ['image/webp', 'image/avif'],
    },
        experimental: {
        serverActions: {
            bodySizeLimit: '25mb',
        },
        serverComponentsExternalPackages: ['pdf-parse', 'nodemailer', 'jszip'],
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
