import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { invalidateEconomicDataCache } from '@/lib/cached-economic-data';
import { evaluateIndicatorAlerts } from '@/lib/indicator-alerts';

/** Call after economic indicators are updated (data sync, admin edits). */
export function revalidatePublicData() {
    revalidateTag(CACHE_TAGS.economicData);
    revalidateTag(CACHE_TAGS.homepage);

    const paths = [
        '/',
        '/dashboards',
        '/dashboards/economy',
        '/dashboards/debt',
        '/dashboards/imf',
    ];

    for (const path of paths) {
        revalidatePath(path);
    }
}

/** ISR revalidation plus Redis cache bust and optional threshold alert emails. */
export async function onEconomicDataChanged() {
    revalidatePublicData();
    await invalidateEconomicDataCache();
    await evaluateIndicatorAlerts();
}
