import Link from 'next/link';
import Footer from '@/components/Footer';
import CareerPageHero from '@/components/careers/CareerPageHero';
import { PUBLIC_DATA_REVALIDATE_SECONDS } from '@/lib/cache-tags';
import { prisma } from '@/lib/prisma';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const revalidate = PUBLIC_DATA_REVALIDATE_SECONDS;

export const metadata = {
    title: 'Careers | EGP Ghana',
    description: 'Current opportunities and consultancies at the Economic Governance Platform Ghana.',
};

export default async function CareersPage() {
    const opportunities = await prisma.careerOpportunity.findMany({
        where: { status: { in: ['open', 'closed'] } },
        orderBy: [{ status: 'asc' }, { deadline: 'asc' }],
    });

    return (
        <>
            <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }]} />
            <main className="min-h-screen bg-slate-50">
                <CareerPageHero title="Careers & Consultancies">
                    <p className="text-lg text-blue-100 max-w-3xl leading-relaxed border-l-4 border-primary-400 pl-6">
                        Join EGP’s work on fiscal transparency, public financial management, and inclusive economic policy in Ghana.
                    </p>
                </CareerPageHero>

                <section className="section py-12">
                    <div className="container">
                        {opportunities.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-100 p-10 text-center text-slate-600">
                                There are no open opportunities at this time. Please check back later.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {opportunities.map((item) => {
                                    const closed = item.status !== 'open';
                                    return (
                                        <article key={item.id} className="interactive-card rounded-xl p-6 md:p-8">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className="text-xs uppercase tracking-wide font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded">
                                                    {item.type}
                                                </span>
                                                <span className={`text-xs font-semibold px-2 py-1 rounded ${closed ? 'bg-slate-100 text-slate-600' : 'bg-green-50 text-green-700'}`}>
                                                    {closed ? 'Closed' : 'Open'}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-3">{item.title}</h2>
                                            {item.summary && <p className="text-slate-600 mb-6 max-w-5xl">{item.summary}</p>}
                                            <Link href={`/careers/${item.slug}`} className="btn-primary inline-flex">
                                                {closed ? 'View details' : 'View Terms of Reference & Apply'}
                                            </Link>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
