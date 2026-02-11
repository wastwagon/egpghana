
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Refs to avoid unnecessary re-renders but keep tracking state
    const sessionIdRef = useRef<string | null>(null);
    const visitorIdRef = useRef<string | null>(null);
    const maxScrollRef = useRef(0);
    const startTimeRef = useRef(Date.now());
    const pageViewIdRef = useRef<string | null>(null);

    useEffect(() => {
        // 1. Initialize Long-term Visitor ID
        if (typeof window !== 'undefined') {
            let vid = localStorage.getItem('egp_v_id');
            if (!vid) {
                vid = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                localStorage.setItem('egp_v_id', vid);
                // Also store first source ever
                const params = new URLSearchParams(window.location.search);
                const source = params.get('utm_source') || params.get('ref') || 'direct';
                localStorage.setItem('egp_first_source', source);
            }
            visitorIdRef.current = vid;

            // 2. Initialize Session ID
            let sid = sessionStorage.getItem('egp_s_id');
            if (!sid) {
                sid = 's_' + Math.random().toString(36).substring(2, 15);
                sessionStorage.setItem('egp_s_id', sid);
            }
            sessionIdRef.current = sid;
        }

        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        startTimeRef.current = Date.now();
        maxScrollRef.current = 0;

        const trackEvent = async (eventType: string, extraData: any = {}) => {
            try {
                if (pathname.startsWith('/admin')) return null;

                const firstSource = localStorage.getItem('egp_first_source');

                const response = await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventType,
                        pageUrl: url,
                        referrer: document.referrer,
                        userAgent: navigator.userAgent,
                        sessionId: sessionIdRef.current,
                        visitorId: visitorIdRef.current,
                        firstSource,
                        ...extraData
                    }),
                    keepalive: true
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.eventId; // To link heartbeats if needed
                }
            } catch (err) {
                // Silently fail
            }
            return null;
        };

        // Track Page View
        const timer = setTimeout(async () => {
            pageViewIdRef.current = await trackEvent('page_view');
        }, 500);

        // Scroll Tracking
        const handleScroll = () => {
            const h = document.documentElement,
                b = document.body,
                st = 'scrollTop',
                sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            if (percent > maxScrollRef.current) {
                maxScrollRef.current = Math.round(percent);
            }
        };

        // Heartbeat / Engagement tracking
        const heartbeat = setInterval(() => {
            const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
            if (duration > 0 && duration % 30 === 0) { // Every 30s
                trackEvent('heartbeat', {
                    duration,
                    scrollDepth: maxScrollRef.current
                });
            }
        }, 10000);

        // Track on exit/navigation
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
                trackEvent('page_exit', {
                    duration,
                    scrollDepth: maxScrollRef.current
                });
            }
        };

        // Click Tracking (downloads/external)
        const handleClicks = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href) {
                    const isExternal = href.startsWith('http') && !href.includes(window.location.host);
                    const isFile = /\.(pdf|docx|xlsx|zip)$/i.test(href);
                    if (isFile) trackEvent('download', { metadata: { fileName: href.split('/').pop(), url: href } });
                    else if (isExternal) trackEvent('external_click', { metadata: { target: href } });
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('click', handleClicks);

        return () => {
            clearTimeout(timer);
            clearInterval(heartbeat);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('click', handleClicks);
        };
    }, [pathname, searchParams]);

    return null;
}
