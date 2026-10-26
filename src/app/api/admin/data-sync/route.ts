import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSyncDashboard, runDataSync, type SyncSourceKey } from '@/lib/data-sync';
import { onEconomicDataChanged } from '@/lib/revalidate-public';

function isAuthorized(req: NextRequest, session: { user?: { role?: string } } | null) {
    if (session?.user?.role === 'admin') return true;
    const cronSecret = process.env.CRON_SECRET || process.env.DATA_SYNC_SECRET;
    if (!cronSecret) return false;
    const header = req.headers.get('authorization');
    return header === `Bearer ${cronSecret}`;
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(req, session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await getSyncDashboard();
        return NextResponse.json(data);
    } catch (error) {
        console.error('data-sync GET', error);
        return NextResponse.json({ error: 'Failed to load sync status' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(req, session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json().catch(() => ({}));
        const source = (body.source || 'all') as SyncSourceKey;
        const allowed: SyncSourceKey[] = [
            'all',
            'gss_cpi',
            'gss_qgdp',
            'bog_homepage',
            'bog_tbill',
            'bog_sefd',
            'world_bank',
            'mof_midyear',
            'mof_watcher',
        ];
        if (!allowed.includes(source)) {
            return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
        }

        const result = await runDataSync(source);
        await onEconomicDataChanged();
        return NextResponse.json({ ok: true, ...result });
    } catch (error) {
        console.error('data-sync POST', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
