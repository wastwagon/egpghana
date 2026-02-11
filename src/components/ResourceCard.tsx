import Link from 'next/link';

interface ResourceCardProps {
    id: string;
    title: string;
    description?: string | null;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize?: number;
    category: string;
    publishedAt: Date;
}

export default function ResourceCard({
    id,
    title,
    description,
    fileUrl,
    fileName,
    fileType,
    fileSize,
    category,
    publishedAt,
    featured = false,
}: ResourceCardProps & { featured?: boolean }) {
    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        const mb = bytes / (1024 * 1024);
        if (mb < 1) {
            const kb = bytes / 1024;
            return `${kb.toFixed(1)} KB`;
        }
        return `${mb.toFixed(1)} MB`;
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(date));
    };

    const getFileIcon = () => {
        switch (fileType.toUpperCase()) {
            case 'PDF':
                return (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                        <path d="M14 2v6h6M9.5 13.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zM12 18H9v-2h3v2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
        }
    };

    return (
        <div className={`glass-card group hover:scale-105 transition-all duration-300 ${featured ? 'md:col-span-2' : ''}`}>
            <div className="flex items-start space-x-4">
                {/* File Icon */}
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-accent-red/20 flex items-center justify-center text-accent-red">
                    {getFileIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">


                    {/* Title */}
                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-primary-400 transition-colors mb-2 line-clamp-2">
                        {title}
                    </h3>

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                            {description}
                        </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>{fileType.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                            <span>{formatFileSize(fileSize)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(publishedAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <div className="flex-shrink-0">
                    <a
                        href={fileUrl}
                        download={fileName}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                        aria-label="Download"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
