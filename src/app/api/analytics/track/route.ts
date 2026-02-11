
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { UAParser } from 'ua-parser-js';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            eventType, pageUrl, referrer, userAgent: uaString,
            sessionId, visitorId, firstSource, duration, scrollDepth, metadata
        } = body;

        if (!eventType || !pageUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const ipStr = ip.split(',')[0].trim();
        const dateStr = new Date().toISOString().split('T')[0];
        const ipHash = crypto.createHash('sha256').update(ipStr + dateStr).digest('hex');

        // Geo placeholder (since we are avoiding license keys for libraries like geoip-lite if they cause build pain)
        // In a real self-hosted, we could use a local DB or free API if allowed, but user said "don't want to use their license keys"
        // I will try to use 'geoip-country' again if it works, or just skip if it's too much trouble for this environment.
        // Let's stick to ua parsing and attribution logic which is "Advanced Premium".

        const parser = new UAParser(uaString || '');
        const browser = parser.getBrowser().name;
        const os = parser.getOS().name;
        let device = parser.getDevice().type || 'desktop';

        const urlObj = new URL(pageUrl, 'http://localhost');
        const source = urlObj.searchParams.get('utm_source') || urlObj.searchParams.get('ref') || null;
        const path = urlObj.pathname;

        // Create or Update Event
        // If it's a heartbeat, maybe we want to update the last 'page_view'?
        // But for simplicity and record keeping, we'll store individual records and aggregate.

        const event = await prisma.analyticsEvent.create({
            data: {
                eventType,
                pageUrl,
                path,
                referrer: referrer || null,
                source,
                firstSource: firstSource || null,
                userAgent: uaString || null,
                browser,
                os,
                device,
                ipHash,
                sessionId,
                visitorId,
                duration: duration ? parseInt(duration) : null,
                scrollDepth: scrollDepth ? parseInt(scrollDepth) : null,
                metadata: metadata || null,
            }
        });

        // Daily Stats Update
        if (eventType === 'page_view') {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            await prisma.dailyStats.upsert({
                where: { date: today },
                create: {
                    date: today,
                    views: 1,
                    visitors: 1,
                    sessions: 1
                },
                update: {
                    views: { increment: 1 }
                }
            });
        }

        return NextResponse.json({ success: true, eventId: event.id });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
