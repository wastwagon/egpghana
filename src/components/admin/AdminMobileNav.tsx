'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Activity,
    Briefcase,
    Mail,
    Calendar,
    Database,
    FileText,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    Menu,
    PieChart,
    RefreshCw,
    Settings,
    Target,
    TrendingUp,
    Users,
    X,
} from 'lucide-react';

const navSections = [
    {
        label: 'Analytics',
        links: [
            { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
            { href: '/admin/analytics', label: 'Detailed Reports', icon: PieChart },
        ],
    },
    {
        label: 'Content',
        links: [
            { href: '/admin/publications', label: 'Publications', icon: FileText },
            { href: '/admin/categories', label: 'Categories', icon: FileText },
            { href: '/admin/events', label: 'Events', icon: Calendar },
            { href: '/admin/media', label: 'Media', icon: ImageIcon },
            { href: '/admin/resources', label: 'Resources', icon: Database },
            { href: '/admin/careers', label: 'Careers', icon: Briefcase },
            { href: '/admin/dashboard/economic-data', label: 'Macro Indicators', icon: Activity },
            { href: '/admin/dashboard/imf', label: 'IMF Tracker', icon: Target },
            { href: '/admin/dashboard/debt', label: 'Debt Tracker', icon: TrendingUp },
            { href: '/admin/dashboard/data-sync', label: 'Data Freshness', icon: RefreshCw },
        ],
    },
    {
        label: 'System',
        links: [
            { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
            { href: '/admin/contact', label: 'Contact', icon: Mail },
            { href: '/admin/users', label: 'Users', icon: Users },
            { href: '/admin/settings', label: 'Settings', icon: Settings },
        ],
    },
];

export default function AdminMobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <div className="md:hidden flex items-center gap-2">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                aria-label="Open admin menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex">
                    <button
                        type="button"
                        className="flex-1 bg-black/40"
                        aria-label="Close admin menu"
                        onClick={() => setOpen(false)}
                    />
                    <aside
                        className="w-[min(100%,20rem)] max-w-full h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-xl safe-top safe-bottom"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Admin navigation"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <span className="font-bold text-gray-900 dark:text-white">EGP Admin</span>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg"
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
                            {navSections.map((section) => (
                                <div key={section.label}>
                                    <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {section.label}
                                    </p>
                                    <div className="space-y-0.5">
                                        {section.links.map((link) => {
                                            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                                            const Icon = link.icon;
                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium min-h-[44px] ${
                                                        active
                                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                    }`}
                                                >
                                                    <Icon className="w-5 h-5 shrink-0" />
                                                    {link.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href="/api/auth/signout"
                                className="flex items-center gap-3 px-3 py-3 text-red-600 rounded-lg min-h-[44px] font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </Link>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
