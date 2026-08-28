import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') return null;
    return session;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const application = await prisma.careerApplication.findUnique({
        where: { id: params.id },
        include: { opportunity: true },
    });
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ application });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const application = await prisma.careerApplication.update({
        where: { id: params.id },
        data: {
            status: body.status,
            notes: body.notes,
        },
    });
    return NextResponse.json({ application });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return PATCH(req, { params });
}
