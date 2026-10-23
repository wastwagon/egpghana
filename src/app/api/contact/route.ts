import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { careersNotifyEmail, isMailConfigured, sendMail } from '@/lib/email';
import { clientIp, consumeRateLimit } from '@/lib/rate-limit';

const bodySchema = z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    subject: z.string().max(200).optional(),
    message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest) {
    const ip = clientIp(req);
    const allowed = await consumeRateLimit(`contact:${ip}`, 5, 60 * 60);
    if (!allowed) {
        return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
    }

    try {
        const json = await req.json();
        const { name, email, subject, message } = bodySchema.parse(json);

        await prisma.contact.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                subject: subject?.trim() || 'General inquiry',
                message: message.trim(),
            },
        });

        const notify = process.env.CONTACT_NOTIFY_EMAIL || careersNotifyEmail();
        if (isMailConfigured() && notify) {
            await sendMail({
                to: notify,
                replyTo: email,
                subject: `[EGP Contact] ${subject?.trim() || 'General inquiry'} — ${name}`,
                text: `From: ${name} <${email}>\n\n${message}`,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Please check your form fields.' }, { status: 400 });
        }
        console.error('contact POST', error);
        return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
    }
}
