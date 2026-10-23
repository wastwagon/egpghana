import fs from 'fs';
import path from 'path';

/** Matches `src/lib/career-tor-content.ts` — duplicated so e2e stays outside the app TS project. */
export const STRATEGIC_REVIEW_SLUG = 'strategic-organisational-review';

export function e2eApplicantEmail() {
    return `e2e-${Date.now()}-${Math.round(Math.random() * 1e6)}@egp-test.local`;
}

export function minimalPdfBuffer() {
    return fs.readFileSync(path.join(process.cwd(), 'e2e/fixtures/minimal.pdf'));
}

export function buildCareersApplyMultipart(email: string) {
    const pdf = minimalPdfBuffer();
    return {
        slug: STRATEGIC_REVIEW_SLUG,
        applicantName: 'E2E Test Consultant Ltd',
        applicantType: 'Firm',
        location: 'Accra, Ghana',
        phone: '+233200000000',
        email,
        website: 'https://example.com',
        profile: 'E2E automated test profile summary for CI validation only.',
        relevantExperience: 'Ten years of governance and public finance advisory work across West Africa.',
        methodology: 'Mixed methods review combining document analysis and stakeholder interviews.',
        teamQualifications: 'Lead reviewer holds a masters in economics; team includes PFM specialists.',
        totalFee: '50000',
        currency: 'GHS',
        levelOfEffort: '30 person-days',
        financialNotes: 'Inclusive of local travel.',
        contactName: 'E2E Contact',
        contactPosition: 'Director',
        contactPhone: '+233200000001',
        contactEmail: email,
        declarationName: 'E2E Signatory',
        declarationOrg: 'E2E Test Consultant Ltd',
        declarationSignature: 'E2E Signatory',
        declarationDate: new Date().toISOString().slice(0, 10),
        assignments: JSON.stringify([
            { assignment: 'PFM review', client: 'CSO', year: '2024', role: 'Lead' },
        ]),
        references: JSON.stringify([
            { name: 'Ref One', organisation: 'Partner NGO', position: 'Director', contact: 'ref@example.com' },
        ]),
        teamMembers: JSON.stringify([
            { name: 'Analyst One', role: 'Economist', qualification: 'MSc', years: '8' },
        ]),
        profileDocument: {
            name: 'profile.pdf',
            mimeType: 'application/pdf',
            buffer: pdf,
        },
        financialProposal: {
            name: 'proposal.pdf',
            mimeType: 'application/pdf',
            buffer: pdf,
        },
        cvs: {
            name: 'cv.pdf',
            mimeType: 'application/pdf',
            buffer: pdf,
        },
    };
}
