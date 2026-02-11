import { PrismaClient } from '@prisma/client';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const article = await prisma.article.findUnique({
        where: { slug: params.slug },
        include: { category: true },
    });

    if (!article) {
        return {
            title: 'Article Not Found | EGP Ghana',
        };
    }

    return {
        title: `${article.title} | EGP Ghana`,
        description: article.excerpt || article.title,
    };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const article = await prisma.article.findUnique({
        where: { slug: params.slug },
        include: { category: true },
    });

    if (!article) {
        notFound();
    }

    // Fetch related articles from same category
    const relatedArticles = await prisma.article.findMany({
        where: {
            categoryId: article.categoryId,
            NOT: { id: article.id },
        },
        include: { category: true },
        take: 3,
        orderBy: { publishedAt: 'desc' },
    });

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(date));
    };

    // Category color mapping
    const getCategoryColor = (categoryName?: string) => {
        const colors: Record<string, string> = {
            'Economy': 'bg-blue-500',
            'Policy': 'bg-green-500',
            'Debt': 'bg-red-500',
            'IMF': 'bg-purple-500',
            'General': 'bg-slate-500',
        };
        return colors[categoryName || 'General'] || 'bg-primary-600';
    };

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                {/* Hero Section */}
                <section className="relative bg-primary-700 py-10 md:py-14">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mr-auto text-left">
                            {/* Breadcrumb */}
                            <nav className="flex items-center space-x-2 text-sm text-blue-200 mb-3 animate-fade-in">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <Link href="/resources" className="hover:text-white transition-colors">Resource Centre</Link>
                                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-white font-medium truncate max-w-[150px] md:max-w-none">{article.title.substring(0, 40)}...</span>
                            </nav>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 animate-fade-in text-white leading-tight">
                                {article.title}
                            </h1>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-6 text-lg text-blue-100 animate-slide-up leading-relaxed border-l-4 border-primary-500 pl-6">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">{formatDate(article.publishedAt)}</span>
                                </div>
                                {article.featured && (
                                    <div className="flex items-center space-x-2 text-accent-teal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-sm font-semibold uppercase tracking-wide">Featured</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Article Content */}
                <article className="py-8 md:py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Featured Image */}
                            {article.imageUrl && (
                                <div className="relative w-full h-64 md:h-[500px] rounded-xl md:rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-md md:shadow-xl bg-slate-100">
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}

                            {/* Excerpt */}
                            {article.excerpt && (
                                <div className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 md:mb-12 p-6 md:p-8 bg-blue-50 rounded-xl md:rounded-2xl border-l-4 border-primary-600">
                                    <svg className="w-6 h-6 md:w-8 md:h-8 text-primary-600 mb-3 md:mb-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                    <p className="font-medium">{article.excerpt}</p>
                                </div>
                            )}

                            {/* Content */}
                            <div
                                className="text-slate-700 leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            {/* External Article Link */}
                            {article.sourceUrl && (
                                <div className="mt-8 md:mt-12 flex justify-center">
                                    <a
                                        href={article.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-bold rounded-lg shadow-lg hover:bg-primary-700 hover:-translate-y-1 transition-all duration-300 group"
                                    >
                                        <span>Read Full Story</span>
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            )}

                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                                        Related Topics
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(article.tags as string[]).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium hover:border-primary-600 hover:text-primary-600 transition-colors cursor-pointer"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </article>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <section className="py-16 bg-white border-t border-slate-200">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-6xl mx-auto">
                                <h2 className="text-3xl font-bold font-heading text-slate-900 mb-8">Related Articles</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedArticles.map((related) => (
                                        <ArticleCard
                                            key={related.id}
                                            slug={related.slug}
                                            title={related.title}
                                            excerpt={related.excerpt}
                                            author={related.author}
                                            publishedAt={related.publishedAt}
                                            imageUrl={related.imageUrl}
                                            category={related.category}
                                            variant="compact"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
