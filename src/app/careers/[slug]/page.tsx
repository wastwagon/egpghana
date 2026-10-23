import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import EoiForm from '@/components/careers/EoiForm';
import CareerPageHero from '@/components/careers/CareerPageHero';
import { prisma } from '@/lib/prisma';
import { buildPageMetadata } from '@/lib/seo';
import { BreadcrumbJsonLd, JobPostingJsonLd } from '@/components/JsonLd';

import { PUBLIC_DATA_REVALIDATE_SECONDS } from '@/lib/cache-tags';

export const revalidate = PUBLIC_DATA_REVALIDATE_SECONDS;

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const opportunity = await prisma.careerOpportunity.findUnique({ where: { slug: params.slug } });
    if (!opportunity) {
        return { title: 'Careers | EGP Ghana', description: 'EGP career opportunities' };
    }
    return buildPageMetadata({
        title: `${opportunity.title} | Careers | EGP Ghana`,
        description: opportunity.summary || 'EGP career opportunity',
        path: `/careers/${opportunity.slug}`,
    });
}

export default async function CareerDetailPage({ params }: { params: { slug: string } }) {
    const opportunity = await prisma.careerOpportunity.findUnique({ where: { slug: params.slug } });
    if (!opportunity || opportunity.status === 'draft') notFound();

    const closed = opportunity.status !== 'open';

    return (
        <>
            {!closed && (
                <JobPostingJsonLd
                    title={opportunity.title}
                    description={opportunity.summary || opportunity.title}
                    slug={opportunity.slug}
                    deadline={opportunity.deadline}
                />
            )}
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', path: '/' },
                    { name: 'Careers', path: '/careers' },
                    { name: opportunity.title, path: `/careers/${opportunity.slug}` },
                ]}
            />
            <main className="min-h-screen bg-slate-50">
                <CareerPageHero
                    eyebrow={
                        <Link href="/careers" className="inline-block text-blue-200 text-sm hover:text-white mb-4">
                            ← All opportunities
                        </Link>
                    }
                    title={opportunity.title}
                >
                    <p className="text-blue-100 max-w-4xl border-l-4 border-primary-400 pl-6 leading-relaxed">
                        {opportunity.summary}
                    </p>
                    {!closed && (
                        <a href="#eoi" className="btn-primary inline-flex mt-6 bg-white text-primary-800 hover:bg-blue-50">
                            Submit Expression of Interest
                        </a>
                    )}
                </CareerPageHero>

                <section className="section py-12">
                    <div className="container">
                        <article className="interactive-card rounded-xl p-6 md:p-10 lg:p-12">
                            <h2 className="heading-2 mb-6">Terms of Reference</h2>
                            <div
                                className="prose prose-slate md:prose-lg max-w-none prose-headings:text-primary-900 prose-table:text-sm prose-th:bg-slate-50"
                                dangerouslySetInnerHTML={{ __html: opportunity.content }}
                            />
                        </article>
                    </div>
                </section>

                <section id="eoi" className="py-10 bg-slate-50 border-t border-slate-200">
                    <div className="container">
                        <EoiForm slug={opportunity.slug} closed={closed} />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
