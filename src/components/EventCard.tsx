import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    startDate: Date;
    endDate?: Date | null;
    location?: string | null;
    imageUrl?: string | null;
}

export default function EventCard({
    id,
    slug,
    title,
    description,
    startDate,
    endDate,
    location,
    imageUrl,
}: EventCardProps) {
    const isPast = new Date(startDate) < new Date();

    // Format date as "February 13, 2025"
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(startDate));

    return (
        <Link href={`/events/${slug}`} className="block h-full group">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col border border-slate-100">
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Completed Badge */}
                    {isPast && (
                        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wide">
                            Completed
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    {/* Date */}
                    <div className="flex items-center text-slate-500 text-sm mb-3">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formattedDate}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {title}
                    </h3>

                    {/* Description */}
                    {description && (
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
