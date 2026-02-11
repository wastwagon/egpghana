import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        about: [
            { name: 'About EGP', href: '/about' },
            { name: 'Our Team', href: '/team' },
            { name: 'Contact Us', href: '/contact' },
        ],
        resources: [
            { name: 'Publications', href: '/resources' },
            { name: 'Data Dashboards', href: '/dashboards' },
            { name: 'Events', href: '/events' },
            { name: 'News & Updates', href: '/resources' },
        ],
        quickLinks: [
            { name: 'Public Debt Tracker', href: '/dashboards/debt' },
            { name: 'IMF Bailout Monitor', href: '/dashboards/imf' },
            { name: 'Economy Dashboard', href: '/dashboards/economy' },
            { name: 'Policy Dialogues', href: '/programs' },
        ],
        actualPrograms: [
            { name: 'Economic Policy Research', href: '/programs' },
            { name: 'Fiscal Transparency', href: '/programs' },
            { name: 'Open Data Tools', href: '/programs' },
            { name: 'Citizen Engagement', href: '/programs' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
        ],
    };

    return (
        <footer className="bg-primary-900 border-t border-primary-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <p className="text-white text-sm leading-relaxed mb-6 max-w-sm">
                            Empowering citizens with data-driven insights on Ghana's economic governance, fiscal policy, and public debt management.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com/egpghana"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/70 hover:text-white text-sm transition-colors"
                                aria-label="Twitter"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a
                                href="https://facebook.com/egpghana"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/70 hover:text-white text-sm transition-colors"
                                aria-label="Facebook"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a
                                href="https://linkedin.com/company/egpghana"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/70 hover:text-white text-sm transition-colors"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* About Links */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
                            About
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.about.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links (Formerly Programs) */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actual Programs */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
                            Programs
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.actualPrograms.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-primary-900/20">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-white text-sm text-center md:text-left">
                            © {currentYear} Economic Governance Platform Ghana. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
                            {footerLinks.legal.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-white hover:text-white text-sm transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
