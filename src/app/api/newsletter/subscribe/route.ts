import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendMail, isMailConfigured } from '@/lib/email';
import { normalizeEmail, unsubscribeUrl } from '@/lib/newsletter-token';
import { clientIp, consumeRateLimit } from '@/lib/rate-limit';

const bodySchema = z.object({
    email: z.string().email(),
    name: z.string().max(120).optional(),
});

export async function POST(req: NextRequest) {
    const ip = clientIp(req);
    const allowed = await consumeRateLimit(`newsletter:${ip}`, 10, 60 * 60);
    if (!allowed) {
        return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    try {
        const json = await req.json();
        const { email, name } = bodySchema.parse(json);
        const normalized = normalizeEmail(email);

        const existing = await prisma.newsletter.findUnique({ where: { email: normalized } });

        if (existing?.active) {
            return NextResponse.json({ ok: true, message: 'You are already subscribed.' });
        }

        await prisma.newsletter.upsert({
            where: { email: normalized },
            create: { email: normalized, name: name?.trim() || null, active: true },
            update: {
                name: name?.trim() || existing?.name,
                active: true,
                unsubscribedAt: null,
            },
        });

        if (isMailConfigured()) {
            const unsub = unsubscribeUrl(normalized);
            await sendMail({
                to: normalized,
                subject: 'Welcome to EGP Ghana updates',
                text: `Thank you for subscribing to the Economic Governance Platform Ghana newsletter. You will receive updates on events, publications, and economic data.\n\nUnsubscribe: ${unsub}\n\n— EGP Ghana`,
            });
        }

        return NextResponse.json({ ok: true, message: 'Thanks for subscribing!' });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
        }
        console.error('newsletter subscribe', err);
        return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
    }
}
