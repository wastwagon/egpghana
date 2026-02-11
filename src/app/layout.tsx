import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import Header from "@/components/Header";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

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
    openGraph: {
        title: "Economic Governance Platform Ghana",
        description: "Promoting financial transparency and accountable governance in Ghana",
        url: "https://egpghana.org",
        siteName: "EGP Ghana",
        locale: "en_GH",
        type: "website",
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
    metadataBase: new URL('https://egpghana.org'),
    alternates: {
        canonical: '/',
    },
    verification: {
        google: 'google-site-verification-code', // Replace with actual code
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
            <body className="min-h-screen">
                <Header />
                {children}
                <ChatWidget />
                <Suspense fallback={null}>
                    <AnalyticsTracker />
                </Suspense>


            </body>
        </html>
    );
}
