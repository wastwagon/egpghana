import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'EGP embed',
    robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 p-3 sm:p-4" data-embed-chrome="minimal">
            {children}
        </div>
    );
}
