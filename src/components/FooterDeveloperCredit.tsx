const OCEANCYBER_URL = 'https://oceancyber.net/';

export default function FooterDeveloperCredit() {
    return (
        <p className="mt-8 text-center text-xs sm:text-sm text-white/50 leading-relaxed max-w-2xl mx-auto">
            Designed and developed by{' '}
            <a
                href={OCEANCYBER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-medium text-white/75 hover:text-accent-teal transition-colors underline-offset-4 hover:underline"
                aria-label="OceanCyber (opens in new tab)"
            >
                OceanCyber
                <span className="text-white/40 group-hover:text-accent-teal/80" aria-hidden="true">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </span>
            </a>
        </p>
    );
}
