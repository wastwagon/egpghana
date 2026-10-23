import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const unreadOnly = req.nextUrl.searchParams.get('unread') === '1';
    const messages = await prisma.contact.findMany({
        where: unreadOnly ? { read: false } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 100,
    });

    return NextResponse.json({ messages });
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, read, replied } = body as { id?: string; read?: boolean; replied?: boolean };
    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const updated = await prisma.contact.update({
        where: { id },
        data: {
            ...(typeof read === 'boolean' ? { read } : {}),
            ...(typeof replied === 'boolean' ? { replied } : {}),
        },
    });

    return NextResponse.json({ message: updated });
}
