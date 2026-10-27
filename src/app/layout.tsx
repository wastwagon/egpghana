import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { absoluteAssetUrl, siteBaseUrl } from "@/lib/seo";
import type { Viewport } from "next";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const poppins = Poppins({
    weight: ["400", "500", "600", "700", "800"],
    subsets: ["latin"],
    variable: "--font-poppins",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Economic Governance Platform Ghana | EGP",
    description: "Empowering data-driven decisions through fiscal transparency, accountable governance, and citizen participation in Ghana's public finance management.",
    keywords: ["Ghana economy", "fiscal policy", "public debt", "IMF", "economic governance", "transparency"],
    authors: [{ name: "Economic Governance Platform" }],
    icons: {
        icon: [{ url: "/images/egp-mark.svg", type: "image/svg+xml" }],
        apple: [{ url: "/images/egp-icon-512.jpg", type: "image/jpeg", sizes: "512x512" }],
    },
    openGraph: {
        title: "Economic Governance Platform Ghana",
        description: "Promoting financial transparency and accountable governance in Ghana",
        url: "https://egpghana.org",
        siteName: "EGP Ghana",
        locale: "en_GH",
        type: "website",
        images: [
            {
                url: absoluteAssetUrl(null),
                width: 1200,
                height: 630,
                alt: "Economic Governance Platform Ghana",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Economic Governance Platform Ghana",
        description: "Promoting financial transparency and accountable governance in Ghana",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    metadataBase: new URL(siteBaseUrl()),
    alternates: {
        canonical: '/',
        languages: {
            'en-GH': siteBaseUrl(),
            'x-default': siteBaseUrl(),
        },
        types: {
            'application/rss+xml': [{ url: '/feed.xml', title: 'EGP Ghana RSS' }],
        },
    },
    ...(process.env.GOOGLE_SITE_VERIFICATION
        ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
        : {}),
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#00467e",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
            <body className="min-h-screen">
                <WebSiteJsonLd />
                <OrganizationJsonLd />
                <a href="#main-content" className="skip-link">Skip to main content</a>
                <Header />
                <div id="main-content">{children}</div>
                <ChatWidget />
                <Suspense fallback={null}>
                    <AnalyticsTracker />
                    <WebVitalsReporter />
                </Suspense>


            </body>
        </html>
    );
}
