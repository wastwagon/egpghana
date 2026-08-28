import { ReactNode } from 'react';

export default function CareerPageHero({
    eyebrow,
    title,
    children,
}: {
    eyebrow?: ReactNode;
    title: string;
    children?: ReactNode;
}) {
    return (
        <section className="relative min-h-[420px] md:min-h-[520px] flex items-end overflow-hidden">
            <img
                src="/assets/images/careers-hero.jpg"
                alt="Policy and civil society professionals reviewing organisational strategy together"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950/92 via-primary-900/78 to-slate-900/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-black/20" />
            <div className="container relative z-10 w-full px-6 pb-12 pt-28 md:pb-16 md:pt-36">
                {eyebrow}
                <h1 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-white leading-tight max-w-4xl">
                    {title}
                </h1>
                {children}
            </div>
        </section>
    );
}
