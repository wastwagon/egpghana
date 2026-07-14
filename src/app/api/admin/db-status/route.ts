import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectRoot = process.cwd();

    try {
        // 1. Migration status
        let migrationStatus: 'current' | 'pending' | 'unknown' = 'unknown';
        let migrationDetail = '';

        try {
            const { stdout } = await execAsync('npx prisma migrate status', {
                cwd: projectRoot,
                env: { ...process.env },
            });
            const output = stdout.toLowerCase();
            if (output.includes('database schema is up to date') || output.includes('schema is up to date')) {
                migrationStatus = 'current';
                migrationDetail = 'Schema is up to date';
            } else if (output.includes('have not yet been applied') || output.includes('pending')) {
                migrationStatus = 'pending';
                migrationDetail = 'Pending migrations need to be applied';
            } else {
                migrationDetail = stdout.trim().split('\n').pop() || 'Unknown';
            }
        } catch (err: any) {
            // Exit code 1 often means pending migrations
            const output = (err.stdout || err.stderr || err.message || '').toLowerCase();
            if (output.includes('have not yet been applied') || output.includes('pending')) {
                migrationStatus = 'pending';
                migrationDetail = 'Pending migrations need to be applied';
            } else {
                migrationDetail = err.stderr || err.message || 'Could not check';
            }
        }

        // 2. Data status: compare export file vs DB
        let dataStatus: 'current' | 'needs_sync' | 'no_export' | 'unknown' = 'unknown';
        let dataDetail = '';
        let exportArticles = 0;
        let exportEvents = 0;
        let dbArticles = 0;
        let dbEvents = 0;

        const exportPath = path.join(projectRoot, 'scripts', 'local_data_export.json');
        if (fs.existsSync(exportPath)) {
            try {
                const exported = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
                exportArticles = exported.articles?.length ?? 0;
                exportEvents = exported.events?.length ?? 0;

                const [articlesCount, eventsCount] = await Promise.all([
                    prisma.article.count(),
                    prisma.event.count(),
                ]);
                dbArticles = articlesCount;
                dbEvents = eventsCount;

                // Consider "needs sync" if export has more content than DB, or counts differ significantly
                const articleDiff = exportArticles - dbArticles;
                const eventDiff = exportEvents - dbEvents;

                if (articleDiff > 0 || eventDiff > 0) {
                    dataStatus = 'needs_sync';
                    dataDetail = `Export has ${exportArticles} articles, ${exportEvents} events. DB has ${dbArticles} articles, ${dbEvents} events. Run Sync to update.`;
                } else if (articleDiff < 0 || eventDiff < 0) {
                    // DB has more (production-only content) - still "current" from sync perspective
                    dataStatus = 'current';
                    dataDetail = `DB: ${dbArticles} articles, ${dbEvents} events. Export: ${exportArticles} articles, ${exportEvents} events.`;
                } else {
                    dataStatus = 'current';
                    dataDetail = `${dbArticles} articles, ${dbEvents} events. In sync with export.`;
                }
            } catch (e) {
                dataStatus = 'unknown';
                dataDetail = 'Could not compare export with database';
            }
        } else {
            dataStatus = 'no_export';
            dataDetail = 'No local_data_export.json on server. Export locally, commit, deploy, then Sync.';
        }

        // 3. Uploads persistence (Coolify volume) + broken image URLs
        const { getUploadsDir, isUploadsDirMounted } = await import('@/lib/uploads');
        const uploadsDir = getUploadsDir();
        const uploadsPersistent = isUploadsDirMounted();
        let uploadFileCount = 0;
        let brokenImageUrls = 0;
        try {
            const { readdir } = await import('fs/promises');
            async function countFiles(dir: string): Promise<number> {
                let n = 0;
                try {
                    const entries = await readdir(dir, { withFileTypes: true });
                    for (const e of entries) {
                        const p = path.join(dir, e.name);
                        if (e.isDirectory()) n += await countFiles(p);
                        else n += 1;
                    }
                } catch {
                    // missing dir
                }
                return n;
            }
            uploadFileCount = await countFiles(uploadsDir);

            const articles = await prisma.article.findMany({
                where: { imageUrl: { startsWith: '/uploads/' } },
                select: { imageUrl: true },
            });
            const events = await prisma.event.findMany({
                where: { imageUrl: { startsWith: '/uploads/' } },
                select: { imageUrl: true },
            });
            for (const row of [...articles, ...events]) {
                if (!row.imageUrl) continue;
                const rel = row.imageUrl.replace(/^\/uploads\//, '');
                const filePath = path.join(uploadsDir, rel);
                if (!fs.existsSync(filePath)) brokenImageUrls += 1;
            }
        } catch {
            // non-fatal
        }

        return NextResponse.json({
            migration: { status: migrationStatus, detail: migrationDetail },
            data: {
                status: dataStatus,
                detail: dataDetail,
                exportArticles,
                exportEvents,
                dbArticles,
                dbEvents,
            },
            uploads: {
                persistent: uploadsPersistent,
                path: uploadsDir,
                fileCount: uploadFileCount,
                brokenImageUrls,
                detail: uploadsPersistent
                    ? `Volume OK at ${uploadsDir} (${uploadFileCount} files). ${brokenImageUrls} DB image URL(s) missing on disk.`
                    : `NOT on a Docker volume — images will vanish on every redeploy. Mount /data/uploads in Coolify and set UPLOADS_DIR=/data/uploads. ${brokenImageUrls} broken URL(s) now.`,
            },
        });
    } catch (err: any) {
        console.error('DB status error:', err);
        return NextResponse.json(
            { error: 'Failed to check status', details: err?.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
