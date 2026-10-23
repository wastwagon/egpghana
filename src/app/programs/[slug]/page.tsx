import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { buildPageMetadata } from '@/lib/seo';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/JsonLd';
import * as Icons from 'lucide-react';

import { PUBLIC_DATA_REVALIDATE_SECONDS } from '@/lib/cache-tags';

export const revalidate = PUBLIC_DATA_REVALIDATE_SECONDS;

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.Activity className={className} />;
    return <IconComponent className={className} />;
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const program = await prisma.program.findUnique({
        where: { slug: params.slug },
    });

    if (!program) return { title: 'Program Not Found' };

    return buildPageMetadata({
        title: `${program.title} | EGP Ghana`,
        description: program.description,
        path: `/programs/${program.slug}`,
    });
}

export default async function ProgramPage({ params }: { params: { slug: string } }) {
    const program = await prisma.program.findUnique({
        where: { slug: params.slug },
    });

    if (!program) {
        notFound();
    }

    const relatedLinks = [
        { title: 'Contact us', url: '/contact' },
        { title: 'Resource centre', url: '/resources' },
        { title: 'All programs', url: '/programs' },
    ];

    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', path: '/' },
                    { name: 'Programs', path: '/programs' },
                    { name: program.title, path: `/programs/${program.slug}` },
                ]}
            />
            <WebPageJsonLd
                name={program.title}
                description={program.description}
                path={`/programs/${program.slug}`}
            />
            <main className="min-h-screen bg-slate-50">
                <section className="relative bg-primary-700 py-12 md:py-20">
                    <div className="container px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mr-auto text-left">
                            <p className="section-label text-primary-200 mb-4">Program initiative</p>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                                    <DynamicIcon name={program.icon || 'Activity'} className="w-7 h-7" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold font-heading text-white leading-tight">
                                    {program.title}
                                </h1>
                            </div>
                            <p className="text-lg text-blue-100 max-w-2xl leading-relaxed border-l-4 border-primary-400 pl-6">
                                {program.description}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="section py-12 md:py-16">
                    <div className="container px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
                                    <h2 className="heading-3 text-slate-900 mb-6">About the program</h2>
                                    <div
                                        className="prose prose-slate md:prose-lg max-w-none text-slate-600"
                                        dangerouslySetInnerHTML={{ __html: program.fullContent || '<p>Details coming soon.</p>' }}
                                    />
                                </div>

                                {program.features.length > 0 && (
                                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
                                        <h2 className="heading-3 text-slate-900 mb-6">Key features</h2>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {program.features.map((feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm"
                                                >
                                                    <Icons.Check className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" aria-hidden />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <aside className="space-y-6">
                                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                                    <h3 className="font-heading font-semibold text-slate-900 mb-4">Quick links</h3>
                                    <ul className="space-y-2">
                                        {relatedLinks.map((link) => (
                                            <li key={link.url}>
                                                <Link
                                                    href={link.url}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-800 transition-colors min-h-[44px] group"
                                                >
                                                    <span className="text-sm font-medium">{link.title}</span>
                                                    <Icons.ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600" aria-hidden />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-primary-700 rounded-2xl p-6 text-white">
                                    <h3 className="font-heading font-semibold mb-2">Get involved</h3>
                                    <p className="text-blue-100 text-sm mb-5">
                                        Interested in supporting this program or learning more? Contact our team.
                                    </p>
                                    <Link href="/contact" className="btn-primary w-full text-center bg-white text-primary-800 hover:bg-blue-50">
                                        Contact us
                                    </Link>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
