
import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
        icon?: LucideIcon;
    };
    children?: React.ReactNode;
}

export default function AdminPageHeader({ title, description, action, children }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                {description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
                )}
            </div>

            <div className="flex items-center gap-3">
                {children}

                {action && (
                    action.href ? (
                        <Link
                            href={action.href}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                            {action.label}
                        </Link>
                    ) : (
                        <button
                            onClick={action.onClick}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                            {action.label}
                        </button>
                    )
                )}
            </div>
        </div>
    );
}
