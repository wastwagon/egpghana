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
    const opportunity = await prisma.careerOpportunity.findUnique({
        where: { id: params.id },
        include: { _count: { select: { applications: true } } },
    });
    if (!opportunity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ opportunity });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const slug = body.slug
        ? String(body.slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '')
        : undefined;
    const opportunity = await prisma.careerOpportunity.update({
        where: { id: params.id },
        data: {
            title: body.title,
            slug,
            type: body.type,
            summary: body.summary,
            content: body.content,
            deadline: body.deadline ? new Date(body.deadline) : null,
            startDate: body.startDate ? new Date(body.startDate) : null,
            endDate: body.endDate ? new Date(body.endDate) : null,
            notifyEmail: body.notifyEmail,
            status: body.status,
        },
    });
    return NextResponse.json({ opportunity });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await prisma.careerOpportunity.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
