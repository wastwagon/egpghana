import { PrismaClient } from '@prisma/client';

import Footer from '@/components/Footer';
import Link from 'next/link';
import EventsList from '@/components/events/EventsList';

const prisma = new PrismaClient();

export const metadata = {
    title: 'Events & Activities | EGP Ghana',
    description: 'Stay updated with EGP Ghana events, workshops, and activities',
};

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
    // Fetch all events, sorted by newest first (descending)
    // Fetch upcoming events
    const upcomingEvents = await prisma.event.findMany({
        where: { startDate: { gte: new Date() } },
        orderBy: { startDate: 'asc' },
    });

    // Fetch past events
    const pastEvents = await prisma.event.findMany({
        where: { startDate: { lt: new Date() } },
        orderBy: { startDate: 'desc' },
        take: 20, // Limit past events
    });

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative bg-primary-700 py-20 md:py-32">
                    <div className="container px-4 mx-auto">
                        <div className="max-w-3xl mr-auto text-left">
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 animate-fade-in text-white">
                                Events & Activities
                            </h1>
                            <p className="text-lg text-blue-100 animate-slide-up leading-relaxed max-w-2xl border-l-4 border-primary-500 pl-6">
                                Explore our latest workshops, seminars, and strategic meetings driving economic governance in Ghana.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Events List Component */}
                <EventsList upcomingEvents={upcomingEvents} pastEvents={pastEvents} />

                {/* Newsletter CTA - Modernized */}
                <section className="py-20 bg-slate-900 overflow-hidden relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="container px-4 mx-auto relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Stay Updated</h2>
                            <p className="mb-8 text-slate-300 text-lg">
                                Subscribe to our newsletter to receive updates about upcoming events and activities directly in your inbox.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 backdrop-blur-sm transition-all"
                                    required
                                />
                                <button type="submit" className="px-8 py-3.5 font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-lg hover:shadow-primary-500/25">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
