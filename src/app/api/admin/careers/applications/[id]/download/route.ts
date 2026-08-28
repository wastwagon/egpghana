import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { zipApplicationPackage } from '@/lib/career-application';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.careerApplication.findUnique({
        where: { id: params.id },
        include: { opportunity: { select: { title: true, slug: true } } },
    });
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const zip = await zipApplicationPackage(application, application.opportunity);
    const filename = `EOI-${application.applicantName.replace(/[^a-z0-9]+/gi, '-')}-${application.id.slice(0, 8)}.zip`;
    return new NextResponse(new Uint8Array(zip), {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}
