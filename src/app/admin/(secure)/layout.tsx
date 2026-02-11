import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { BarChart2, FileText, Settings, Users, LogOut, LayoutDashboard, PieChart, Activity, Calendar, Image as ImageIcon, Database, Target, TrendingUp } from 'lucide-react';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/admin/login');
    }

    if (session.user?.role !== 'admin') {
        redirect('/'); // Or a dedicated unauthorized page
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col shadow-sm z-10">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">EGP Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Analytics
                    </div>
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Overview</span>
                    </Link>
                    <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <PieChart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Detailed Reports</span>
                    </Link>

                    <div className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Content
                    </div>
                    <Link href="/admin/publications" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Publications</span>
                    </Link>
                    <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-medium">Categories</span>
                    </Link>
                    <Link href="/admin/events" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Events</span>
                    </Link>
                    <Link href="/admin/media" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Media</span>
                    </Link>
                    <Link href="/admin/resources" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <Database className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Resources</span>
                    </Link>
                    <Link href="/admin/dashboard/economic-data" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Macro Indicators</span>
                    </Link>
                    <Link href="/admin/dashboard/imf" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">IMF Tracker</span>
                    </Link>
                    <Link href="/admin/dashboard/debt" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Debt Tracker</span>
                    </Link>

                    <div className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        System
                    </div>
                    <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Users</span>
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all group">
                        <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group">
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center sticky top-0 z-20">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Console</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                            Logged in as <span className="font-semibold text-gray-800 dark:text-gray-200">{session.user?.name || 'Admin'}</span>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            {/* Placeholder Avatar */}
                            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
