/** Next.js cache tags for on-demand revalidation after data sync. */
export const CACHE_TAGS = {
    economicData: 'economic-data',
    homepage: 'homepage',
    publicContent: 'public-content',
} as const;

export const PUBLIC_DATA_REVALIDATE_SECONDS = 300;
