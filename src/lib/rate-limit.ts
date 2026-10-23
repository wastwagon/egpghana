import { getRedis } from '@/lib/redis';

const memory = new Map<string, { count: number; resetAt: number }>();

/** Returns true when the request is allowed. */
export async function consumeRateLimit(
    key: string,
    limit: number,
    windowSeconds: number,
): Promise<boolean> {
    const redis = await getRedis();
    const redisKey = `rl:${key}`;

    if (redis) {
        try {
            const count = await redis.incr(redisKey);
            if (count === 1) {
                await redis.expire(redisKey, windowSeconds);
            }
            return count <= limit;
        } catch {
            /* fall through */
        }
    }

    const now = Date.now();
    const bucket = memory.get(key);
    if (!bucket || now > bucket.resetAt) {
        memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
        return true;
    }
    if (bucket.count >= limit) return false;
    bucket.count += 1;
    return true;
}

export function clientIp(req: Request) {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return req.headers.get('x-real-ip') || 'unknown';
}
