import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: { action?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const action = body.action;
    if (typeof action !== 'string' || !['migrate', 'seed', 'full', 'sync'].includes(action)) {
        return NextResponse.json(
            { error: 'Invalid action. Use: migrate, seed, full, or sync' },
            { status: 400 }
        );
    }

    const projectRoot = process.cwd();

    try {
        if (action === 'migrate') {
            const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
                cwd: projectRoot,
                env: { ...process.env },
            });
            return NextResponse.json({
                success: true,
                message: 'Migrations applied successfully',
                output: stdout + (stderr ? `\n${stderr}` : ''),
            });
        }

        if (action === 'seed') {
            const { stdout, stderr } = await execAsync('npx prisma db seed', {
                cwd: projectRoot,
                env: { ...process.env },
            });
            return NextResponse.json({
                success: true,
                message: 'Database seeded successfully',
                output: stdout + (stderr ? `\n${stderr}` : ''),
            });
        }

        if (action === 'sync') {
            // Ensure scripts/local_data_export.json exists before running sync
            const fs = await import('fs');
            const path = await import('path');
            const exportPath = path.join(projectRoot, 'scripts', 'local_data_export.json');
            if (!fs.existsSync(exportPath)) {
                return NextResponse.json({
                    error: 'local_data_export.json not found on server',
                    details: 'Export locally (npm run export:data), COMMIT the file, deploy, then run Sync.',
                }, { status: 400 });
            }
            const syncResult = await execAsync('npx tsx scripts/sync-from-export.ts', {
                cwd: projectRoot,
                env: { ...process.env },
            });
            const dashResult = await execAsync('npx tsx scripts/seed-dashboards-complete.ts', {
                cwd: projectRoot,
                env: { ...process.env },
            });
            return NextResponse.json({
                success: true,
                message: 'Sync completed. Articles/events merged, dashboards updated.',
                output: [
                    syncResult.stdout + (syncResult.stderr ? `\n${syncResult.stderr}` : ''),
                    dashResult.stdout + (dashResult.stderr ? `\n${dashResult.stderr}` : ''),
                ].join('\n---\n'),
            });
        }

        if (action === 'full') {
            // 1. Migrate
            await execAsync('npx prisma migrate deploy', {
                cwd: projectRoot,
                env: { ...process.env },
            });

            // 2. Push schema (sync any missing tables)
            await execAsync('npx prisma db push', {
                cwd: projectRoot,
                env: { ...process.env },
            });

            // 3. Seed
            const seedResult = await execAsync('npx prisma db seed', {
                cwd: projectRoot,
                env: { ...process.env },
            });

            // 4. Dashboard data
            const dashResult = await execAsync('npx tsx scripts/seed-dashboards-complete.ts', {
                cwd: projectRoot,
                env: { ...process.env },
            });

            return NextResponse.json({
                success: true,
                message: 'Full migration and seeding completed successfully',
                output: [
                    seedResult.stdout + (seedResult.stderr ? `\n${seedResult.stderr}` : ''),
                    dashResult.stdout + (dashResult.stderr ? `\n${dashResult.stderr}` : ''),
                ].join('\n---\n'),
            });
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    } catch (err: any) {
        const message = err?.message || 'Unknown error';
        const output = err?.stdout || err?.stderr || '';
        console.error('DB maintenance error:', err);
        return NextResponse.json(
            {
                error: 'Database operation failed',
                details: message,
                output: output || undefined,
            },
            { status: 500 }
        );
    }
}
