'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Mail, Save, Loader2, Shield, AlertCircle, CheckCircle, Database, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState('profile');
    const [dbAction, setDbAction] = useState<'idle' | 'migrate' | 'seed' | 'full' | 'sync'>('idle');
    const [dbOutput, setDbOutput] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setFetching(true);
        try {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (res.ok) {
                setForm(prev => ({
                    ...prev,
                    name: data.name || '',
                    email: data.email || '',
                }));
            }
        } catch (err) {
            console.error('Failed to load profile');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (activeTab === 'security') {
            if (form.newPassword && form.newPassword !== form.confirmPassword) {
                setError('New passwords do not match');
                setLoading(false);
                return;
            }
            if (form.newPassword && !form.currentPassword) {
                setError('Current password is required to change password');
                setLoading(false);
                return;
            }
        }

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Settings updated successfully');
                // Clear password fields
                setForm(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }));
                // Update session if needed
                if (data.name !== session?.user?.name) {
                    await update({ name: data.name });
                }
                router.refresh();
            } else {
                setError(data.error || 'Failed to update settings');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const runDbAction = async (action: 'migrate' | 'seed' | 'full' | 'sync') => {
        const confirmMsg = action === 'full'
            ? 'Run full restore (migrations + seed + dashboard data)? This will WIPE and replace all articles/events.'
            : action === 'seed'
                ? 'Run database seeding? This will WIPE and replace articles/events.'
                : action === 'sync'
                    ? 'Sync from local_data_export.json? This MERGES articles/events (no wipe). Production-only posts are preserved.'
                    : 'Run database migrations?';
        if (!confirm(confirmMsg)) return;

        setDbAction(action);
        setDbOutput('');
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/admin/db-maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || 'Operation completed successfully');
                setDbOutput(data.output || '');
            } else {
                setError(data.error || data.details || 'Operation failed');
                setDbOutput(data.output || '');
            }
        } catch (err) {
            setError('Failed to run operation. Please try again.');
        } finally {
            setDbAction('idle');
        }
    };

    if (fetching) {
        return (
            <div className="flex h-96 justify-center items-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">

            <AdminPageHeader
                title="Settings"
                description="Manage your account settings and preferences."
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <User className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeTab === 'security'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <Shield className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === 'security' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab('database')}
                            className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeTab === 'database'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <Database className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === 'database' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            Database
                        </button>
                    </nav>
                </div>

                <div className="p-8">
                    {message && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Full Name
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white py-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email Address
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white py-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="space-y-6 max-w-lg">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Current Password
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                id="currentPassword"
                                                value={form.currentPassword}
                                                onChange={handleChange}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white py-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            New Password
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                id="newPassword"
                                                value={form.newPassword}
                                                onChange={handleChange}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white py-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Confirm New Password
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white py-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Password Requirements</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Minimum 8 characters</li>
                                            <li>At least one special character</li>
                                            <li>At least one number</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'database' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
                                    <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-2">Sync checklist (local → production):</p>
                                    <ol className="text-sm text-amber-800 dark:text-amber-200 list-decimal list-inside space-y-1">
                                        <li>Locally: <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">npm run export:data</code></li>
                                        <li>Commit <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">scripts/local_data_export.json</code></li>
                                        <li>Push and deploy</li>
                                        <li>Click Sync below</li>
                                    </ol>
                                    <p className="text-sm text-amber-800 dark:text-amber-200 mt-2">
                                        <strong>Sync</strong> merges articles/events (no wipe). <strong>Full Restore</strong> wipes and replaces all content.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <button
                                        type="button"
                                        onClick={() => runDbAction('migrate')}
                                        disabled={dbAction !== 'idle'}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {dbAction === 'migrate' ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                        )}
                                        Run Migrations
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => runDbAction('seed')}
                                        disabled={dbAction !== 'idle'}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {dbAction === 'seed' ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Database className="w-4 h-4 mr-2" />
                                        )}
                                        Run Seed
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => runDbAction('sync')}
                                        disabled={dbAction !== 'idle'}
                                        className="inline-flex items-center px-4 py-2 border border-green-300 dark:border-green-700 rounded-md shadow-sm text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {dbAction === 'sync' ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                        )}
                                        Sync (Merge from Export)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => runDbAction('full')}
                                        disabled={dbAction !== 'idle'}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {dbAction === 'full' ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                        )}
                                        Full Restore (Wipe + Replace)
                                    </button>
                                </div>

                                {dbOutput && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output</label>
                                        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-x-auto max-h-48 overflow-y-auto font-mono whitespace-pre-wrap">
                                            {dbOutput}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab !== 'database' && (
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
