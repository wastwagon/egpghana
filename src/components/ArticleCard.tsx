import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
    slug: string;
    title: string;
    excerpt?: string | null;
    author?: string | null;
    publishedAt: Date;
    imageUrl?: string | null;
    content?: string;
    category?: {
        name: string;
        slug: string;
    };
    featured?: boolean;
    variant?: 'featured' | 'standard' | 'compact';
}

export default function ArticleCard({
    slug,
    title,
    excerpt,
    content,
    publishedAt,
    imageUrl,
    category,
    featured = false,
    variant = 'standard',
}: ArticleCardProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(date));
    };

    // Calculate reading time (rough estimate: 200 words per minute)
    // Use content if available, otherwise excerpt, otherwise default to 1 (not 3, as 3 is arbitrary)
    const textToMeasure = content || excerpt || '';
    const wordCount = textToMeasure.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200) || 1;

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

    const isFeatured = variant === 'featured' || featured;
    const isCompact = variant === 'compact';

    return (
        <Link
            href={`/articles/${slug}`}
            className={`group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 h-full flex flex-col ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''
                }`}
        >
            {/* Image Container */}
            <div className={`relative overflow-hidden ${isFeatured ? 'h-64 md:h-96' : isCompact ? 'h-40' : 'h-56'
                }`}>
                {imageUrl ? (
                    <>
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            unoptimized={imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/assets/')}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                )}



                {/* Featured Badge */}
                {isFeatured && (
                    <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center px-3 py-1.5 bg-accent-teal text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Featured
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={`flex-1 flex flex-col ${isFeatured ? 'p-8' : isCompact ? 'p-4' : 'p-6'}`}>
                {/* Title */}
                <h3 className={`font-heading font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-3 line-clamp-2 ${isFeatured ? 'text-xl md:text-2xl' : isCompact ? 'text-sm' : 'text-lg'
                    }`}>
                    {title}
                </h3>

                {/* Excerpt */}
                {excerpt && !isCompact && (
                    <p className={`text-slate-600 mb-4 flex-1 ${isFeatured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'
                        }`}>
                        {excerpt}
                    </p>
                )}

                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-4">
                        {/* Author section removed */}

                        {/* Date */}
                        <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">{formatDate(publishedAt)}</span>
                        </div>
                    </div>

                    {/* Reading Time */}
                    {!isCompact && (
                        <div className="flex items-center space-x-1 text-slate-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs">{readingTime} min read</span>
                        </div>
                    )}
                </div>

                {/* Read More Link */}
                <div className="mt-4">
                    <span className="inline-flex items-center text-primary-600 font-semibold text-sm group-hover:text-primary-700 transition-colors">
                        Read Article
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
