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

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function row(label: string, value?: string | null) {
    return `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;width:220px;color:#475569;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(value || '—')}</td></tr>`;
}

function paragraph(text: string) {
    return `<p style="white-space:pre-wrap;margin:0 0 12px">${escapeHtml(text || '—')}</p>`;
}

function tableHtml(headers: string[], rows: string[][]) {
    const head = headers.map((h) => `<th style="text-align:left;padding:6px 8px;border:1px solid #e2e8f0;background:#f8fafc">${escapeHtml(h)}</th>`).join('');
    const body = rows
        .map(
            (cells) =>
                `<tr>${cells.map((c) => `<td style="padding:6px 8px;border:1px solid #e2e8f0">${escapeHtml(c || '—')}</td>`).join('')}</tr>`
        )
        .join('');
    return `<table style="border-collapse:collapse;width:100%;margin:8px 0 16px;font-size:14px"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

export function formatApplicationHtml(
    app: CareerApplication,
    opportunity?: Pick<CareerOpportunity, 'title' | 'slug'> | null
): string {
    const assignments = asArray<AssignmentRow>(app.assignments);
    const references = asArray<ReferenceRow>(app.references);
    const team = asArray<TeamMemberRow>(app.teamMembers);
    const files = asArray<CareerAttachment>(app.attachments);

    return `<div style="font-family:Georgia,serif;color:#0f172a;line-height:1.5;max-width:760px">
<p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#1d4ed8;margin:0 0 6px">EGP Ghana</p>
<h1 style="font-size:22px;margin:0 0 16px">Expression of Interest: Strategic Organisational Review</h1>
<p>A copy of an online EOI submission${opportunity ? ` for <strong>${escapeHtml(opportunity.title)}</strong>` : ''}.</p>
<table style="border-collapse:collapse;width:100%;margin:0 0 20px;font-size:14px">
${row('Application ID', app.id)}
${row('Submitted', app.createdAt.toISOString())}
${row('Applicant', `${app.applicantName} (${app.email})`)}
</table>
<h2 style="font-size:16px">1. Applicant details</h2>
<table style="border-collapse:collapse;width:100%;margin:0 0 20px;font-size:14px">
${row('Name of Consultant / Firm', app.applicantName)}
${row('Type', app.applicantType)}
${row('Location', app.location)}
${row('Contact (Phone)', app.phone)}
${row('Email', app.email)}
${row('Website', app.website)}
</table>
<h2 style="font-size:16px">2. Profile and areas of expertise</h2>
${paragraph(app.profile)}
<h2 style="font-size:16px">3. Relevant experience and track record</h2>
${paragraph(app.relevantExperience)}
<p><strong>Comparable assignments</strong></p>
${tableHtml(
    ['Assignment / Review', 'Client / Organisation', 'Year', 'Brief Description of Role'],
    assignments.map((r) => [r.assignment || '', r.client || '', r.year || '', r.role || ''])
)}
<p><strong>References</strong></p>
${tableHtml(
    ['Referee Name', 'Organisation', 'Position', 'Contact / Email'],
    references.map((r) => [r.name || '', r.organisation || '', r.position || '', r.contact || ''])
)}
<h2 style="font-size:16px">4. Technical approach and methodology</h2>
${paragraph(app.methodology)}
<h2 style="font-size:16px">5. Team qualifications and expertise</h2>
${paragraph(app.teamQualifications)}
${tableHtml(
    ['Name', 'Role in the Assignment', 'Highest Qualification', 'Years of Relevant Experience'],
    team.map((r) => [r.name || '', r.role || '', r.qualification || '', r.years || ''])
)}
<h2 style="font-size:16px">6. Financial proposal</h2>
<table style="border-collapse:collapse;width:100%;margin:0 0 20px;font-size:14px">
${row('Total Proposed Fee', `${app.totalFee} ${app.currency || ''}`.trim())}
${row('Number of Working Days / Level of Effort', app.levelOfEffort)}
</table>
${app.financialNotes ? paragraph(app.financialNotes) : ''}
<h2 style="font-size:16px">7. Contact person</h2>
<table style="border-collapse:collapse;width:100%;margin:0 0 20px;font-size:14px">
${row('Name', app.contactName)}
${row('Position', app.contactPosition)}
${row('Contact (Phone)', app.contactPhone)}
${row('Email', app.contactEmail)}
</table>
<h2 style="font-size:16px">Declaration</h2>
<p>I ${escapeHtml(app.declarationName)}, the representative of ${escapeHtml(app.declarationOrg || app.applicantName)} hereby confirm that the information provided above is accurate.</p>
<table style="border-collapse:collapse;width:100%;margin:0 0 20px;font-size:14px">
${row('Signature', app.declarationSignature || app.declarationName)}
${row('Date', app.declarationDate)}
</table>
<p><strong>Attachments</strong> (also attached to this email):</p>
<ul>${files.map((f) => `<li>${escapeHtml(f.field)}: ${escapeHtml(f.originalName)}</li>`).join('')}</ul>
<p style="color:#64748b;font-size:13px">The original files are also stored in EGP Admin → Careers → Applications.</p>
</div>`;
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
