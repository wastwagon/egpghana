'use client';

import { FormEvent, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Plus, Trash2, Upload } from 'lucide-react';
import {
    STRATEGIC_REVIEW_EOI_ATTACHMENTS,
    STRATEGIC_REVIEW_EOI_BACKGROUND,
} from '@/lib/career-tor-content';

type Row = Record<string, string>;

const emptyAssignment = (): Row => ({ assignment: '', client: '', year: '', role: '' });
const emptyReference = (): Row => ({ name: '', organisation: '', position: '', contact: '' });
const emptyMember = (): Row => ({ name: '', role: '', qualification: '', years: '' });

function wordCount(text: string) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function WordHint({ text, max }: { text: string; max: number }) {
    const count = wordCount(text);
    const over = count > max;
    return (
        <p className={`mt-1 text-right text-xs tabular-nums ${over ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
            {count} / {max} words
        </p>
    );
}

function Line({
    label,
    required,
    className,
    children,
}: {
    label: string;
    required?: boolean;
    className?: string;
    children: ReactNode;
}) {
    return (
        <label className={`flex items-baseline gap-3 min-w-0 ${className || ''}`}>
            <span className="shrink-0 text-sm text-slate-700 w-[9.5rem] sm:w-44">
                {label}
                {required && <span className="text-red-600"> *</span>}
            </span>
            <span className="flex-1 min-w-0">{children}</span>
        </label>
    );
}

function FileLine({
    name,
    label,
    required,
    multiple,
}: {
    name: string;
    label: string;
    required?: boolean;
    multiple?: boolean;
}) {
    const [names, setNames] = useState<string[]>([]);
    return (
        <label className="relative flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2 border-b border-slate-100 last:border-0 cursor-pointer">
            <span className="shrink-0 text-sm text-slate-700 sm:w-72 lg:max-w-xs">
                {label}
                {required && <span className="text-red-600"> *</span>}
            </span>
            <span className="flex-1 flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-800 bg-primary-50 border border-primary-100 rounded px-2 py-1">
                    <Upload className="w-3.5 h-3.5" />
                    {names.length ? `${names.length} selected` : 'Choose file'}
                </span>
                {names.length > 0 && (
                    <span className="text-xs text-slate-600 truncate">{names.join(', ')}</span>
                )}
            </span>
            <input
                name={name}
                type="file"
                required={required}
                multiple={multiple}
                accept=".pdf,.doc,.docx,application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setNames(Array.from(e.target.files || []).map((f) => f.name))}
            />
        </label>
    );
}

const inputClass =
    'w-full bg-transparent border-0 border-b border-slate-300 rounded-none px-0 py-1.5 text-[15px] text-slate-900 focus:border-primary-600 focus:ring-0 placeholder:text-slate-400';
const cellInput =
    'w-full bg-white border-0 px-2 py-1.5 text-sm text-slate-900 focus:ring-1 focus:ring-primary-400 focus:outline-none placeholder:text-slate-400';
const areaClass =
    'w-full bg-white border border-slate-200 rounded px-3 py-2 text-[15px] text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 placeholder:text-slate-400 resize-y';

function TableHead({ cols }: { cols: string[] }) {
    return (
        <thead>
            <tr className="bg-slate-50">
                {cols.map((col) => (
                    <th key={col} className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600 px-2 py-2 border border-slate-200">
                        {col}
                    </th>
                ))}
                <th className="w-8 border border-slate-200 bg-slate-50" />
            </tr>
        </thead>
    );
}

export default function EoiForm({ slug, closed }: { slug: string; closed?: boolean }) {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [assignments, setAssignments] = useState<Row[]>([emptyAssignment(), emptyAssignment(), emptyAssignment()]);
    const [references, setReferences] = useState<Row[]>([emptyReference(), emptyReference()]);
    const [teamMembers, setTeamMembers] = useState<Row[]>([emptyMember(), emptyMember(), emptyMember()]);
    const [profile, setProfile] = useState('');
    const [experience, setExperience] = useState('');
    const [methodology, setMethodology] = useState('');
    const [teamQualifications, setTeamQualifications] = useState('');

    const canSubmit = useMemo(() => !closed && !submitting, [closed, submitting]);

    const updateRow = (rows: Row[], setRows: (rows: Row[]) => void, index: number, key: string, value: string) => {
        const next = [...rows];
        next[index] = { ...next[index], [key]: value };
        setRows(next);
    };

    const removeRow = (rows: Row[], setRows: (rows: Row[]) => void, index: number, min: number) => {
        if (rows.length <= min) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const form = event.currentTarget;
            const data = new FormData(form);
            data.set('slug', slug);
            data.set('assignments', JSON.stringify(assignments));
            data.set('references', JSON.stringify(references));
            data.set('teamMembers', JSON.stringify(teamMembers));

            const res = await fetch('/api/careers/apply', { method: 'POST', body: data });
            const json = (await res.json().catch(() => ({}))) as { error?: string };
            if (res.status === 429) {
                throw new Error(json.error || 'Too many submissions from this network. Please try again later.');
            }
            if (!res.ok) throw new Error(json.error || 'Submission failed');
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setError(err.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center" data-testid="eoi-success">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-2">Expression of Interest received</h3>
                <p className="text-slate-600 max-w-xl mx-auto text-sm">
                    Thank you. Your submission has been stored with EGP. Only shortlisted applicants will be contacted.
                </p>
            </div>
        );
    }

    if (closed) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-950 text-sm">
                This opportunity is no longer accepting submissions.
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-lg p-5 md:p-8 shadow-sm" encType="multipart/form-data">
            <header className="border-b border-slate-200 pb-4 mb-6">
                <p className="section-label text-primary-700">EGP Ghana</p>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-slate-900 mt-1">
                    Expression of Interest: Strategic Organisational Review
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {STRATEGIC_REVIEW_EOI_BACKGROUND}
                </p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {STRATEGIC_REVIEW_EOI_ATTACHMENTS}
                </p>
            </header>

            {error && (
                <div className="mb-5 rounded border border-red-200 bg-red-50 text-red-800 px-3 py-2 text-sm">
                    {error}
                </div>
            )}

            <section className="mb-5">
                <h4 className="text-sm font-bold tracking-wide text-slate-900 mb-3">1. Applicant details</h4>
                <div className="space-y-3">
                    <Line label="Name of Consultant / Firm" required>
                        <input name="applicantName" required className={inputClass} />
                    </Line>
                    <Line label="Type" required>
                        <select name="applicantType" required defaultValue="" className={`${inputClass} bg-white`}>
                            <option value="" disabled>Select…</option>
                            <option value="Individual">Individual</option>
                            <option value="Firm">Firm</option>
                            <option value="Review Team">Review Team</option>
                        </select>
                    </Line>
                    <Line label="Location">
                        <input name="location" className={inputClass} placeholder="City, country" />
                    </Line>
                    <div className="grid md:grid-cols-2 gap-3">
                        <Line label="Contact (Phone)" required>
                            <input name="phone" type="tel" required className={inputClass} />
                        </Line>
                        <Line label="Email" required className="md:[&>span:first-child]:w-20">
                            <input name="email" type="email" required className={inputClass} />
                        </Line>
                    </div>
                    <Line label="Website (if any)">
                        <input name="website" type="url" className={inputClass} placeholder="https://" />
                    </Line>
                </div>
            </section>

            <section className="mb-5">
                <h4 className="text-sm font-bold tracking-wide text-slate-900">2. Profile and areas of expertise</h4>
                <p className="text-xs text-slate-500 mb-2">Provide a brief description of the consultant / firm and your key areas of expertise. Maximum 100 words.</p>
                <textarea name="profile" required rows={3} value={profile} onChange={(e) => setProfile(e.target.value)} className={areaClass} />
                <WordHint text={profile} max={100} />
            </section>

            <section className="mb-5">
                <h4 className="text-sm font-bold tracking-wide text-slate-900">3. Relevant experience and track record</h4>
                <p className="text-xs text-slate-500 mb-2">Describe your experience conducting organisational or strategic reviews of civil society platforms, networks or policy institutions. Maximum 300 words.</p>
                <textarea name="relevantExperience" required rows={4} value={experience} onChange={(e) => setExperience(e.target.value)} className={areaClass} />
                <WordHint text={experience} max={300} />

                <div className="flex items-center justify-between mt-4 mb-1">
                    <p className="text-sm font-medium text-slate-800">List at least three (3) comparable assignments completed.</p>
                    <button type="button" onClick={() => setAssignments([...assignments, emptyAssignment()])} className="text-xs font-semibold text-primary-700 inline-flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Row
                    </button>
                </div>
                <div className="overflow-x-auto border border-slate-200">
                    <table className="w-full min-w-[640px] border-collapse">
                        <TableHead cols={['Assignment / Review', 'Client / Organisation', 'Year', 'Brief Description of Role']} />
                        <tbody>
                            {assignments.map((row, i) => (
                                <tr key={i}>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.assignment} onChange={(e) => updateRow(assignments, setAssignments, i, 'assignment', e.target.value)} /></td>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.client} onChange={(e) => updateRow(assignments, setAssignments, i, 'client', e.target.value)} /></td>
                                    <td className="border border-slate-200 p-0 w-24"><input className={cellInput} inputMode="numeric" value={row.year} onChange={(e) => updateRow(assignments, setAssignments, i, 'year', e.target.value)} /></td>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.role} onChange={(e) => updateRow(assignments, setAssignments, i, 'role', e.target.value)} /></td>
                                    <td className="border border-slate-200 text-center w-8">
                                        {assignments.length > 3 && (
                                            <button type="button" onClick={() => removeRow(assignments, setAssignments, i, 3)} className="text-slate-400 hover:text-red-600 p-1" aria-label="Remove row">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-4 mb-1">
                    <p className="text-sm font-medium text-slate-800">Provide at least two (2) references from comparable assignments.</p>
                    <button type="button" onClick={() => setReferences([...references, emptyReference()])} className="text-xs font-semibold text-primary-700 inline-flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Row
                    </button>
                </div>
                <div className="overflow-x-auto border border-slate-200">
                    <table className="w-full min-w-[640px] border-collapse">
                        <TableHead cols={['Referee Name', 'Organisation', 'Position', 'Contact / Email']} />
                        <tbody>
                            {references.map((row, i) => (
                                <tr key={i}>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.name} onChange={(e) => updateRow(references, setReferences, i, 'name', e.target.value)} /></td>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.organisation} onChange={(e) => updateRow(references, setReferences, i, 'organisation', e.target.value)} /></td>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.position} onChange={(e) => updateRow(references, setReferences, i, 'position', e.target.value)} /></td>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.contact} onChange={(e) => updateRow(references, setReferences, i, 'contact', e.target.value)} /></td>
                                    <td className="border border-slate-200 text-center w-8">
                                        {references.length > 2 && (
                                            <button type="button" onClick={() => removeRow(references, setReferences, i, 2)} className="text-slate-400 hover:text-red-600 p-1" aria-label="Remove row">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-5">
                <h4 className="text-sm font-bold tracking-wide text-slate-900">4. Technical approach and methodology</h4>
                <p className="text-xs text-slate-500 mb-2">Briefly outline your understanding of the assignment and your proposed methodology, analytical framework and workplan for the review. Maximum 400 words.</p>
                <textarea name="methodology" required rows={4} value={methodology} onChange={(e) => setMethodology(e.target.value)} className={areaClass} />
                <WordHint text={methodology} max={400} />
            </section>

            <section className="mb-5">
                <h4 className="text-sm font-bold tracking-wide text-slate-900">5. Team qualifications and expertise</h4>
                <p className="text-xs text-slate-500 mb-2">Describe the qualifications and experience of the reviewer or key team members in governance analysis, institutional development, and economic governance, public financial management or fiscal policy, including familiarity with the Ghanaian policy and civil society context. Maximum 300 words.</p>
                <textarea name="teamQualifications" required rows={4} value={teamQualifications} onChange={(e) => setTeamQualifications(e.target.value)} className={areaClass} />
                <WordHint text={teamQualifications} max={300} />

                <div className="flex items-center justify-between mt-4 mb-1">
                    <p className="text-sm font-medium text-slate-800">Key team members (attach CVs).</p>
                    <button type="button" onClick={() => setTeamMembers([...teamMembers, emptyMember()])} className="text-xs font-semibold text-primary-700 inline-flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Row
                    </button>
                </div>
                <div className="overflow-x-auto border border-slate-200">
                    <table className="w-full min-w-[640px] border-collapse">
                        <TableHead cols={['Name', 'Role in the Assignment', 'Highest Qualification', 'Years of Relevant Experience']} />
                        <tbody>
                            {teamMembers.map((row, i) => (
                                <tr key={i}>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.name} onChange={(e) => updateRow(teamMembers, setTeamMembers, i, 'name', e.target.value)} /></td>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.role} onChange={(e) => updateRow(teamMembers, setTeamMembers, i, 'role', e.target.value)} /></td>
                                    <td className="border border-slate-200 p-0"><input className={cellInput} value={row.qualification} onChange={(e) => updateRow(teamMembers, setTeamMembers, i, 'qualification', e.target.value)} /></td>
                                    <td className="border border-slate-200 p-0 w-36"><input className={cellInput} inputMode="numeric" value={row.years} onChange={(e) => updateRow(teamMembers, setTeamMembers, i, 'years', e.target.value)} /></td>
                                    <td className="border border-slate-200 text-center w-8">
                                        {teamMembers.length > 1 && (
                                            <button type="button" onClick={() => removeRow(teamMembers, setTeamMembers, i, 1)} className="text-slate-400 hover:text-red-600 p-1" aria-label="Remove row">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-5">
                <h4 className="text-sm font-bold tracking-wide text-slate-900">6. Financial proposal</h4>
                <p className="text-xs text-slate-500 mb-3">Provide an all-inclusive financial proposal covering professional fees and any reimbursable costs. State the total amount and currency. A detailed breakdown may be attached or provided below.</p>
                <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                        <Line label="Total Proposed Fee" required>
                            <input name="totalFee" required className={inputClass} />
                        </Line>
                        <Line label="Currency" className="md:[&>span:first-child]:w-24">
                            <select name="currency" defaultValue="GHS" className={`${inputClass} bg-white`}>
                                <option value="GHS">GHS</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </Line>
                    </div>
                    <Line label="Number of Working Days / Level of Effort" className="[&>span:first-child]:w-auto sm:[&>span:first-child]:w-64">
                        <input name="levelOfEffort" className={inputClass} />
                    </Line>
                    <div>
                        <p className="text-sm text-slate-700 mb-1">Breakdown (optional)</p>
                        <textarea name="financialNotes" rows={2} className={areaClass} />
                    </div>
                </div>
            </section>

            <section className="mb-5">
                <h4 className="text-sm font-bold tracking-wide text-slate-900 mb-3">7. Contact person</h4>
                <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                        <Line label="Name" required>
                            <input name="contactName" required className={inputClass} />
                        </Line>
                        <Line label="Position" className="md:[&>span:first-child]:w-24">
                            <input name="contactPosition" className={inputClass} />
                        </Line>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                        <Line label="Contact (Phone)">
                            <input name="contactPhone" type="tel" className={inputClass} />
                        </Line>
                        <Line label="Email" className="md:[&>span:first-child]:w-20">
                            <input name="contactEmail" type="email" className={inputClass} />
                        </Line>
                    </div>
                </div>
            </section>

            <section className="mb-5">
                <h4 className="text-sm font-bold tracking-wide text-slate-900">Supporting documents</h4>
                <p className="text-xs text-slate-500 mb-2">PDF or Word · max 10MB each.</p>
                <div className="relative border border-slate-200 rounded px-3 py-1">
                    <FileLine name="profileDocument" required label="(i) Company or individual profile" />
                    <FileLine name="cvs" required multiple label="(ii) Curriculum vitae (CV) of the reviewer or key team members" />
                    <FileLine name="financialProposal" required label="(iii) Financial proposal / invoice" />
                </div>
            </section>

            <section className="mb-5">
                <h4 className="text-sm font-bold tracking-wide text-slate-900 mb-3">Declaration</h4>
                <p className="text-sm text-slate-700 leading-relaxed flex flex-wrap items-baseline gap-x-2 gap-y-2">
                    <span>I</span>
                    <input name="declarationName" required className={`${inputClass} w-56 inline-block`} aria-label="Full name" />
                    <span>, the representative of</span>
                    <input name="declarationOrg" className={`${inputClass} w-56 inline-block`} aria-label="Organisation" />
                    <span>hereby confirm that the information provided above is accurate.</span>
                </p>
                <div className="grid sm:grid-cols-2 gap-6 mt-6 max-w-xl">
                    <Line label="Signature" className="[&>span:first-child]:w-24">
                        <input name="declarationSignature" className={inputClass} placeholder="Type full name" />
                    </Line>
                    <Line label="Date" className="[&>span:first-child]:w-16">
                        <input name="declarationDate" type="date" className={inputClass} />
                    </Line>
                </div>
            </section>

            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Expressions of interest will be evaluated against the selection criteria set out in the Terms of Reference. Only shortlisted applicants will be contacted.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">Open until EGP closes this opportunity</p>
                <button type="submit" disabled={!canSubmit} className="btn-primary disabled:opacity-60">
                    {submitting ? 'Submitting…' : 'Submit Expression of Interest'}
                </button>
            </div>
        </form>
    );
}
