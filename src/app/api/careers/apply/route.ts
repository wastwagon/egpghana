import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getUploadsDir } from '@/lib/uploads';
import { careersNotifyEmail, sendMail } from '@/lib/email';
import { CareerAttachment, formatApplicationHtml, formatApplicationText } from '@/lib/career-application';
import { STRATEGIC_REVIEW_EMAIL_SUBJECT } from '@/lib/career-tor-content';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const ALLOWED_EXT = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
    if (typeof value !== 'string' || !value.trim()) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

function requiredString(form: FormData, key: string): string {
    const value = String(form.get(key) || '').trim();
    return value;
}

function extOf(name: string) {
    return path.extname(name).toLowerCase();
}

function sanitizeBase(name: string) {
    const base = name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');
    return base.slice(0, 80) || 'file';
}

async function saveUpload(file: File, field: string, applicationKey: string): Promise<{ attachment: CareerAttachment; buffer: Buffer }> {
    const ext = extOf(file.name);
    if (!ALLOWED_EXT.includes(ext)) {
        throw new Error(`Unsupported file type for ${file.name}. Use PDF or Word.`);
    }
    if (file.size > MAX_FILE_BYTES) {
        throw new Error(`${file.name} exceeds 10MB.`);
    }
    const mime = file.type || ALLOWED_MIME[0];
    const buffer = Buffer.from(await file.arrayBuffer());
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const relativeDir = path.join('careers', String(year), month, applicationKey);
    const targetDir = path.join(getUploadsDir(), relativeDir);
    await mkdir(targetDir, { recursive: true });
    const storedName = `${field}-${sanitizeBase(file.name)}-${Date.now()}${ext}`;
    const relativePath = path.join(relativeDir, storedName).replace(/\\/g, '/');
    await writeFile(path.join(targetDir, storedName), buffer);
    return {
        buffer,
        attachment: {
            field,
            originalName: file.name,
            storedName,
            relativePath,
            url: `/uploads/${relativePath}`,
            mime,
            size: file.size,
        },
    };
}

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const slug = requiredString(form, 'slug');
        if (!slug) {
            return NextResponse.json({ error: 'Missing opportunity.' }, { status: 400 });
        }

        const opportunity = await prisma.careerOpportunity.findUnique({ where: { slug } });
        if (!opportunity || opportunity.status !== 'open') {
            return NextResponse.json({ error: 'This opportunity is not open for applications.' }, { status: 400 });
        }

        const applicantName = requiredString(form, 'applicantName');
        const applicantType = requiredString(form, 'applicantType');
        const phone = requiredString(form, 'phone');
        const email = requiredString(form, 'email').toLowerCase();
        const profile = requiredString(form, 'profile');
        const relevantExperience = requiredString(form, 'relevantExperience');
        const methodology = requiredString(form, 'methodology');
        const teamQualifications = requiredString(form, 'teamQualifications');
        const totalFee = requiredString(form, 'totalFee');
        const contactName = requiredString(form, 'contactName');
        const declarationName = requiredString(form, 'declarationName');

        if (!applicantName || !applicantType || !phone || !email || !profile || !relevantExperience || !methodology || !teamQualifications || !totalFee || !contactName || !declarationName) {
            return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
        }

        const existing = await prisma.careerApplication.findUnique({
            where: { opportunityId_email: { opportunityId: opportunity.id, email } },
        });
        if (existing) {
            return NextResponse.json({ error: 'An application with this email has already been submitted for this opportunity.' }, { status: 409 });
        }

        const assignments = parseJsonField(form.get('assignments'), []);
        const references = parseJsonField(form.get('references'), []);
        const teamMembers = parseJsonField(form.get('teamMembers'), []);

        const applicationKey = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        const attachments: CareerAttachment[] = [];
        const mailFiles: { filename: string; content: Buffer; contentType?: string }[] = [];
        let totalBytes = 0;

        const requiredFiles = [
            ['profileDocument', 'company or individual profile'],
            ['financialProposal', 'financial proposal / invoice'],
        ] as const;
        for (const [field, label] of requiredFiles) {
            const file = form.get(field);
            if (!(file instanceof File) || file.size === 0) {
                return NextResponse.json({ error: `Please attach the ${label}.` }, { status: 400 });
            }
            totalBytes += file.size;
            const saved = await saveUpload(file, field, applicationKey);
            attachments.push(saved.attachment);
            mailFiles.push({
                filename: `${field}-${file.name}`,
                content: saved.buffer,
                contentType: saved.attachment.mime,
            });
        }

        const cvFiles = form.getAll('cvs').filter((item): item is File => item instanceof File && item.size > 0);
        if (cvFiles.length === 0) {
            return NextResponse.json({ error: 'Please attach at least one CV.' }, { status: 400 });
        }
        for (const file of cvFiles) {
            totalBytes += file.size;
            const saved = await saveUpload(file, 'cv', applicationKey);
            attachments.push(saved.attachment);
            mailFiles.push({
                filename: `cv-${file.name}`,
                content: saved.buffer,
                contentType: saved.attachment.mime,
            });
        }

        if (totalBytes > MAX_TOTAL_BYTES) {
            return NextResponse.json({ error: 'Combined attachments exceed 25MB.' }, { status: 400 });
        }

        const created = await prisma.careerApplication.create({
            data: {
                opportunityId: opportunity.id,
                applicantName,
                applicantType,
                location: requiredString(form, 'location') || null,
                phone,
                email,
                website: requiredString(form, 'website') || null,
                profile,
                relevantExperience,
                assignments,
                references,
                methodology,
                teamQualifications,
                teamMembers,
                totalFee,
                currency: requiredString(form, 'currency') || 'GHS',
                levelOfEffort: requiredString(form, 'levelOfEffort') || null,
                financialNotes: requiredString(form, 'financialNotes') || null,
                contactName,
                contactPosition: requiredString(form, 'contactPosition') || null,
                contactPhone: requiredString(form, 'contactPhone') || null,
                contactEmail: requiredString(form, 'contactEmail') || email,
                declarationName,
                declarationOrg: requiredString(form, 'declarationOrg') || applicantName,
                declarationSignature: requiredString(form, 'declarationSignature') || null,
                declarationDate: requiredString(form, 'declarationDate') || null,
                attachments,
            },
        });

        const notifyTo = Array.from(
            new Set(
                (process.env.CAREERS_NOTIFY_EMAIL || opportunity.notifyEmail || careersNotifyEmail())
                    .split(/[,;]/)
                    .map((value) => value.trim().toLowerCase())
                    .filter(Boolean)
            )
        );
        const text = formatApplicationText(created, opportunity);
        const subject = `${STRATEGIC_REVIEW_EMAIL_SUBJECT} — ${applicantName}`;
        const mailResult = await sendMail({
            to: notifyTo,
            replyTo: email,
            subject,
            text,
            html: formatApplicationHtml(created, opportunity),
            attachments: mailFiles,
        });
        if (!mailResult.sent) {
            console.error('EOI saved but email copy was not sent:', mailResult.error);
        }

        return NextResponse.json({
            success: true,
            id: created.id,
            emailSent: mailResult.sent,
        });
    } catch (err: any) {
        console.error('Career application error:', err);
        return NextResponse.json({ error: err?.message || 'Failed to submit application.' }, { status: 500 });
    }
}
