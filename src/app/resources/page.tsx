
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

import Footer from '@/components/Footer';
import ResourceCard from '@/components/ResourceCard';
import ArticleCard from '@/components/ArticleCard';
import LibraryHeader from '@/components/library/LibraryHeader';
import LibrarySidebar from '@/components/library/LibrarySidebar';
import RelatedArticles from '@/components/library/RelatedArticles';

import { prisma } from '@/lib/prisma';

export const metadata = {
    title: 'Resource Centre | EGP Ghana',
    description: 'Access research papers, policy briefs, and publications on Ghana\'s economic governance',
};

export const revalidate = 0;

export default async function ResourcesPage({
    searchParams,
}: {
    searchParams: { category?: string; q?: string };
}) {
    const categoryFilter = searchParams.category;
    const searchQuery = searchParams.q;

    // Build filter query
    const whereClause: any = {};
    if (categoryFilter) {
        whereClause.category = categoryFilter;
    }
    if (searchQuery) {
        whereClause.OR = [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { tags: { has: searchQuery } } // Simple tag match
        ];
    }

    // Check for special categories that pull from Articles table
    const isAnalysisView = categoryFilter === 'Analysis';
    const isNewsView = categoryFilter === 'News';

    // Fetch resources or articles
    let resources: any[] = [];
    let articles: any[] = [];

    if (isAnalysisView) {
        // Fetch only articles tagged as Analysis
        articles = await prisma.article.findMany({
            where: {
                tags: { has: 'Analysis' },
                ...(searchQuery ? {
                    OR: [
                        { title: { contains: searchQuery, mode: 'insensitive' } },
                        { content: { contains: searchQuery, mode: 'insensitive' } },
                    ]
                } : {})
            },
            include: { category: true },
            orderBy: { publishedAt: 'desc' },
            take: 50,
        });
    } else if (isNewsView) {
        // Fetch Resources(category=News) AND Articles(tags has News)

        // 1. Fetch Resources
        resources = await prisma.resource.findMany({
            where: {
                category: 'News',
                ...(searchQuery ? {
                    OR: [
                        { title: { contains: searchQuery, mode: 'insensitive' } },
                        { description: { contains: searchQuery, mode: 'insensitive' } },
                    ]
                } : {})
            },
            orderBy: { publishedAt: 'desc' },
            take: 50,
        });

        // 2. Fetch News Articles
        articles = await prisma.article.findMany({
            where: {
                tags: { has: 'News' },
                ...(searchQuery ? {
                    OR: [
                        { title: { contains: searchQuery, mode: 'insensitive' } },
                        { content: { contains: searchQuery, mode: 'insensitive' } },
                    ]
                } : {})
            },
            include: { category: true },
            orderBy: { publishedAt: 'desc' },
            take: 50,
        });

    } else {
        // Standard Resource Fetch (All Resources or any other category)

        // 1. Fetch Resources
        resources = await prisma.resource.findMany({
            where: whereClause,
            orderBy: { publishedAt: 'desc' },
            take: 50,
        });

        // 2. Fetch Articles
        articles = await prisma.article.findMany({
            where: {
                ...(categoryFilter ? {
                    category: {
                        name: { equals: categoryFilter, mode: 'insensitive' }
                    }
                } : {}),
                ...(searchQuery ? {
                    OR: [
                        { title: { contains: searchQuery, mode: 'insensitive' } },
                        { content: { contains: searchQuery, mode: 'insensitive' } },
                    ]
                } : {})
            },
            include: { category: true },
            orderBy: { publishedAt: 'desc' },
            take: 50,
        });
    }

    // Get dynamic categories for sidebar
    const categoryRecords = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { name: true }
    });

    // Use dynamic categories for sidebar
    const categories = categoryRecords.map(c => c.name);

    // Fetch all resources for tag counting
    const allResources = await prisma.resource.findMany({
        select: { category: true, tags: true },
    });

    // Fetch counts for categories
    // 1. Resources counts
    const resourceCounts = await prisma.resource.groupBy({
        by: ['category'],
        _count: {
            category: true,
        },
    });

    // 2. Article counts (for Analysis and News tags)
    const analysisArticleCount = await prisma.article.count({
        where: {
            tags: { has: 'Analysis' }
        }
    });

    const newsArticleCount = await prisma.article.count({
        where: {
            tags: { has: 'News' }
        }
    });

    // 3. Aggregate counts
    const categoryCounts: Record<string, number> = {};

    // Fill with resource counts
    resourceCounts.forEach((group) => {
        categoryCounts[group.category] = group._count.category;
    });

    // Add/Merge Article counts
    categoryCounts['Analysis'] = (categoryCounts['Analysis'] || 0) + analysisArticleCount;
    categoryCounts['News'] = (categoryCounts['News'] || 0) + newsArticleCount;

    // Extract popular tags (simple count)
    const tagCounts: Record<string, number> = {};
    allResources.forEach(r => {
        r.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    const popularTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8) // Top 8 tags
        .map(([tag]) => tag);


    // Fetch Related Articles (only if NOT in Articles view and specific category)
    let relatedArticles: any[] = [];
    if (!(isAnalysisView || isNewsView) && categoryFilter) {
        // Try to find a category in articles that matches the resource category name
        // Or just general recent articles if no direct match, but let's try strict first
        // Since Article schema has a Category relation where 'name' is unique.

        // Note: Resource category is String, Article category is a Model.
        // We look for Articles where Category.name matches the resource category filter.
        relatedArticles = await prisma.article.findMany({
            where: {
                category: {
                    name: { equals: categoryFilter, mode: 'insensitive' }
                }
            },
            take: 3,
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                publishedAt: true,
                category: {
                    select: { name: true, slug: true }
                }
            }
        });
    }

    // If no related articles found (or no filter), maybe show some recent featured ones?
    // Let's stick to showing them only if meaningful for now, or just latest if the user is in "All Resources" mode to keep page lively
    if (relatedArticles.length === 0 && !categoryFilter) {
        relatedArticles = await prisma.article.findMany({
            take: 3,
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                publishedAt: true,
                category: {
                    select: { name: true, slug: true }
                }
            }
        });
    }


    return (
        <>

            <main className="min-h-screen bg-slate-50">
                <LibraryHeader />

                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <LibrarySidebar
                            categories={categories}
                            activeCategory={categoryFilter}
                            popularTags={popularTags}
                            categoryCounts={categoryCounts}
                        />

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Title / Status */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold font-heading text-slate-900">
                                        {searchQuery ? `Search results for "${searchQuery}"` :
                                            categoryFilter ? categoryFilter : 'All Resources'}
                                    </h2>
                                    <span className="text-slate-500 text-sm font-medium bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                        {resources.length + articles.length} {(resources.length + articles.length) === 1 ? 'result' : 'results'}
                                    </span>
                                </div>
                                {/* Category Description */}
                                {!searchQuery && categoryFilter && (
                                    <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
                                        {categoryFilter === 'Analysis' && 'Explore in-depth analysis and expert commentary on Ghana\'s economic policies, fiscal trends, and governance issues. Our analytical pieces provide critical insights into complex economic challenges, offering evidence-based perspectives on policy decisions and their implications for Ghana\'s development trajectory.'}
                                        {categoryFilter === 'News' && 'Stay informed with the latest updates and breaking news on Ghana\'s economy, policy developments, and governance initiatives. Our news coverage brings you timely information on economic indicators, government announcements, IMF program updates, and significant events shaping Ghana\'s fiscal landscape.'}
                                        {categoryFilter === 'Press Statements' && 'Access official press releases and public statements from the Economic Governance Platform on key economic and governance matters. These statements reflect EGP\'s positions on critical policy issues, budget analyses, and responses to major economic developments affecting Ghana.'}
                                        {categoryFilter === 'Reports' && 'Dive into comprehensive research reports, data analysis, and policy evaluations on Ghana\'s economic landscape. Our reports combine rigorous research methodologies with practical insights to provide stakeholders with actionable intelligence on fiscal policy, debt management, and economic governance.'}
                                        {categoryFilter === 'Policy Papers' && 'Discover evidence-based policy recommendations and strategic papers addressing Ghana\'s economic challenges. These papers present well-researched solutions to pressing economic issues, offering policymakers and stakeholders practical frameworks for improving fiscal governance and sustainable development.'}
                                    </p>
                                )}
                                {!searchQuery && !categoryFilter && (
                                    <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
                                        Browse our comprehensive collection of research papers, policy briefs, fiscal reports, and economic analysis. The EGP Knowledge Base serves as a central repository for evidence-based insights on Ghana\'s economic governance, providing stakeholders with the information needed to make informed decisions.
                                    </p>
                                )}
                            </div>

                            {/* Resources/Articles List */}
                            {(isAnalysisView || isNewsView) ? (
                                <div>
                                    {/* For Analysis, just grid of articles */}
                                    {isAnalysisView && articles.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {articles.map((article) => (
                                                <ArticleCard
                                                    key={article.id}
                                                    slug={article.slug}
                                                    title={article.title}
                                                    excerpt={article.excerpt}
                                                    content={article.content}
                                                    author={article.author}
                                                    publishedAt={article.publishedAt}
                                                    imageUrl={article.imageUrl}
                                                    category={article.category}
                                                    featured={false}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* For News, we might have both. Show Articles first? or Mix? Let's stack them with headers if both exist */}
                                    {isNewsView && (
                                        <div className="space-y-12">
                                            {articles.length > 0 && (
                                                <div>
                                                    {resources.length > 0 && <h3 className="font-heading font-bold text-xl text-slate-800 mb-4">Latest Insights</h3>}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {articles.map((article) => (
                                                            <ArticleCard
                                                                key={article.id}
                                                                slug={article.slug}
                                                                title={article.title}
                                                                excerpt={article.excerpt}
                                                                content={article.content}
                                                                author={article.author}
                                                                publishedAt={article.publishedAt}
                                                                imageUrl={article.imageUrl}
                                                                category={article.category}
                                                                featured={false} // All items in 2-column grid
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {resources.length > 0 && (
                                                <div>
                                                    {(articles.length > 0) && <h3 className="font-heading font-bold text-xl text-slate-800 mb-4 mt-8">Documents & Reports</h3>}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {resources.map((resource) => (
                                                            <ResourceCard
                                                                key={resource.id}
                                                                id={resource.id}
                                                                title={resource.title}
                                                                description={resource.description}
                                                                fileUrl={resource.fileUrl}
                                                                fileName={resource.fileName}
                                                                fileType={resource.fileType}
                                                                fileSize={resource.fileSize}
                                                                category={resource.category}
                                                                publishedAt={resource.publishedAt}
                                                                featured={false} // All items in 2-column grid
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {articles.length === 0 && resources.length === 0 && (
                                                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No news found</h3>
                                                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                                        We couldn't find any news items matching your search.
                                                    </p>
                                                    <a href="/resources?category=News" className="text-primary-600 font-semibold hover:text-primary-700">
                                                        Clear Search
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Empty State for Analysis */}
                                    {isAnalysisView && articles.length === 0 && (
                                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">No analysis found</h3>
                                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                                We couldn't find any analysis articles.
                                            </p>
                                            <a href="/resources?category=Analysis" className="text-primary-600 font-semibold hover:text-primary-700">
                                                Clear Search
                                            </a>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                (resources.length > 0 || articles.length > 0) ? (
                                    <div className="space-y-12">
                                        {/* Articles Section */}
                                        {articles.length > 0 && (
                                            <div>
                                                {resources.length > 0 && <h3 className="font-heading font-bold text-xl text-slate-800 mb-4">Latest Insights</h3>}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {articles.map((article) => (
                                                        <ArticleCard
                                                            key={article.id}
                                                            slug={article.slug}
                                                            title={article.title}
                                                            excerpt={article.excerpt}
                                                            content={article.content}
                                                            author={article.author}
                                                            publishedAt={article.publishedAt}
                                                            imageUrl={article.imageUrl}
                                                            category={article.category}
                                                            featured={false}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Resources Section */}
                                        {resources.length > 0 && (
                                            <div>
                                                {(articles.length > 0) && <h3 className="font-heading font-bold text-xl text-slate-800 mb-4 mt-8">Documents & Reports</h3>}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {resources.map((resource) => (
                                                        <ResourceCard
                                                            key={resource.id}
                                                            id={resource.id}
                                                            title={resource.title}
                                                            description={resource.description}
                                                            fileUrl={resource.fileUrl}
                                                            fileName={resource.fileName}
                                                            fileType={resource.fileType}
                                                            fileSize={resource.fileSize}
                                                            category={resource.category}
                                                            publishedAt={resource.publishedAt}
                                                            featured={false}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">No documents found</h3>
                                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                            We couldn't find any resources matching your criteria. Try adjusting your filters or search terms.
                                        </p>
                                        {categoryFilter || searchQuery ? (
                                            <a href="/resources" className="text-primary-600 font-semibold hover:text-primary-700">
                                                Clear Filters
                                            </a>
                                        ) : null}
                                    </div>
                                )
                            )}

                            {/* Related Articles Section */}
                            <RelatedArticles articles={relatedArticles} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
