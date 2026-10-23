'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    read: boolean;
    replied: boolean;
    createdAt: string;
};

export default function AdminContactPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch('/api/admin/contact');
        const data = await res.json();
        if (res.ok) setMessages(data.messages || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const markRead = async (id: string) => {
        await fetch('/api/admin/contact', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, read: true }),
        });
        await load();
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Contact inbox" description="Messages from the public contact form." />
            {loading ? (
                <p className="text-gray-500">Loading…</p>
            ) : messages.length === 0 ? (
                <p className="text-gray-500">No messages yet.</p>
            ) : (
                <ul className="space-y-4">
                    {messages.map((m) => (
                        <li
                            key={m.id}
                            className={`bg-white dark:bg-gray-800 border rounded-xl p-5 ${m.read ? 'border-gray-200 dark:border-gray-700' : 'border-primary-300 dark:border-primary-700'}`}
                        >
                            <div className="flex flex-wrap justify-between gap-2 mb-2">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{m.name}</p>
                                    <p className="text-sm text-gray-500">{m.email}</p>
                                </div>
                                <p className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString('en-GB')}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{m.subject}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{m.message}</p>
                            {!m.read && (
                                <button
                                    type="button"
                                    onClick={() => markRead(m.id)}
                                    className="mt-3 text-sm text-primary-600 hover:underline"
                                >
                                    Mark as read
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
