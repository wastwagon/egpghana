import nodemailer from 'nodemailer';

const RESEND_HOST = 'smtp.resend.com';
const DEFAULT_FROM = 'EGP Ghana <noreply@egpghana.org>';
const DEFAULT_NOTIFY = 'egpghana20@gmail.com';

function smtpHost() {
    return process.env.SMTP_HOST || (smtpPassword() ? RESEND_HOST : '');
}

function smtpPort() {
    return Number(process.env.SMTP_PORT || (smtpHost() === RESEND_HOST ? 465 : 587));
}

function smtpUser() {
    return process.env.SMTP_USER || (smtpHost() === RESEND_HOST ? 'resend' : '');
}

function smtpPassword() {
    return process.env.SMTP_PASSWORD || process.env.RESEND_API_KEY || '';
}

function smtpFrom() {
    return process.env.SMTP_FROM || DEFAULT_FROM;
}

export function careersNotifyEmail() {
    return process.env.CAREERS_NOTIFY_EMAIL || DEFAULT_NOTIFY;
}

export function isMailConfigured(): boolean {
    return Boolean(smtpHost() && smtpFrom() && smtpPassword());
}

function getTransporter() {
    const port = smtpPort();
    return nodemailer.createTransport({
        host: smtpHost(),
        port,
        secure: port === 465,
        auth: smtpUser()
            ? {
                  user: smtpUser(),
                  pass: smtpPassword(),
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
            from: smtpFrom(),
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
