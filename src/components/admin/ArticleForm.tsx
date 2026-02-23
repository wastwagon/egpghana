'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from './RichTextEditor';
import { Image as ImageIcon, Check, Loader2, X, Calendar, Upload } from 'lucide-react';
import Image from 'next/image';

import MediaLibrary from './MediaLibrary';

interface Category {
    id: string;
    name: string;
}

interface ArticleFormProps {
    initialData?: {
        id?: string;
        title: string;
        slug: string;
        content: string;
        excerpt?: string;
        categoryId: string;
        imageUrl?: string;
        publishedAt?: string;
        featured: boolean;
        tags: string[];
    };
    isEditing?: boolean;
}

export default function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        categoryId: initialData?.categoryId || '',
        imageUrl: initialData?.imageUrl || '',
        publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : '',
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
                } else {
                    console.error('Failed to load categories');
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title if creating new
        if (name === 'title' && !isEditing) {
            setForm(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleContentChange = (content: string) => {
        setForm(prev => ({ ...prev, content }));
    };

    const handleFeatureToggle = () => {
        setForm(prev => ({ ...prev, featured: !prev.featured }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            ...form,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        };

        try {
            const url = isEditing && initialData?.id
                ? `/api/articles/${initialData.id}`
                : '/api/articles';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin/publications');
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

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? 'Edit Publication' : 'New Publication'}
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
                        {isEditing ? 'Update Publication' : 'Publish Article'}
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
                    {/* Title */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg font-medium dark:bg-gray-700 dark:text-white"
                            placeholder="Enter article title..."
                        />

                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Slug (URL)</label>
                            <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    egpghana.org/articles/
                                </span>
                                <input
                                    type="text"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    required
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Content
                        </label>
                        <RichTextEditor
                            value={form.content}
                            onChange={handleContentChange}
                            placeholder="Write your article content here..."
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Excerpt
                        </label>
                        <textarea
                            name="excerpt"
                            rows={3}
                            value={form.excerpt}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            placeholder="Brief summary for listings and SEO..."
                        />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Publishing */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Publishing</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category
                                </label>
                                <select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                                <p className="mt-1 text-xs text-gray-500">Leave empty to save as draft</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Article</span>
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
                    </div>

                    {/* Featured Image */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Featured Image
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowMediaLibrary(true)}
                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                            >
                                Select from Library
                            </button>
                        </div>

                        {form.imageUrl ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                    src={form.imageUrl}
                                    alt="Featured"
                                    unoptimized={form.imageUrl.startsWith('/uploads/') || form.imageUrl.startsWith('/assets/')}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-600 hover:text-red-600 focus:outline-none"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowMediaLibrary(true)}
                                className="w-full mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <div className="space-y-1 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <span className="relative font-medium text-blue-600 hover:text-blue-500">
                                            Select Media
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </button>
                        )}
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
                            placeholder="Economy, Policy, Report (comma separated)"
                        />
                    </div>
                </div>
            </div>

            {/* Media Library Modal */}
            {showMediaLibrary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <MediaLibrary
                        onSelect={(url) => {
                            setForm(prev => ({ ...prev, imageUrl: url }));
                            setShowMediaLibrary(false);
                        }}
                        onClose={() => setShowMediaLibrary(false)}
                    />
                </div>
            )}
        </form>
    );
}
