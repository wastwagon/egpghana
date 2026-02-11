'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Calendar, Upload, X, Loader2, Download, Paperclip } from 'lucide-react';
import MediaLibrary from './MediaLibrary';

interface ResourceFormProps {
    initialData?: {
        id?: string;
        title: string;
        description?: string;
        fileUrl: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        category: string;
        publishedAt: string;
        featured: boolean;
        tags: string[];
    };
    isEditing?: boolean;
}

// Removed RESOURCE_CATEGORIES constant

export default function ResourceForm({ initialData, isEditing = false }: ResourceFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        fileUrl: initialData?.fileUrl || '',
        fileName: initialData?.fileName || '',
        fileType: initialData?.fileType || '',
        fileSize: initialData?.fileSize || 0,
        category: initialData?.category || '',
        publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        featured: initialData?.featured || false,
        tags: initialData?.tags.join(', ') || '',
    });

    useEffect(() => {
        // Fetch categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data);
                    // Set default category if not set and data exists
                    if (!form.category && data.length > 0) {
                        setForm(prev => ({ ...prev, category: data[0].name }));
                    }
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureToggle = () => {
        setForm(prev => ({ ...prev, featured: !prev.featured }));
    };

    const handleFileSelect = (url: string, name: string, size: number, type: string) => {
        // Infer type from extension
        const ext = name.split('.').pop()?.toUpperCase() || 'FILE';
        setForm(prev => ({
            ...prev,
            fileUrl: url,
            fileName: name,
            fileSize: size,
            fileType: ext,
            // Auto-fill title if empty
            title: prev.title || name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
        }));
        setShowMediaLibrary(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            ...form,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            publishedAt: new Date(form.publishedAt).toISOString(),
        };

        try {
            const url = isEditing && initialData?.id
                ? `/api/resources/${initialData.id}`
                : '/api/resources';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin/resources');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Submission failed');
        } finally {
            setLoading(false);
        }
    };

    // Helper to format bytes
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? 'Edit Resource' : 'New Resource'}
                </h1>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isEditing ? 'Update Resource' : 'Add Resource'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 text-red-700 bg-red-100 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* File Upload/Select */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Document File
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowMediaLibrary(true)}
                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                            >
                                Change / Select File
                            </button>
                        </div>

                        {form.fileUrl ? (
                            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm mr-4">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{form.fileName}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500 uppercase px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">{form.fileType}</span>
                                        <span className="text-xs text-gray-500">{formatBytes(form.fileSize)}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, fileUrl: '', fileName: '', fileSize: 0, fileType: '' }))}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowMediaLibrary(true)}
                                className="w-full mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <div className="space-y-2 text-center">
                                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                    <div className="text-sm text-gray-600">
                                        <span className="relative font-medium text-blue-600 hover:text-blue-500">
                                            Select a document
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF, DOCX, XLSX, PPTX</p>
                                </div>
                            </button>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                            The file URL will be saved. Ensure the file is publicly accessible.
                        </p>
                    </div>

                    {/* Basic Info */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md dark:bg-gray-700 dark:text-white"
                                placeholder="Public display title..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                value={form.description}
                                onChange={handleChange}
                                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="Brief description of the resource..."
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Publishing */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Publish Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="publishedAt"
                                    value={form.publishedAt}
                                    onChange={handleChange}
                                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</span>
                            <button
                                type="button"
                                onClick={handleFeatureToggle}
                                className={`${form.featured ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                <span
                                    className={`${form.featured ? 'translate-x-5' : 'translate-x-0'
                                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tags
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            placeholder="Economy, Policy (comma separated)"
                        />
                    </div>
                </div>
            </div>

            {/* Media Library Modal */}
            {showMediaLibrary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    {/* 
                        We need to update MediaLibrary to pass back file metadata onSelect. 
                        Since the current MediaLibrary onSelect is simplified prop: (url) => void,
                        we might need to update it or fetch metadata separately.
                        However, MediaLibrary has the data in its state.
                        Let's update MediaLibrary to pass back the whole file object or assume we update it.
                        For now, I'll update MediaLibrary component first to support passing full object.
                     */}
                    <MediaLibrary
                        onSelect={(url, file) => {
                            if (file) {
                                handleFileSelect(url, file.name, file.size, file.type);
                            } else {
                                handleFileSelect(url, url.split('/').pop() || 'File', 0, 'file');
                            }
                        }}
                        onClose={() => setShowMediaLibrary(false)}
                    />
                </div>
            )}
        </form>
    );
}
