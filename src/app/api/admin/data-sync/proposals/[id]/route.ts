import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { approveProposal, rejectProposal } from '@/lib/data-sync';

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const action = body.action as 'approve' | 'reject';
        const reviewer = session.user?.email || session.user?.name || 'admin';

        if (action === 'approve') {
            const proposal = await approveProposal(params.id, reviewer);
            return NextResponse.json({ ok: true, proposal });
        }
        if (action === 'reject') {
            const proposal = await rejectProposal(params.id, reviewer);
            return NextResponse.json({ ok: true, proposal });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('proposal review', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Review failed' },
            { status: 400 }
        );
    }
}
