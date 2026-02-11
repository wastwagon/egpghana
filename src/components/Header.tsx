'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navigation = [
        { name: 'Home', href: '/' },
        {
            name: 'About Us',
            href: '/about',
            children: [
                { name: 'About EGP', href: '/about' },
                { name: 'Our Staff', href: '/team' },
            ],
        },
        { name: 'Events', href: '/events' },
        { name: 'Resource Centre', href: '/resources' },
        { name: 'Programs', href: '/programs' },
        { name: 'Dashboards', href: '/dashboards' },
        { name: 'Contact Us', href: '/contact' },
    ];

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname?.startsWith(path);
    };

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 shadow-md">
            {/* Top Bar */}
            <div className="bg-primary-700 text-white py-2 text-sm border-b border-primary-600">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <p className="font-medium hidden sm:block">Economic Governance Platform</p>
                    <div className="flex items-center space-x-4">
                        <a href="mailto:info@egpghana.org" className="hover:text-blue-100 transition-colors flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span className="hidden md:inline">info@egpghana.org</span>
                        </a>
                        <div className="h-4 w-px bg-primary-500 hidden md:block"></div>
                        <div className="flex space-x-3">
                            <a href="https://twitter.com/egpghana" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                            </a>
                            <a href="https://facebook.com/egpghana" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                            </a>
                            <a href="https://linkedin.com/company/egpghana" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Menu Bar */}
            <nav className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 md:h-24">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="relative w-24 h-16 md:w-32 md:h-20 transition-transform duration-300 hover:scale-105">
                                    <Image
                                        src="/images/EGPLOGO.jpg"
                                        alt="EGP Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                        sizes="(max-width: 768px) 96px, 128px"
                                    />
                                </div>
                            </Link>
                        </div>

                        <div className="hidden lg:flex lg:items-center lg:space-x-4">
                            {navigation.map((item) => {
                                const active = isActive(item.href);

                                if (item.children) {
                                    return (
                                        <div key={item.name} className="relative group">
                                            <button
                                                className={`flex items-center space-x-1 px-1 py-4 text-[13px] xl:text-[15px] font-semibold uppercase tracking-wide transition-colors duration-300 ${active
                                                    ? 'text-primary-700'
                                                    : 'text-slate-600 hover:text-primary-700'
                                                    }`}
                                            >
                                                <span className="relative">
                                                    {item.name}
                                                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary-700 transform transition-transform duration-300 origin-left ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                                </span>
                                                <svg className={`w-4 h-4 ml-0.5 transition-transform duration-200 ${active ? 'text-primary-700' : 'text-slate-400 group-hover:text-primary-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div className="absolute left-0 mt-0 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50 overflow-hidden border-t-2 border-primary-600">
                                                <div className="py-2">
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href}
                                                            className="block px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-700 transition-colors uppercase tracking-wide"
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={item.name} className="relative group">
                                        <Link
                                            href={item.href}
                                            className={`relative block px-1 py-4 text-[13px] xl:text-[15px] font-semibold uppercase tracking-wide transition-colors duration-300 ${active
                                                ? 'text-primary-700'
                                                : 'text-slate-600 hover:text-primary-700'
                                                }`}
                                        >
                                            {item.name}
                                            <span className={`absolute bottom-3 left-0 w-full h-0.5 bg-primary-700 transform transition-transform duration-300 origin-left ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>


                        {/* Mobile menu button */}
                        <div className="lg:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary-700 hover:bg-slate-50 transition-colors"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!mobileMenuOpen ? (
                                    <svg
                                        className="block h-7 w-7"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="block h-7 w-7"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden border-t border-slate-100 animate-slide-down bg-white shadow-xl rounded-b-2xl overflow-y-auto max-h-[80vh]">
                            <div className="px-4 pt-2 pb-6 space-y-1">
                                {navigation.map((item) => {
                                    const active = isActive(item.href);

                                    if (item.children) {
                                        return (
                                            <div key={item.name} className="space-y-1">
                                                <div className="block px-4 py-2 text-base font-bold uppercase tracking-wide text-slate-800 bg-slate-50 rounded-lg mt-2">
                                                    {item.name}
                                                </div>
                                                <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-4">
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href}
                                                            className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-700 hover:bg-slate-50 rounded-md uppercase tracking-wide"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`block px-4 py-3 rounded-xl text-base font-medium uppercase tracking-wide transition-colors ${active
                                                ? 'bg-primary-50 text-primary-800'
                                                : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                                                }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}

                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
