'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Check, Loader2, X, Upload, Link2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface MediaFile {
    name: string;
    url: string;
    size: number;
    type: 'image' | 'document';
    modified: string;
}

interface MediaLibraryProps {
    onSelect?: (url: string, file?: MediaFile) => void;
    onClose?: () => void;
    allowMultiple?: boolean;
    initialSelection?: string[];
    /** Limit visible files: images, documents, or all */
    filter?: 'image' | 'document' | 'all';
}

function getAbsoluteMediaUrl(path: string) {
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = (process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export default function MediaLibrary({
    onSelect,
    onClose,
    allowMultiple = false,
    initialSelection = [],
    filter = 'all',
}: MediaLibraryProps) {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState<string[]>(initialSelection);
    const [search, setSearch] = useState('');
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/media');
            const data = await res.json();
            if (data.files) {
                setFiles(data.files);
            }
        } catch (err) {
            setError('Failed to load media');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setError('');
        try {
            const res = await fetch('/api/media', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok && data.file) {
                setFiles(prev => [data.file, ...prev]);
                if (onSelect) {
                    onSelect(data.file.url, data.file);
                }
            } else {
                setError(data.details || data.error || 'Upload failed');
            }
        } catch (err) {
            setError('Upload error - check network');
        } finally {
            setUploading(false);
        }
    };

    const handleCopyUrl = async (e: React.MouseEvent, url: string) => {
        e.stopPropagation();
        const absolute = getAbsoluteMediaUrl(url);
        try {
            await navigator.clipboard.writeText(absolute);
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000);
        } catch {
            // Fallback for older browsers
            window.prompt('Copy link:', absolute);
        }
    };

    const handleSelect = (url: string) => {
        if (allowMultiple) {
            if (selected.includes(url)) {
                setSelected(prev => prev.filter(s => s !== url));
            } else {
                setSelected(prev => [...prev, url]);
            }
            return;
        }

        // Picker mode: return selection immediately
        if (onSelect) {
            const file = files.find(f => f.url === url);
            onSelect(url, file);
            if (onClose) onClose();
            return;
        }

        // Browse mode (Media admin page): select for Copy URL
        setSelected([url]);
    };

    const filteredFiles = files.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = filter === 'all' || f.type === filter;
        return matchesSearch && matchesType;
    });

    const acceptTypes = filter === 'document'
        ? 'application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
        : filter === 'image'
            ? 'image/*'
            : 'image/*,application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-[600px] w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Media Library</h2>
                    {filter !== 'all' && (
                        <p className="text-xs text-gray-500 mt-0.5">
                            Showing {filter === 'document' ? 'documents' : 'images'} only
                        </p>
                    )}
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Toolbar */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        Upload New
                        <input type="file" className="hidden" onChange={handleUpload} accept={acceptTypes} disabled={uploading} />
                    </label>
                </div>
            </div>

            {error && (
                <div className="px-4 py-2 text-sm text-red-700 bg-red-50 border-b border-red-100">{error}</div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-gray-500">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                        <p>No media found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredFiles.map((file) => (
                            <div
                                key={file.url}
                                className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selected.includes(file.url) ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'}`}
                                onClick={() => handleSelect(file.url)}
                            >
                                {file.type === 'image' ? (
                                    <Image
                                        src={file.url}
                                        alt={file.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                        unoptimized={file.url.startsWith('/uploads/') || file.url.startsWith('/assets/')}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-400">
                                        <span className="text-xs uppercase font-bold">{file.name.split('.').pop()}</span>
                                    </div>
                                )}

                                {/* Overlay info + copy link */}
                                <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                                    <p className="text-xs text-white truncate">{file.name}</p>
                                    <div className="flex items-center justify-between mt-1 gap-1">
                                        <p className="text-[10px] text-gray-300">{(file.size / 1024).toFixed(1)} KB</p>
                                        <button
                                            type="button"
                                            onClick={(e) => handleCopyUrl(e, file.url)}
                                            className="inline-flex items-center gap-1 text-[10px] text-white bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded"
                                            title="Copy public URL"
                                        >
                                            {copiedUrl === file.url ? (
                                                <>
                                                    <CheckCircle2 className="w-3 h-3 text-green-300" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Link2 className="w-3 h-3" />
                                                    Copy URL
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Selection Checkmark */}
                                {selected.includes(file.url) && (
                                    <div className="absolute top-2 right-2 p-1 bg-blue-600 rounded-full shadow-md">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer: multi-select OR browse-mode copy link */}
            {allowMultiple ? (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Cancel</button>
                    <button
                        onClick={() => {
                            if (onSelect) {
                                const file = files.find(f => f.url === selected[0]);
                                onSelect(selected[0], file);
                            }
                            if (onClose) onClose();
                        }}
                        className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Use Selected ({selected.length})
                    </button>
                </div>
            ) : !onSelect && selected[0] ? (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">File URL</p>
                        <p className="text-sm text-gray-900 dark:text-white truncate font-mono">
                            {getAbsoluteMediaUrl(selected[0])}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => handleCopyUrl(e, selected[0])}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md shrink-0"
                    >
                        {copiedUrl === selected[0] ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Link2 className="w-4 h-4" />
                                Copy URL
                            </>
                        )}
                    </button>
                </div>
            ) : null}
        </div>
    );
}
