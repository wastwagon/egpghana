import crypto from 'crypto';

function secret() {
    return process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || process.env.NEXTAUTH_SECRET || 'egp-newsletter-dev-only';
}

export function normalizeEmail(email: string) {
    return email.toLowerCase().trim();
}

export function newsletterUnsubscribeToken(email: string) {
    return crypto.createHmac('sha256', secret()).update(normalizeEmail(email)).digest('hex').slice(0, 32);
}

export function verifyNewsletterUnsubscribeToken(email: string, token: string) {
    if (!email || !token) return false;
    const expected = newsletterUnsubscribeToken(email);
    try {
        return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
    } catch {
        return false;
    }
}

export function unsubscribeUrl(email: string) {
    const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://egpghana.org').replace(/\/$/, '');
    const e = encodeURIComponent(normalizeEmail(email));
    const t = newsletterUnsubscribeToken(email);
    return `${base}/newsletter/unsubscribe?email=${e}&token=${t}`;
}
