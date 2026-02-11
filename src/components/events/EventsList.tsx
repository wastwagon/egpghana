"use client";

import { useState } from 'react';
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

interface EventsListProps {
    upcomingEvents: Event[];
    pastEvents: Event[];
}

export default function EventsList({ upcomingEvents, pastEvents }: EventsListProps) {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const eventsToShow = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container px-4 mx-auto">
                {/* Filter Controls */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming'
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            Upcoming Events
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'past'
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            Past Events
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                {eventsToShow.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
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
                    <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto animate-fade-in">
                        <div className="w-20 h-20 mb-6 text-slate-300 rounded-full bg-slate-50 flex items-center justify-center">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-slate-900">No {activeTab} events found</h3>
                        <p className="text-slate-500">
                            {activeTab === 'upcoming'
                                ? "We don't have any upcoming events scheduled at the moment. Please check back later."
                                : "No past events are available in the archive."}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
