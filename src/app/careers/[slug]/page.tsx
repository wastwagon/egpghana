import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import EoiForm from '@/components/careers/EoiForm';
import CareerPageHero from '@/components/careers/CareerPageHero';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const opportunity = await prisma.careerOpportunity.findUnique({ where: { slug: params.slug } });
    return {
        title: opportunity ? `${opportunity.title} | Careers | EGP Ghana` : 'Careers | EGP Ghana',
        description: opportunity?.summary || 'EGP career opportunity',
    };
}

function formatDeadline(date?: Date | null) {
    if (!date) return null;
    const datePart = date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'GMT',
    });
    const timePart = date.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'GMT',
    }).toLowerCase();
    return `${datePart} at ${timePart} GMT`;
}

export default async function CareerDetailPage({ params }: { params: { slug: string } }) {
    const opportunity = await prisma.careerOpportunity.findUnique({ where: { slug: params.slug } });
    if (!opportunity || opportunity.status === 'draft') notFound();

    const closed = opportunity.status !== 'open';

    return (
        <>
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
                    {opportunity.deadline && (
                        <p className="text-blue-200 mt-6 text-sm">
                            EOI deadline: {formatDeadline(opportunity.deadline)}
                        </p>
                    )}
                    {!closed && (
                        <a href="#eoi" className="btn-primary inline-flex mt-6 bg-white text-primary-800 hover:bg-blue-50">
                            Submit Expression of Interest
                        </a>
                    )}
                </CareerPageHero>

                <section className="section py-12">
                    <div className="container">
                        <article className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-10 lg:p-12">
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
