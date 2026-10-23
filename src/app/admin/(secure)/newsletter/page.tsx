'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

type Subscriber = {
    id: string;
    email: string;
    name: string | null;
    active: boolean;
    subscribedAt: string;
    unsubscribedAt: string | null;
};

export default function AdminNewsletterPage() {
    const [items, setItems] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/newsletter?status=${filter}`)
            .then((r) => r.json())
            .then((data) => setItems(data.subscribers || []))
            .finally(() => setLoading(false));
    }, [filter]);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Newsletter subscribers"
                description="People who subscribed via the website footer or events page."
            />

            <div className="flex gap-2">
                {(['active', 'inactive', 'all'] as const).map((f) => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] capitalize ${
                            filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-sm text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Subscribed</th>
                                    <th className="px-6 py-4">Unsubscribed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No subscribers.</td>
                                    </tr>
                                ) : (
                                    items.map((row) => (
                                        <tr key={row.id} className="border-t">
                                            <td className="px-6 py-4 font-medium">{row.email}</td>
                                            <td className="px-6 py-4">{row.name || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        row.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {row.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(row.subscribedAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {row.unsubscribedAt ? new Date(row.unsubscribedAt).toLocaleString() : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
