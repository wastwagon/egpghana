import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { onPublicContentChanged } from '@/lib/revalidate-content';

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return null;
    }
    return session;
}

export async function GET() {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const opportunities = await prisma.careerOpportunity.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { applications: true } } },
    });
    return NextResponse.json({ opportunities });
}

export async function POST(req: NextRequest) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const slug = String(body.slug || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/(^-|-$)/g, '');
    if (!body.title || !slug || !body.content) {
        return NextResponse.json({ error: 'Title, slug and content are required.' }, { status: 400 });
    }
    const created = await prisma.careerOpportunity.create({
        data: {
            title: body.title,
            slug,
            type: body.type || 'consultancy',
            summary: body.summary || null,
            content: body.content,
            deadline: body.deadline ? new Date(body.deadline) : null,
            startDate: body.startDate ? new Date(body.startDate) : null,
            endDate: body.endDate ? new Date(body.endDate) : null,
            notifyEmail: body.notifyEmail || 'egpghana20@gmail.com',
            status: body.status || 'open',
        },
    });
    await onPublicContentChanged({ careerSlug: created.slug });
    return NextResponse.json({ opportunity: created });
}
