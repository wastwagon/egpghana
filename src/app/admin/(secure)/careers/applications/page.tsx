'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Download, Loader2, Search } from 'lucide-react';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

interface ApplicationRow {
    id: string;
    applicantName: string;
    applicantType: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
    opportunity: { title: string; slug: string };
}

const STATUS_STYLES: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
    reviewed: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
    shortlisted: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    archived: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

export default function AdminApplicationsPage() {
    return (
        <Suspense fallback={<div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>}>
            <ApplicationsList />
        </Suspense>
    );
}

function ApplicationsList() {
    const searchParams = useSearchParams();
    const [items, setItems] = useState<ApplicationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const opportunityId = searchParams.get('opportunityId') || '';

    const load = async () => {
        setLoading(true);
        const qs = new URLSearchParams({ search, status, opportunityId, limit: '50' });
        const res = await fetch(`/api/admin/careers/applications?${qs}`);
        const data = await res.json();
        setItems(data.applications || []);
        setLoading(false);
    };

    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [search, status, opportunityId]);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Career applications"
                description="All Expressions of Interest. Download a full package for one applicant or every entry."
            >
                <a
                    href="/api/admin/careers/applications?export=all"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Download all entries
                </a>
            </AdminPageHeader>

            <div className="bg-white p-4 rounded-xl border flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone" className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm" />
                </div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                    <option value="">All statuses</option>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>
                ) : items.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No applications yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4 text-left">Applicant</th>
                                <th className="px-6 py-4 text-left">Opportunity</th>
                                <th className="px-6 py-4 text-left">Submitted</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((row) => (
                                <tr key={row.id} className="border-t hover:bg-slate-50/80">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{row.applicantName}</div>
                                        <div className="text-gray-500">{row.email} · {row.phone}</div>
                                        {row.applicantType && (
                                            <div className="text-xs text-slate-500 mt-1">{row.applicantType}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{row.opportunity?.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(row.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex capitalize px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[row.status] || STATUS_STYLES.new}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                                        <Link href={`/admin/careers/applications/${row.id}`} className="text-blue-600 hover:underline">View</Link>
                                        <a href={`/api/admin/careers/applications/${row.id}/download`} className="text-blue-600 hover:underline">Download</a>
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
