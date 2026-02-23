import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');
const ASSETS_DIR = path.join(process.cwd(), 'public/assets');

interface MediaFile {
    name: string;
    path: string;
    url: string;
    size: number;
    modified: Date;
    type: 'image' | 'document' | 'other';
}

async function getFiles(dir: string, baseUrl: string): Promise<MediaFile[]> {
    let results: MediaFile[] = [];
    try {
        const list = await readdir(dir, { withFileTypes: true });
        for (const file of list) {
            const filePath = path.join(dir, file.name);
            const fileUrl = `${baseUrl}/${file.name}`;

            if (file.isDirectory()) {
                // Recursively scan subdirectories
                // check if hidden or specific ignored dirs
                if (!file.name.startsWith('.')) {
                    const subFiles = await getFiles(filePath, fileUrl);
                    results = results.concat(subFiles);
                }
            } else {
                // Filter for relevant files (images, pdfs)
                const ext = path.extname(file.name).toLowerCase();
                if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.doc', '.docx'].includes(ext)) {
                    const stats = await stat(filePath);
                    results.push({
                        name: file.name,
                        path: filePath, // internal path
                        url: fileUrl,   // public url
                        size: stats.size,
                        modified: stats.mtime,
                        type: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext) ? 'image' : 'document'
                    });
                }
            }
        }
    } catch (err) {
        // Directory might not exist, ignore
        console.warn(`Error scanning directory ${dir}:`, err);
    }
    return results;
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Scan both uploads and assets
        const uploads = await getFiles(UPLOADS_DIR, '/uploads');
        // We only scan assets/images to avoid scanning entire project assets if they are diverse
        const assets = await getFiles(path.join(ASSETS_DIR, 'images'), '/assets/images');

        const allFiles = [...uploads, ...assets].sort((a, b) => b.modified.getTime() - a.modified.getTime());

        return NextResponse.json({ files: allFiles });
    } catch (error) {
        console.error('Media fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Organize by Year/Month
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');

        const relativeDir = `${year}/${month}`;
        const targetDir = path.join(UPLOADS_DIR, relativeDir);

        await mkdir(targetDir, { recursive: true });

        // Create unique name - sanitize filename, fallback to "image" if empty/corrupted
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.name).toLowerCase() || '.jpg';
        let base = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase().replace(/-+/g, '-').replace(/(^-|-$)/g, '');
        if (!base || base.length > 100) base = 'image';
        const name = base + '-' + uniqueSuffix + ext;

        const filePath = path.join(targetDir, name);
        await writeFile(filePath, buffer);

        const url = `/uploads/${relativeDir}/${name}`;

        return NextResponse.json({
            file: {
                name,
                url,
                size: file.size,
                type: file.type.startsWith('image/') ? 'image' : 'document'
            }
        });

    } catch (error: unknown) {
        const err = error as NodeJS.ErrnoException;
        console.error('Upload error:', err);
        const msg = err?.code === 'EACCES' ? 'Permission denied - check uploads directory permissions' : err?.message || 'Upload failed';
        return NextResponse.json({ error: 'Upload failed', details: msg }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { url } = await req.json();

        if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

        // Security check: ensure path is within public/uploads or public/assets
        // We only allow deleting from public/uploads to prevent deleting system assets
        if (!url.startsWith('/uploads/')) {
            return NextResponse.json({ error: 'Cannot delete system assets' }, { status: 403 });
        }

        const filePath = path.join(process.cwd(), 'public', url);

        await unlink(filePath);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
