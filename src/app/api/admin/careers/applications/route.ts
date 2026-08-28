import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { zipAllApplications } from '@/lib/career-application';

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') return null;
    return session;
}

export async function GET(req: NextRequest) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    if (searchParams.get('export') === 'all') {
        const rows = await prisma.careerApplication.findMany({
            include: { opportunity: { select: { title: true, slug: true } } },
            orderBy: { createdAt: 'desc' },
        });
        const zip = await zipAllApplications(rows.map((row) => ({ app: row, opportunity: row.opportunity })));
        return new NextResponse(new Uint8Array(zip), {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="egp-career-applications-${new Date().toISOString().slice(0, 10)}.zip"`,
            },
        });
    }

    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const opportunityId = searchParams.get('opportunityId') || '';
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 20)));

    const where: any = {};
    if (status) where.status = status;
    if (opportunityId) where.opportunityId = opportunityId;
    if (search) {
        where.OR = [
            { applicantName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [applications, total] = await Promise.all([
        prisma.careerApplication.findMany({
            where,
            include: { opportunity: { select: { title: true, slug: true } } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.careerApplication.count({ where }),
    ]);

    return NextResponse.json({
        applications,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
}
