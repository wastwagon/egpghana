
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

const prisma = new PrismaClient();

export const metadata = {
    title: 'Publications & Insights | EGP Ghana',
    description: 'Latest economic analysis, policy briefs, and news from the Economic Governance Platform.',
};

export const revalidate = 60; // Revalidate every minute

export default async function ArticlesPage({ searchParams }: { searchParams: { category?: string; page?: string } }) {

    // Build where clause
    const where: any = {};
    if (searchParams.category) {
        where.category = { slug: searchParams.category };
    }

    // Pagination logic
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const limit = 24;
    const skip = (page - 1) * limit;

    // Fetch articles and total count
    const [articles, total] = await prisma.$transaction([
        prisma.article.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            include: { category: true },
            take: limit,
            skip,
        }),
        prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Fetch categories for filter bar
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="bg-primary-900 text-white py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/assets/patterns/grid.svg')] opacity-10"></div>
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-accent-teal blur-3xl opacity-20"></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                            Publications & Insights
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            Expert analysis, research papers, and updates on Ghana's economic governance landscape.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4">

                        {/* Categories / Filter */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            <Link
                                href="/articles"
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${!searchParams.category ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                All
                            </Link>
                            {categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={`/articles?category=${cat.slug}`}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${searchParams.category === cat.slug ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>

                        {articles.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {articles.map((article) => (
                                        <ArticleCard
                                            key={article.id}
                                            slug={article.slug}
                                            title={article.title}
                                            excerpt={article.excerpt}
                                            author={article.author}
                                            publishedAt={article.publishedAt}
                                            imageUrl={article.imageUrl}
                                            category={article.category}
                                            variant="standard"
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center gap-2">
                                        <Link
                                            href={{
                                                pathname: '/articles',
                                                query: { ...searchParams, page: Math.max(1, page - 1).toString() }
                                            }}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${page > 1 ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 pointer-events-none'}`}
                                            aria-disabled={page <= 1}
                                        >
                                            Previous
                                        </Link>

                                        <div className="flex items-center px-4 text-sm text-gray-600">
                                            Page {page} of {totalPages}
                                        </div>

                                        <Link
                                            href={{
                                                pathname: '/articles',
                                                query: { ...searchParams, page: Math.min(totalPages, page + 1).toString() }
                                            }}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${page < totalPages ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 pointer-events-none'}`}
                                            aria-disabled={page >= totalPages}
                                        >
                                            Next
                                        </Link>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No publications found</h3>
                                <p className="text-slate-500 mt-1">
                                    {searchParams.category ? `No articles in "${searchParams.category}"` : 'Check back later for new publications.'}
                                </p>
                                {searchParams.category && (
                                    <Link href="/articles" className="mt-4 inline-block text-primary-600 hover:underline">
                                        View all publications
                                    </Link>
                                )}
                            </div>
                        )}

                    </div>
                </section>
            </main >
            <Footer />
        </>
    );
}
