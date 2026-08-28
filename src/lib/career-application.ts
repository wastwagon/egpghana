import { CareerApplication, CareerOpportunity } from '@prisma/client';
import { readFile } from 'fs/promises';
import path from 'path';
import JSZip from 'jszip';
import { getUploadsDir } from '@/lib/uploads';

export type CareerAttachment = {
    field: string;
    originalName: string;
    storedName: string;
    relativePath: string;
    url: string;
    mime: string;
    size: number;
};

export type AssignmentRow = {
    assignment?: string;
    client?: string;
    year?: string;
    role?: string;
};

export type ReferenceRow = {
    name?: string;
    organisation?: string;
    position?: string;
    contact?: string;
};

export type TeamMemberRow = {
    name?: string;
    role?: string;
    qualification?: string;
    years?: string;
};

function asArray<T>(value: unknown): T[] {
    return Array.isArray(value) ? (value as T[]) : [];
}

export function formatApplicationText(
    app: CareerApplication,
    opportunity?: Pick<CareerOpportunity, 'title' | 'slug'> | null
): string {
    const assignments = asArray<AssignmentRow>(app.assignments);
    const references = asArray<ReferenceRow>(app.references);
    const team = asArray<TeamMemberRow>(app.teamMembers);
    const files = asArray<CareerAttachment>(app.attachments);

    const lines = [
        'EXPRESSION OF INTEREST: STRATEGIC ORGANISATIONAL REVIEW',
        opportunity ? `Opportunity: ${opportunity.title}` : '',
        `Application ID: ${app.id}`,
        `Submitted: ${app.createdAt.toISOString()}`,
        `Status: ${app.status}`,
        '',
        '1. APPLICANT DETAILS',
        `Name of Consultant / Firm: ${app.applicantName}`,
        `Type: ${app.applicantType}`,
        `Location: ${app.location || ''}`,
        `Phone: ${app.phone}`,
        `Email: ${app.email}`,
        `Website: ${app.website || ''}`,
        '',
        '2. PROFILE AND AREAS OF EXPERTISE',
        app.profile,
        '',
        '3. RELEVANT EXPERIENCE AND TRACK RECORD',
        app.relevantExperience,
        '',
        'Comparable assignments:',
        ...assignments.map(
            (row, i) =>
                `  ${i + 1}. ${row.assignment || ''} | ${row.client || ''} | ${row.year || ''} | ${row.role || ''}`
        ),
        '',
        'References:',
        ...references.map(
            (row, i) =>
                `  ${i + 1}. ${row.name || ''} | ${row.organisation || ''} | ${row.position || ''} | ${row.contact || ''}`
        ),
        '',
        '4. TECHNICAL APPROACH AND METHODOLOGY',
        app.methodology,
        '',
        '5. TEAM QUALIFICATIONS AND EXPERTISE',
        app.teamQualifications,
        '',
        'Key team members:',
        ...team.map(
            (row, i) =>
                `  ${i + 1}. ${row.name || ''} | ${row.role || ''} | ${row.qualification || ''} | ${row.years || ''} years`
        ),
        '',
        '6. FINANCIAL PROPOSAL',
        `Total proposed fee: ${app.totalFee} ${app.currency || ''}`.trim(),
        `Level of effort: ${app.levelOfEffort || ''}`,
        app.financialNotes || '',
        '',
        '7. CONTACT PERSON',
        `Name: ${app.contactName}`,
        `Position: ${app.contactPosition || ''}`,
        `Phone: ${app.contactPhone || ''}`,
        `Email: ${app.contactEmail || ''}`,
        '',
        'DECLARATION',
        `I ${app.declarationName}, the representative of ${app.declarationOrg || app.applicantName}, confirm that the information provided is accurate.`,
        `Signature: ${app.declarationSignature || app.declarationName}`,
        `Date: ${app.declarationDate || ''}`,
        '',
        'ATTACHMENTS',
        ...files.map((f) => `  - ${f.field}: ${f.originalName} (${f.mime}, ${f.size} bytes)`),
    ];

    return lines.filter((line) => line !== undefined).join('\n');
}

export async function zipApplicationPackage(
    app: CareerApplication,
    opportunity?: Pick<CareerOpportunity, 'title' | 'slug'> | null
): Promise<Buffer> {
    const zip = new JSZip();
    const folderName = sanitizeFolder(`${app.applicantName}-${app.id.slice(0, 8)}`);
    const folder = zip.folder(folderName)!;
    folder.file('application.txt', formatApplicationText(app, opportunity));
    folder.file('application.json', JSON.stringify(app, null, 2));

    const files = asArray<CareerAttachment>(app.attachments);
    const uploadsDir = path.resolve(getUploadsDir());
    for (const file of files) {
        try {
            const full = path.resolve(uploadsDir, file.relativePath);
            if (!full.startsWith(uploadsDir + path.sep)) continue;
            const buf = await readFile(full);
            folder.file(`attachments/${file.field}-${file.originalName}`, buf);
        } catch {
            folder.file(`attachments/MISSING-${file.originalName}.txt`, `File not found: ${file.relativePath}`);
        }
    }

    return Buffer.from(await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}

export async function zipAllApplications(
    items: { app: CareerApplication; opportunity?: Pick<CareerOpportunity, 'title' | 'slug'> | null }[]
): Promise<Buffer> {
    const zip = new JSZip();
    for (const item of items) {
        const inner = await zipApplicationPackage(item.app, item.opportunity);
        const name = sanitizeFolder(`${item.app.applicantName}-${item.app.id.slice(0, 8)}.zip`);
        zip.file(name, inner);
    }
    zip.file('index.txt', items.map((i) => `${i.app.createdAt.toISOString()} | ${i.app.applicantName} | ${i.app.email} | ${i.app.status}`).join('\n'));
    return Buffer.from(await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}

export function sanitizeFolder(value: string): string {
    return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').slice(0, 80) || 'application';
}
