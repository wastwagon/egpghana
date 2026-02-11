import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // New Professional Theme
                primary: {
                    50: '#f0f6fa',
                    100: '#e1eff8',
                    200: '#c5e0f3',
                    300: '#9cc7eb',
                    400: '#6ca6e0',
                    500: '#005fae', // Brighter for buttons
                    600: '#005296',
                    700: '#00467e', // Main Brand Color (Deep Blue)
                    800: '#003a69',
                    900: '#002e53',
                },
                secondary: '#aec8d9', // Pale Blue
                accent: {
                    DEFAULT: '#55c4cd', // Teal (Main Accent)
                    teal: '#55c4cd',
                    red: '#ce1126',
                    yellow: '#fcd116',
                    green: '#006b3f',
                },
                dark: {
                    900: '#050a14', // Very dark blue-black instead of neutral black
                    800: '#0f172a', // Slate-900 like
                    700: '#1e293b',
                    600: '#334155',
                    500: '#475569',
                },
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#55c4cd', // Map info to accent
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
                heading: ['var(--font-poppins)', 'Poppins', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'Courier New', 'monospace'],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.5' }],
                sm: ['0.875rem', { lineHeight: '1.5' }],
                base: ['1rem', { lineHeight: '1.5' }],
                lg: ['1.125rem', { lineHeight: '1.5' }],
                xl: ['1.25rem', { lineHeight: '1.5' }],
                '2xl': ['1.5rem', { lineHeight: '1.25' }],
                '3xl': ['1.875rem', { lineHeight: '1.25' }],
                '4xl': ['2.25rem', { lineHeight: '1.25' }],
                '5xl': ['3rem', { lineHeight: '1.1' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                lg: '12px',
                md: '8px',
                sm: '4px',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
                'glow': '0 0 20px rgba(0, 102, 204, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
};

export default config;
