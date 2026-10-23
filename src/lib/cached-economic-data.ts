import crypto from 'crypto';
import type { EconomicData, Prisma } from '@prisma/client';
import { PUBLIC_DATA_REVALIDATE_SECONDS } from '@/lib/cache-tags';
import { prisma } from '@/lib/prisma';
import { getRedis } from '@/lib/redis';

const CACHE_PREFIX = 'eco:';

type LatestWhere = Prisma.EconomicDataWhereInput;

function latestCacheKey(indicator: string, source?: string) {
    return `${CACHE_PREFIX}latest:${indicator}:${source ?? '_'}`;
}

function seriesCacheKey(where: Prisma.EconomicDataWhereInput, take: number | 'all', order: 'asc' | 'desc') {
    const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ where, take, order }))
        .digest('hex')
        .slice(0, 20);
    return `${CACHE_PREFIX}series:${hash}`;
}

async function loadSeriesFromCache(key: string): Promise<EconomicData[] | null> {
    const redis = await getRedis();
    if (!redis) return null;
    try {
        const cached = await redis.get(key);
        if (!cached) return null;
        const parsed = JSON.parse(cached) as CachedEconomicRow[];
        return parsed.map(fromCached);
    } catch (err) {
        console.warn('Redis get failed for economic series', err);
        return null;
    }
}

async function storeSeriesInCache(key: string, rows: EconomicData[]) {
    if (rows.length === 0) return;
    const redis = await getRedis();
    if (!redis) return;
    try {
        await redis.setEx(key, PUBLIC_DATA_REVALIDATE_SECONDS, JSON.stringify(rows.map(toCached)));
    } catch (err) {
        console.warn('Redis set failed for economic series', err);
    }
}

type CachedEconomicRow = Omit<EconomicData, 'date' | 'createdAt' | 'updatedAt'> & {
    date: string;
    createdAt: string;
    updatedAt: string;
};

function toCached(row: EconomicData): CachedEconomicRow {
    return {
        ...row,
        date: row.date.toISOString(),
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}

function fromCached(parsed: CachedEconomicRow): EconomicData {
    return {
        ...parsed,
        date: new Date(parsed.date),
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
    };
}

function serialize(row: EconomicData) {
    return JSON.stringify(toCached(row));
}

function deserialize(raw: string): EconomicData {
    return fromCached(JSON.parse(raw) as CachedEconomicRow);
}

/** Latest economic row with optional Redis cache (TTL matches public ISR). */
export async function findLatestEconomicData(
    indicator: string,
    source?: string,
): Promise<EconomicData | null> {
    const key = latestCacheKey(indicator, source);
    const redis = await getRedis();

    if (redis) {
        try {
            const cached = await redis.get(key);
            if (cached) return deserialize(cached);
        } catch (err) {
            console.warn('Redis get failed for economic data', err);
        }
    }

    const where: LatestWhere = source ? { indicator, source } : { indicator };
    const row = await prisma.economicData.findFirst({
        where,
        orderBy: { date: 'desc' },
    });

    if (redis && row) {
        try {
            await redis.setEx(key, PUBLIC_DATA_REVALIDATE_SECONDS, serialize(row));
        } catch (err) {
            console.warn('Redis set failed for economic data', err);
        }
    }

    return row;
}

/** Recent rows for charts (newest first, same take/order as dashboard pages). */
export async function findEconomicDataSeries(
    where: Prisma.EconomicDataWhereInput,
    take: number,
    order: 'asc' | 'desc' = 'desc',
): Promise<EconomicData[]> {
    const key = seriesCacheKey(where, take, order);
    const cached = await loadSeriesFromCache(key);
    if (cached) return cached;

    const rows = await prisma.economicData.findMany({
        where,
        orderBy: { date: order },
        take,
    });

    await storeSeriesInCache(key, rows);
    return rows;
}

export async function findAllEconomicData(
    where: Prisma.EconomicDataWhereInput,
    order: 'asc' | 'desc' = 'asc',
): Promise<EconomicData[]> {
    const key = seriesCacheKey(where, 'all', order);
    const cached = await loadSeriesFromCache(key);
    if (cached) return cached;

    const rows = await prisma.economicData.findMany({
        where,
        orderBy: { date: order },
    });

    await storeSeriesInCache(key, rows);
    return rows;
}

export async function invalidateEconomicDataCache() {
    const redis = await getRedis();
    if (!redis) return;

    try {
        const keys = await redis.keys(`${CACHE_PREFIX}*`);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    } catch (err) {
        console.warn('Redis invalidate failed for economic data', err);
    }
}
