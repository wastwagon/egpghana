/**
 * Serve uploaded files. Used as fallback when /uploads/* isn't served by Next.js
 * static handling (e.g. behind some reverse proxies).
 */
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

const MIME: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
};

export async function GET(
    _req: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const pathSegments = params.path;
    if (!pathSegments?.length) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const relativePath = pathSegments.join('/');
    // Prevent path traversal
    if (relativePath.includes('..') || path.isAbsolute(relativePath)) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const filePath = path.resolve(UPLOADS_DIR, relativePath);
    const uploadsDirResolved = path.resolve(UPLOADS_DIR);
    if (!filePath.startsWith(uploadsDirResolved)) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    try {
        const buffer = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (err) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
}
