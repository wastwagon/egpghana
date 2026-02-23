'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Check, Loader2, X, Upload } from 'lucide-react';
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
}

export default function MediaLibrary({ onSelect, onClose, allowMultiple = false, initialSelection = [] }: MediaLibraryProps) {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState<string[]>(initialSelection);
    const [search, setSearch] = useState('');

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
        try {
            const res = await fetch('/api/media', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.file) {
                setFiles(prev => [data.file, ...prev]);
                if (onSelect) {
                    onSelect(data.file.url);
                }
            } else {
                setError('Upload failed');
            }
        } catch (err) {
            setError('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (url: string) => {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;

        try {
            const res = await fetch('/api/media', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (res.ok) {
                setFiles(prev => prev.filter(f => f.url !== url));
            } else {
                alert('Cannot delete system assets or file in use.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelect = (url: string) => {
        if (allowMultiple) {
            if (selected.includes(url)) {
                setSelected(prev => prev.filter(s => s !== url));
            } else {
                setSelected(prev => [...prev, url]);
            }
        } else {
            if (onSelect) {
                const file = files.find(f => f.url === url);
                onSelect(url, file);
                if (onClose) onClose();
            }
        }
    };

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-[600px] w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Media Library</h2>
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
                    <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New
                        <input type="file" className="hidden" onChange={handleUpload} accept="image/*,application/pdf" />
                    </label>
                </div>
            </div>

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

                                {/* Overlay info */}
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                                    <p className="text-xs text-white truncate">{file.name}</p>
                                    <p className="text-[10px] text-gray-300">{(file.size / 1024).toFixed(1)} KB</p>
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

            {/* Footer if multiple selection */}
            {allowMultiple && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Cancel</button>
                    <button
                        onClick={() => { if (onSelect) onSelect(selected[0]); if (onClose) onClose(); }}
                        className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Use Selected ({selected.length})
                    </button>
                </div>
            )}
        </div>
    );
}
