import { BreadcrumbJsonLd } from '@/components/JsonLd';

export default function NewsletterUnsubscribeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', path: '/' },
                    { name: 'Newsletter', path: '/newsletter/unsubscribe' },
                ]}
            />
            {children}
        </>
    );
}
