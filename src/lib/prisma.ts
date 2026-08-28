import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createClient() {
    return new PrismaClient({
        log: ['error'],
    });
}

function getClient() {
    const existing = globalForPrisma.prisma;
    // Recreate after `prisma generate` in a long-lived Next.js process
    if (existing && typeof (existing as { careerOpportunity?: { findMany?: unknown } }).careerOpportunity?.findMany === 'function') {
        return existing;
    }
    return createClient();
}

export const prisma = getClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
