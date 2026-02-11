"use client";

import { useState } from 'react';
import Link from 'next/link';
import EventCard from '@/components/EventCard';

interface Event {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
    location: string | null;
    imageUrl: string | null;
}

interface HomeEventsSectionProps {
    upcomingEvents: Event[];
    pastEvents: Event[];
}

export default function HomeEventsSection({ upcomingEvents, pastEvents }: HomeEventsSectionProps) {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const eventsToShow = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    return (
        <section className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-6">
                            {activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {activeTab === 'upcoming'
                                ? "Join our policy dialogues, town hall meetings, and workshops fostering inclusive economic governance."
                                : "Explore our archive of past events, reports, and community engagements."}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        {/* Toggle Buttons */}
                        <div className="inline-flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                            <button
                                onClick={() => setActiveTab('upcoming')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming'
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'past'
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                            >
                                Past
                            </button>
                        </div>

                        <Link href="/events" className="group inline-flex items-center text-primary-700 font-bold text-sm hover:text-primary-900 transition-colors">
                            View All Events
                            <div className="ml-2 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                <svg className="w-4 h-4 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Events Grid */}
                {eventsToShow.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {eventsToShow.map((event) => (
                            <EventCard
                                key={event.id}
                                id={event.id}
                                slug={event.slug}
                                title={event.title}
                                description={event.description}
                                startDate={event.startDate}
                                endDate={event.endDate}
                                location={event.location}
                                imageUrl={event.imageUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto">
                        <div className="w-16 h-16 mb-4 text-slate-300 rounded-full bg-slate-50 flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900">No {activeTab} events found</h3>
                        <p className="text-slate-500">
                            Check back later for updates.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
