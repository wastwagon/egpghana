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
    if (!['migrate', 'seed', 'full'].includes(action)) {
        return NextResponse.json(
            { error: 'Invalid action. Use: migrate, seed, or full' },
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
