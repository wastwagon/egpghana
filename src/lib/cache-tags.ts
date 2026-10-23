/** Next.js cache tags for on-demand revalidation after data sync. */
export const CACHE_TAGS = {
    economicData: 'economic-data',
    homepage: 'homepage',
    publicContent: 'public-content',
} as const;

export const PUBLIC_DATA_REVALIDATE_SECONDS = 300;

const prerenderUsesDatabase = Boolean(process.env.DATABASE_URL?.trim());

/** ISR at build when DATABASE_URL is set (CI, compose). Otherwise render on first request (Coolify runtime-only env). */
export const publicPageRevalidate = prerenderUsesDatabase
    ? PUBLIC_DATA_REVALIDATE_SECONDS
    : false;

export const publicPageDynamic: 'auto' | 'force-dynamic' = prerenderUsesDatabase
    ? 'auto'
    : 'force-dynamic';
