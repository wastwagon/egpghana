import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { refreshContentEmbeddings } from '@/lib/embeddings-refresh';

function isAuthorized(req: NextRequest, session: { user?: { role?: string } } | null) {
    if (session?.user?.role === 'admin') return true;
    const cronSecret = process.env.CRON_SECRET || process.env.DATA_SYNC_SECRET;
    if (!cronSecret) return false;
    const header = req.headers.get('authorization');
    return header === `Bearer ${cronSecret}`;
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(req, session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await refreshContentEmbeddings();
        return NextResponse.json({ ok: true, ...result });
    } catch (error) {
        console.error('embeddings refresh', error);
        const message = error instanceof Error ? error.message : 'Embedding refresh failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
