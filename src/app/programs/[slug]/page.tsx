
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import * as Icons from 'lucide-react';

// Force dynamic rendering since we are fetching from DB
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const program = await prisma.program.findUnique({
        where: { slug: params.slug },
    });

    if (!program) return { title: 'Program Not Found' };

    return {
        title: `${program.title} | EGP Ghana`,
        description: program.description,
    };
}

export default async function ProgramPage({ params }: { params: { slug: string } }) {
    const program = await prisma.program.findUnique({
        where: { slug: params.slug },
    });

    if (!program) {
        notFound();
    }

    // Default related links for now, since we don't store them in DB yet.
    // In a real app, we would add a RelatedLinks model or JSON field.
    const relatedLinks = [
        { title: 'Contact Us', url: '/contact' },
        { title: 'View Resources', url: '/resources' },
    ];

    return (
        <>
            <main className="min-h-screen bg-dark-900">
                {/* Hero Section */}
                <section className={`relative py-20 md:py-32 bg-gradient-to-br from-dark-900 via-${program.color || 'primary-500'}/20 to-dark-900`}>
                    <div className="container">
                        <div className="max-w-4xl mr-auto text-left">
                            <span className={`inline-block px-4 py-2 rounded-full bg-${program.color || 'primary-500'}/20 text-${program.color || 'primary-500'} text-sm font-bold uppercase tracking-wider mb-6 border border-${program.color || 'primary-500'}/30`}>
                                Program Initiative
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 animate-fade-in">{program.title}</h1>
                            <p className="text-lg text-gray-300 animate-slide-up max-w-2xl border-l-4 border-primary-500 pl-6">
                                {program.description}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <div className="glass-card mb-8">
                                    <h2 className="heading-3 mb-6">About the Program</h2>
                                    <div
                                        className="prose prose-invert prose-slate md:prose-lg max-w-none text-gray-300"
                                        dangerouslySetInnerHTML={{ __html: program.fullContent || '' }}
                                    />
                                </div>

                                <div className="glass-card">
                                    <h2 className="heading-3 mb-6">Key Features</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {program.features.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-dark-800/50">
                                                <svg className={`w-5 h-5 text-${program.color || 'primary-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <div className="glass-card p-6">
                                    <h3 className="heading-3 text-lg mb-4">Quick Links</h3>
                                    <ul className="space-y-3">
                                        {relatedLinks.map((link, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={link.url}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors group"
                                                >
                                                    <span className="text-gray-300 group-hover:text-white transition-colors">{link.title}</span>
                                                    <svg className="w-4 h-4 text-gray-500 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="glass-card p-6 bg-gradient-to-br from-primary-900/50 to-dark-800">
                                    <h3 className="heading-3 text-lg mb-4">Get Involved</h3>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Interested in supporting this program or learning more? Contact our team.
                                    </p>
                                    <Link href="/contact" className="btn-primary w-full text-center">
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
