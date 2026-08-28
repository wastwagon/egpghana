import nodemailer from 'nodemailer';

export function isMailConfigured(): boolean {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

function getTransporter() {
    const port = Number(process.env.SMTP_PORT || 587);
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: process.env.SMTP_USER
            ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASSWORD,
              }
            : undefined,
    });
}

export async function sendMail(options: {
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
    attachments?: { filename: string; content: Buffer; contentType?: string }[];
    replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
    if (!isMailConfigured()) {
        console.warn('SMTP is not configured. Skipping email send.');
        return { sent: false, error: 'SMTP is not configured' };
    }

    try {
        const transporter = getTransporter();
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html || options.text.replace(/\n/g, '<br/>'),
            replyTo: options.replyTo,
            attachments: options.attachments,
        });
        return { sent: true };
    } catch (err: any) {
        console.error('Email send failed:', err);
        return { sent: false, error: err?.message || 'Email send failed' };
    }
}
