'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function WebVitalsReporter() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname?.startsWith('/admin') || pathname?.startsWith('/embed')) return;

        const report = (name: string, value: number) => {
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType: 'web_vital',
                    pageUrl: window.location.href,
                    metadata: { name, value: Math.round(value) },
                }),
                keepalive: true,
            }).catch(() => undefined);
        };

        try {
            const lcpObs = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const last = entries[entries.length - 1] as PerformanceEntry & { startTime?: number };
                if (last?.startTime) report('LCP', last.startTime);
            });
            lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });

            const clsObs = new PerformanceObserver((list) => {
                let cls = 0;
                for (const entry of list.getEntries()) {
                    const e = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
                    if (!e.hadRecentInput && e.value) cls += e.value;
                }
                if (cls > 0) report('CLS', cls * 1000);
            });
            clsObs.observe({ type: 'layout-shift', buffered: true });

            return () => {
                lcpObs.disconnect();
                clsObs.disconnect();
            };
        } catch {
            return undefined;
        }
    }, [pathname]);

    return null;
}
