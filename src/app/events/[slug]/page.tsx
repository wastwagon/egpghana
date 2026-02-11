import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const event = await prisma.event.findUnique({
        where: { slug: params.slug },
    });

    if (!event) {
        return {
            title: 'Event Not Found | EGP Ghana',
        };
    }

    return {
        title: `${event.title} | EGP Ghana`,
        description: event.description || event.title,
    };
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
    const event = await prisma.event.findUnique({
        where: { slug: params.slug },
    });

    if (!event) {
        notFound();
    }

    // Fetch upcoming events for suggestions
    const upcomingEvents = await prisma.event.findMany({
        where: {
            startDate: {
                gte: new Date(),
            },
            NOT: { id: event.id },
        },
        orderBy: { startDate: 'asc' },
        take: 3,
    });

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(date));
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const isPastEvent = new Date(event.startDate) < new Date();

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative bg-primary-700 py-20 md:py-32">
                    <div className="container px-4 mx-auto">
                        <div className="max-w-4xl mr-auto text-left">
                            {/* Breadcrumb */}
                            <div className="flex items-center space-x-2 text-sm text-blue-200 mb-6 animate-fade-in">
                                <a href="/events" className="hover:text-white transition-colors">Events</a>
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-white font-medium truncate max-w-xs">{event.title}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 animate-fade-in text-white leading-tight">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap gap-6 items-center text-lg text-blue-100 animate-slide-up leading-relaxed border-l-4 border-primary-500 pl-6">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(event.startDate)}
                                </div>
                                {event.location && (
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {event.location}
                                    </div>
                                )}
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${isPastEvent
                                    ? 'bg-slate-700 text-slate-300 border border-slate-600'
                                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    }`}>
                                    {isPastEvent ? 'Completed' : 'Upcoming'}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section py-12 md:py-20">
                    <div className="container px-4 mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Content - Left */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Featured Image */}
                                <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-video bg-slate-100">
                                    {event.imageUrl ? (
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">About This Event</h2>
                                    <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                                        <p className="whitespace-pre-wrap">{event.description || "No description provided."}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Right */}
                            <div className="space-y-6">
                                {/* Event Details Card */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-24">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Event Details</h3>

                                    <div className="space-y-6">
                                        {/* Date */}
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Date</p>
                                                <p className="text-slate-900 font-semibold text-lg">{formatDate(event.startDate)}</p>
                                                {event.endDate && (
                                                    <p className="text-slate-500 text-sm mt-1">to {formatDate(event.endDate)}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 mt-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Time</p>
                                                <p className="text-slate-900 font-semibold text-lg">{formatTime(event.startDate)}</p>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        {event.location && (
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0 mt-1">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Location</p>
                                                    <p className="text-slate-900 font-semibold text-lg">{event.location}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-100">
                                        <button
                                            disabled={isPastEvent}
                                            className={`w-full py-3 rounded-xl font-semibold transition-all ${isPastEvent
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20'
                                                }`}
                                        >
                                            Register for Event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Other Events Section */}
                        {upcomingEvents.length > 0 && (
                            <div className="mt-24 pt-12 border-t border-slate-200">
                                <h2 className="text-2xl font-bold text-slate-900 mb-8 font-heading">Other Upcoming Events</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {upcomingEvents.map((upcomingEvent) => (
                                        <EventCard
                                            key={upcomingEvent.id}
                                            id={upcomingEvent.id}
                                            slug={upcomingEvent.slug}
                                            title={upcomingEvent.title}
                                            description={upcomingEvent.description}
                                            startDate={upcomingEvent.startDate}
                                            endDate={upcomingEvent.endDate}
                                            location={upcomingEvent.location}
                                            imageUrl={upcomingEvent.imageUrl}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
