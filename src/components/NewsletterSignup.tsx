'use client';

import { FormEvent, useState } from 'react';

type Variant = 'footer' | 'hero';

export default function NewsletterSignup({ variant = 'footer' }: { variant?: Variant }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name: name || undefined }),
            });
            const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
            if (res.status === 429) {
                setStatus('error');
                setMessage(data.error || 'Too many sign-up attempts. Please wait a few minutes and try again.');
                return;
            }
            if (!res.ok) {
                setStatus('error');
                setMessage(data.error || 'Something went wrong.');
                return;
            }
            setStatus('success');
            setMessage(data.message || 'Subscribed!');
            setEmail('');
            setName('');
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    if (variant === 'hero') {
        return (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto w-full">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 backdrop-blur-sm min-h-[44px]"
                    required
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-8 py-3.5 font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-500 min-h-[44px] disabled:opacity-60"
                >
                    {status === 'loading' ? '…' : 'Subscribe'}
                </button>
                {message && (
                    <p className={`sm:col-span-2 text-sm text-center ${status === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>
                        {message}
                    </p>
                )}
            </form>
        );
    }

    return (
        <div className="mt-8 pt-8 border-t border-primary-800">
            <h3 className="text-white/90 font-heading font-semibold text-sm mb-2 tracking-normal">
                Newsletter
            </h3>
            <p className="text-white/80 text-sm mb-4">
                Events, publications, and economic updates in your inbox.
            </p>
            <form onSubmit={onSubmit} className="w-full space-y-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    autoComplete="email"
                    aria-label="Email address"
                    className="block w-full rounded-lg border border-primary-700 bg-primary-800/50 px-4 py-3 text-white placeholder:text-white/50 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 min-h-[44px]"
                    required
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full disabled:opacity-60"
                >
                    {status === 'loading' ? '…' : 'Subscribe'}
                </button>
            </form>
            {message && (
                <p className={`mt-2 text-sm ${status === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>{message}</p>
            )}
        </div>
    );
}
