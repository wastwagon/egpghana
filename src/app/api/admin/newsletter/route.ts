import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = req.nextUrl.searchParams.get('status') || 'active';
    const where =
        status === 'active' ? { active: true } : status === 'inactive' ? { active: false } : {};

    const subscribers = await prisma.newsletter.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        take: 500,
    });

    return NextResponse.json({ subscribers });
}
