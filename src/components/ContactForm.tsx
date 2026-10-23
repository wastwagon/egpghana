'use client';

import { FormEvent, useState } from 'react';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');
        setError('');
        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        };
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = (await res.json().catch(() => ({}))) as { error?: string };
            if (res.status === 429) {
                throw new Error(json.error || 'Too many messages. Please try again in about an hour.');
            }
            if (!res.ok) throw new Error(json.error || 'Failed to send');
            setStatus('success');
            form.reset();
        } catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Failed to send');
        }
    }

    if (status === 'success') {
        return (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center text-emerald-900">
                <p className="font-semibold mb-1">Message sent</p>
                <p className="text-sm">Thank you — we will get back to you soon.</p>
                <button type="button" className="btn-secondary mt-4 text-sm" onClick={() => setStatus('idle')}>
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2">{error}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                    <input type="text" id="name" name="name" className="input" placeholder="John Doe" required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input type="email" id="email" name="email" className="input" placeholder="john@example.com" required />
                </div>
            </div>
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <select id="subject" name="subject" className="input bg-white text-slate-900 border-slate-300" defaultValue="general">
                    <option value="general">General Inquiry</option>
                    <option value="press">Press &amp; Media</option>
                    <option value="program">Program Partnership</option>
                    <option value="feedback">Website Feedback</option>
                </select>
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea id="message" name="message" rows={6} className="input resize-none" placeholder="How can we help you?" required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
        </form>
    );
}
