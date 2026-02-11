
import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

// We will fetch this data in the parent component
type RelatedArticle = {
    id: string;
    title: string;
    slug: string;
    publishedAt: Date;
    category: {
        name: string;
        slug: string;
    };
};

export default async function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
    if (articles.length === 0) return null;

    return (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-slate-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    Related Analysis
                </h3>
                <Link href="/articles" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    View All &rarr;
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {articles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group block bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
                            <span className="font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                                {article.category.name}
                            </span>
                            <span>•</span>
                            <time dateTime={article.publishedAt.toISOString()}>
                                {format(article.publishedAt, 'MMM d, yyyy')}
                            </time>
                        </div>
                        <h4 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                            {article.title}
                        </h4>
                    </Link>
                ))}
            </div>
        </div>
    );
}
