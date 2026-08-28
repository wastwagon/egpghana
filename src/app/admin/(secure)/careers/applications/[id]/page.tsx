'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Download, Loader2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';
import { CareerAttachment } from '@/lib/career-application';

export default function ApplicationDetailPage() {
    const params = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        const res = await fetch(`/api/admin/careers/applications/${params.id}`);
        const json = await res.json();
        setData(json.application);
    };

    useEffect(() => { load(); }, [params.id]);

    if (!data) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;
    }

    const files: CareerAttachment[] = Array.isArray(data.attachments) ? data.attachments : [];
    const assignments = Array.isArray(data.assignments) ? data.assignments : [];
    const references = Array.isArray(data.references) ? data.references : [];
    const team = Array.isArray(data.teamMembers) ? data.teamMembers : [];

    const saveMeta = async () => {
        setSaving(true);
        await fetch(`/api/admin/careers/applications/${params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: data.status, notes: data.notes }),
        });
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader title={data.applicantName} description={`${data.opportunity?.title} · ${data.email}`}>
                <a href={`/api/admin/careers/applications/${data.id}/download`} className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600">
                    <Download className="w-4 h-4 mr-2" /> Download full entry
                </a>
            </AdminPageHeader>

            <div className="grid md:grid-cols-3 gap-4">
                <select value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })} className="border rounded-lg px-3 py-2">
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="archived">Archived</option>
                </select>
                <input value={data.notes || ''} onChange={(e) => setData({ ...data, notes: e.target.value })} placeholder="Internal notes" className="border rounded-lg px-3 py-2 md:col-span-1" />
                <button onClick={saveMeta} disabled={saving} className="border rounded-lg px-3 py-2 bg-white">{saving ? 'Saving…' : 'Save status'}</button>
            </div>

            <section className="bg-white rounded-xl border p-6 space-y-3 text-sm">
                <h2 className="font-bold text-lg">Applicant details</h2>
                <p><strong>Type:</strong> {data.applicantType}</p>
                <p><strong>Location:</strong> {data.location}</p>
                <p><strong>Phone:</strong> {data.phone}</p>
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Website:</strong> {data.website}</p>
            </section>

            <section className="bg-white rounded-xl border p-6 space-y-2 text-sm whitespace-pre-wrap">
                <h2 className="font-bold text-lg">Profile</h2>
                <p>{data.profile}</p>
            </section>

            <section className="bg-white rounded-xl border p-6 space-y-2 text-sm whitespace-pre-wrap">
                <h2 className="font-bold text-lg">Relevant experience</h2>
                <p>{data.relevantExperience}</p>
                <h3 className="font-semibold mt-4">Assignments</h3>
                <ul className="list-disc pl-5">
                    {assignments.map((row: any, i: number) => (
                        <li key={i}>{row.assignment} — {row.client} ({row.year}) · {row.role}</li>
                    ))}
                </ul>
                <h3 className="font-semibold mt-4">References</h3>
                <ul className="list-disc pl-5">
                    {references.map((row: any, i: number) => (
                        <li key={i}>{row.name}, {row.position}, {row.organisation} — {row.contact}</li>
                    ))}
                </ul>
            </section>

            <section className="bg-white rounded-xl border p-6 space-y-2 text-sm whitespace-pre-wrap">
                <h2 className="font-bold text-lg">Methodology</h2>
                <p>{data.methodology}</p>
            </section>

            <section className="bg-white rounded-xl border p-6 space-y-2 text-sm whitespace-pre-wrap">
                <h2 className="font-bold text-lg">Team</h2>
                <p>{data.teamQualifications}</p>
                <ul className="list-disc pl-5">
                    {team.map((row: any, i: number) => (
                        <li key={i}>{row.name} — {row.role} · {row.qualification} · {row.years} years</li>
                    ))}
                </ul>
            </section>

            <section className="bg-white rounded-xl border p-6 space-y-2 text-sm">
                <h2 className="font-bold text-lg">Financial proposal</h2>
                <p><strong>Fee:</strong> {data.totalFee} {data.currency}</p>
                <p><strong>Level of effort:</strong> {data.levelOfEffort}</p>
                <p className="whitespace-pre-wrap">{data.financialNotes}</p>
            </section>

            <section className="bg-white rounded-xl border p-6 space-y-2 text-sm">
                <h2 className="font-bold text-lg">Contact person</h2>
                <p>{data.contactName} · {data.contactPosition} · {data.contactPhone} · {data.contactEmail}</p>
                <p className="mt-3"><strong>Declaration:</strong> {data.declarationName}, representative of {data.declarationOrg}</p>
                <p><strong>Signature:</strong> {data.declarationSignature || '—'}</p>
                <p><strong>Date:</strong> {data.declarationDate || '—'}</p>
            </section>

            <section className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-lg mb-4">Attachments</h2>
                {files.length === 0 ? (
                    <p className="text-gray-500 text-sm">No attachments.</p>
                ) : (
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-sm border-b py-2">
                                <span>{file.field}: {file.originalName}</span>
                                <a className="text-blue-600" href={`/api/admin/careers/applications/${data.id}/file?index=${index}`}>Download</a>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <Link href="/admin/careers/applications" className="text-blue-600 text-sm">← All applications</Link>
        </div>
    );
}
