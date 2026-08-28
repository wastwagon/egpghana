'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2, Briefcase } from 'lucide-react';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

interface Opportunity {
    id: string;
    title: string;
    slug: string;
    type: string;
    status: string;
    deadline: string | null;
    _count: { applications: number };
}

export default function AdminCareersPage() {
    const [items, setItems] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/careers/opportunities');
        const data = await res.json();
        setItems(data.opportunities || []);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this opportunity and all of its applications?')) return;
        const res = await fetch(`/api/admin/careers/opportunities/${id}`, { method: 'DELETE' });
        if (res.ok) load();
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Careers"
                description="Manage consultancies, jobs, and Expressions of Interest."
                action={{ label: 'New opportunity', href: '/admin/careers/new', icon: Plus }}
            >
                <Link href="/admin/careers/applications" className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    All applications
                </Link>
            </AdminPageHeader>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>
                ) : items.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No opportunities yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4 text-left">Title</th>
                                <th className="px-6 py-4 text-left">Type</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Deadline</th>
                                <th className="px-6 py-4 text-left">Applications</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                                    <td className="px-6 py-4">{item.type}</td>
                                    <td className="px-6 py-4">{item.status}</td>
                                    <td className="px-6 py-4">{item.deadline ? new Date(item.deadline).toLocaleString() : '—'}</td>
                                    <td className="px-6 py-4">
                                        <Link className="text-blue-600 hover:underline" href={`/admin/careers/applications?opportunityId=${item.id}`}>
                                            {item._count.applications}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={`/careers/${item.slug}`} className="inline-flex text-gray-500" target="_blank"><Briefcase className="w-4 h-4" /></Link>
                                        <Link href={`/admin/careers/${item.id}/edit`} className="inline-flex text-blue-600"><Pencil className="w-4 h-4" /></Link>
                                        <button onClick={() => handleDelete(item.id)} className="inline-flex text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
