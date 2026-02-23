/**
 * Generate a URL-safe slug from text.
 * Strips Unicode, special chars (¢ etc.), normalizes to lowercase with hyphens.
 */
export function slugify(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/gi, '')   // Keep only alphanumeric, space, hyphen
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '') || 'article';
}
