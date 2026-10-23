import { revalidatePath, revalidateTag } from 'next/cache';
import { invalidateRagCache } from '@/lib/ai';
import { CACHE_TAGS } from '@/lib/cache-tags';

const PUBLIC_LIST_PATHS = [
    '/',
    '/articles',
    '/resources',
    '/events',
    '/careers',
    '/team',
    '/programs',
    '/search',
    '/about',
    '/dashboards',
    '/feed.xml',
    '/sitemap.xml',
];

export type ContentRevalidateOptions = {
    articleSlug?: string;
    eventSlug?: string;
    careerSlug?: string;
};

/** Revalidate ISR pages, RSS/sitemap, and RAG cache after CMS changes. */
export async function onPublicContentChanged(options: ContentRevalidateOptions = {}) {
    for (const path of PUBLIC_LIST_PATHS) {
        revalidatePath(path);
    }

    revalidateTag(CACHE_TAGS.homepage);
    revalidateTag(CACHE_TAGS.publicContent);

    if (options.articleSlug) {
        revalidatePath(`/articles/${options.articleSlug}`);
    }
    if (options.eventSlug) {
        revalidatePath(`/events/${options.eventSlug}`);
    }
    if (options.careerSlug) {
        revalidatePath(`/careers/${options.careerSlug}`);
    }

    await invalidateRagCache();
}
