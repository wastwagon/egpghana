import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { normalizeEmail, verifyNewsletterUnsubscribeToken } from '@/lib/newsletter-token';
import { clientIp, consumeRateLimit } from '@/lib/rate-limit';

const postSchema = z.object({
    email: z.string().email(),
    token: z.string().min(16),
});

export async function POST(req: NextRequest) {
    const ip = clientIp(req);
    const allowed = await consumeRateLimit(`newsletter-unsub:${ip}`, 30, 60 * 60);
    if (!allowed) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    try {
        const body = postSchema.parse(await req.json());
        const email = normalizeEmail(body.email);
        if (!verifyNewsletterUnsubscribeToken(email, body.token)) {
            return NextResponse.json({ error: 'Invalid or expired unsubscribe link.' }, { status: 400 });
        }

        await prisma.newsletter.updateMany({
            where: { email },
            data: { active: false, unsubscribedAt: new Date() },
        });

        return NextResponse.json({ ok: true, message: 'You have been unsubscribed.' });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
        }
        console.error('newsletter unsubscribe', err);
        return NextResponse.json({ error: 'Unsubscribe failed.' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get('email');
    const token = req.nextUrl.searchParams.get('token');
    if (!email || !token) {
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 400 });
    }
    const normalized = normalizeEmail(email);
    if (!verifyNewsletterUnsubscribeToken(normalized, token)) {
        return NextResponse.json({ error: 'Invalid link.' }, { status: 400 });
    }

    await prisma.newsletter.updateMany({
        where: { email: normalized },
        data: { active: false, unsubscribedAt: new Date() },
    });

    return NextResponse.json({ ok: true, message: 'Unsubscribed.' });
}
