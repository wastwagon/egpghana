import { createClient } from 'redis';

type RedisLike = {
    isOpen: boolean;
    connect: () => Promise<unknown>;
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<unknown>;
    setEx: (key: string, seconds: number, value: string) => Promise<unknown>;
    incr: (key: string) => Promise<number>;
    expire: (key: string, seconds: number) => Promise<unknown>;
    del: (keys: string | string[]) => Promise<unknown>;
    keys: (pattern: string) => Promise<string[]>;
    on: (event: string, listener: (err: Error) => void) => void;
};

declare global {
    // eslint-disable-next-line no-var
    var __egpRedis: RedisLike | undefined;
    // eslint-disable-next-line no-var
    var __egpRedisConnect: Promise<RedisLike | null> | undefined;
}

function redisUrl() {
    return process.env.REDIS_URL?.trim() || '';
}

export function isRedisConfigured() {
    return Boolean(redisUrl());
}

/** Shared Redis client; returns null when REDIS_URL is unset or connection fails. */
export async function getRedis(): Promise<RedisLike | null> {
    const url = redisUrl();
    if (!url) return null;

    if (global.__egpRedis?.isOpen) {
        return global.__egpRedis;
    }

    if (!global.__egpRedisConnect) {
        global.__egpRedisConnect = (async () => {
            try {
                const client = createClient({ url }) as RedisLike;
                client.on('error', (err) => {
                    console.error('Redis client error:', err);
                });
                await client.connect();
                global.__egpRedis = client;
                return client;
            } catch (err) {
                console.warn('Redis unavailable; continuing without cache.', err);
                global.__egpRedisConnect = undefined;
                return null;
            }
        })();
    }

    return (await global.__egpRedisConnect) ?? null;
}
