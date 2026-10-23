'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

function UnsubscribeContent() {
    const params = useSearchParams();
    const email = params.get('email') || '';
    const token = params.get('token') || '';
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!email || !token) return;
        setStatus('loading');
        fetch('/api/newsletter/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (res.status === 429) {
                    throw new Error(data.error || 'Too many requests. Please try again later.');
                }
                if (!res.ok) throw new Error(data.error || 'Failed');
                setMessage(data.message || 'Unsubscribed.');
                setStatus('done');
            })
            .catch((e) => {
                setMessage(e.message || 'Could not unsubscribe.');
                setStatus('error');
            });
    }, [email, token]);

    return (
        <main className="min-h-screen bg-slate-50 pt-28 pb-16">
            <div className="container max-w-lg text-center">
                <h1 className="heading-2 mb-4">Newsletter</h1>
                {!email || !token ? (
                    <p className="text-slate-600">This unsubscribe link is invalid. Use the link from your email.</p>
                ) : status === 'loading' || status === 'idle' ? (
                    <p className="text-slate-600">Processing…</p>
                ) : (
                    <p className={status === 'done' ? 'text-emerald-700' : 'text-red-600'}>{message}</p>
                )}
                <Link href="/" className="btn-primary inline-flex mt-8">Back to home</Link>
            </div>
        </main>
    );
}

export default function NewsletterUnsubscribePage() {
    return (
        <>
            <Suspense fallback={<main className="min-h-screen pt-28 text-center">Loading…</main>}>
                <UnsubscribeContent />
            </Suspense>
            <Footer />
        </>
    );
}
