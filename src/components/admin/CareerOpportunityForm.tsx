'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface OpportunityForm {
    id?: string;
    title?: string;
    slug?: string;
    type?: string;
    summary?: string | null;
    content?: string;
    deadline?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    notifyEmail?: string;
    status?: string;
}

function toLocal(value?: string | null) {
    if (!value) return '';
    const d = new Date(value);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CareerOpportunityForm({ initialData }: { initialData?: OpportunityForm }) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState(initialData?.content || '');
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        const form = new FormData(event.currentTarget);
        const payload = {
            title,
            slug,
            type: String(form.get('type') || 'consultancy'),
            summary: String(form.get('summary') || ''),
            content,
            deadline: String(form.get('deadline') || '') || null,
            startDate: String(form.get('startDate') || '') || null,
            endDate: String(form.get('endDate') || '') || null,
            notifyEmail: String(form.get('notifyEmail') || 'egpghana20@gmail.com'),
            status: String(form.get('status') || 'open'),
        };
        const url = initialData?.id
            ? `/api/admin/careers/opportunities/${initialData.id}`
            : '/api/admin/careers/opportunities';
        const res = await fetch(url, {
            method: initialData?.id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        setSaving(false);
        if (res.ok) router.push('/admin/careers');
        else {
            const data = await res.json();
            alert(data.error || 'Save failed');
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5 bg-white p-6 rounded-xl border">
            <label className="block">
                <span className="text-sm font-medium">Title</span>
                <input className="mt-1 w-full border rounded-lg px-3 py-2" value={title} onChange={(e) => {
                    setTitle(e.target.value);
                    if (!initialData?.id) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                }} required />
            </label>
            <label className="block">
                <span className="text-sm font-medium">Slug</span>
                <input className="mt-1 w-full border rounded-lg px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </label>
            <div className="grid md:grid-cols-3 gap-4">
                <label className="block">
                    <span className="text-sm font-medium">Type</span>
                    <select name="type" defaultValue={initialData?.type || 'consultancy'} className="mt-1 w-full border rounded-lg px-3 py-2">
                        <option value="consultancy">Consultancy</option>
                        <option value="job">Job</option>
                    </select>
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Status</span>
                    <select name="status" defaultValue={initialData?.status || 'open'} className="mt-1 w-full border rounded-lg px-3 py-2">
                        <option value="draft">Draft</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                    <p className="mt-1 text-xs text-slate-500">Set to Closed when you want to stop applications. Deadlines do not auto-close a listing.</p>
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Notify email</span>
                    <input name="notifyEmail" type="email" defaultValue={initialData?.notifyEmail || 'egpghana20@gmail.com'} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </label>
            </div>
            <label className="block">
                <span className="text-sm font-medium">Summary</span>
                <textarea name="summary" defaultValue={initialData?.summary || ''} rows={3} className="mt-1 w-full border rounded-lg px-3 py-2" />
            </label>
            <div className="grid md:grid-cols-3 gap-4">
                <label className="block">
                    <span className="text-sm font-medium">Deadline (optional)</span>
                    <input name="deadline" type="datetime-local" defaultValue={toLocal(initialData?.deadline)} className="mt-1 w-full border rounded-lg px-3 py-2" />
                    <p className="mt-1 text-xs text-slate-500">Display only. Leave blank to keep applications open indefinitely.</p>
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Assignment start</span>
                    <input name="startDate" type="datetime-local" defaultValue={toLocal(initialData?.startDate)} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Assignment end</span>
                    <input name="endDate" type="datetime-local" defaultValue={toLocal(initialData?.endDate)} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </label>
            </div>
            <div>
                <span className="text-sm font-medium">Terms of Reference / content</span>
                <div className="mt-2">
                    <RichTextEditor value={content} onChange={setContent} placeholder="Paste or write the ToR..." />
                </div>
            </div>
            <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {saving ? 'Saving…' : 'Save opportunity'}
            </button>
        </form>
    );
}
