import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { readFile } from 'fs/promises';
import path from 'path';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getUploadsDir } from '@/lib/uploads';
import { CareerAttachment } from '@/lib/career-application';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.careerApplication.findUnique({ where: { id: params.id } });
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const index = Number(new URL(req.url).searchParams.get('index') || 0);
    const files = Array.isArray(application.attachments) ? (application.attachments as CareerAttachment[]) : [];
    const file = files[index];
    if (!file) return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });

    const uploadsDir = path.resolve(getUploadsDir());
    const full = path.resolve(uploadsDir, file.relativePath);
    if (!full.startsWith(uploadsDir + path.sep)) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    try {
        const buffer = await readFile(full);
        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                'Content-Type': file.mime || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${file.originalName.replace(/"/g, '')}"`,
            },
        });
    } catch {
        return NextResponse.json({ error: 'File missing on disk' }, { status: 404 });
    }
}
