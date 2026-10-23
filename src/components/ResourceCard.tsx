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
    title,
    description,
    fileUrl,
    fileName,
    fileType,
    fileSize,
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
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                        <path d="M14 2v6h6M9.5 13.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zM12 18H9v-2h3v2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
        }
    };

    return (
        <div className={`interactive-card p-5 ${featured ? 'md:col-span-2' : ''}`}>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700">
                    {getFileIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="section-label text-primary-700 mb-1">{fileType.toUpperCase()}</p>
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 line-clamp-2">{title}</h3>
                    {description && <p className="text-sm text-slate-600 line-clamp-2 mb-3">{description}</p>}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>{formatFileSize(fileSize)}</span>
                        <span>{formatDate(publishedAt)}</span>
                    </div>
                </div>

                <div className="flex-shrink-0 flex flex-col gap-2">
                    <a
                        href={fileUrl}
                        download={fileName}
                        className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors min-h-[44px] min-w-[44px]"
                        aria-label={`Download ${title}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </a>
                    <Link
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary-700 hover:underline text-center"
                    >
                        Open
                    </Link>
                </div>
            </div>
        </div>
    );
}
