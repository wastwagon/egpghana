import crypto from 'crypto';
import { OpenAI } from 'openai';
import { PUBLIC_DATA_REVALIDATE_SECONDS } from '@/lib/cache-tags';
import { getRedis } from '@/lib/redis';
import { prisma } from './prisma';

const RAG_CACHE_PREFIX = 'rag:context:';

function getOpenAI() {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await getOpenAI().embeddings.create({
            model: 'text-embedding-3-small',
            input: text.replace(/\n/g, ' '),
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

type RagResult = {
    id: string;
    title: string;
    slug?: string;
    content: string;
    similarity: number;
};

function ragCacheKey(query: string) {
    const normalized = query.trim().toLowerCase();
    const hash = crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 24);
    return `${RAG_CACHE_PREFIX}${hash}`;
}

export async function findRelevantContent(query: string) {
    const redis = await getRedis();
    const cacheKey = ragCacheKey(query);
    if (redis) {
        try {
            const cached = await redis.get(cacheKey);
            if (cached) return JSON.parse(cached) as RagResult[];
        } catch (err) {
            console.warn('Redis get failed for RAG context', err);
        }
    }

    const embedding = await generateEmbedding(query);
    const vectorQuery = `[${embedding.join(',')}]`;

    // Search Articles
    const articles = await prisma.$queryRaw`
    SELECT id, title, slug, content, 1 - (embedding <=> ${vectorQuery}::vector) as similarity
    FROM articles
    WHERE 1 - (embedding <=> ${vectorQuery}::vector) > 0.3
    ORDER BY similarity DESC
    LIMIT 3;
  ` as any[];

    // Search Resources
    const resources = await prisma.$queryRaw`
    SELECT id, title, description as content, "fileName" as slug, 1 - (embedding <=> ${vectorQuery}::vector) as similarity
    FROM resources
    WHERE 1 - (embedding <=> ${vectorQuery}::vector) > 0.3
    ORDER BY similarity DESC
    LIMIT 2;
  ` as any[];

    const results = [...articles, ...resources]
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 4) as RagResult[];

    if (redis && results.length > 0) {
        try {
            await redis.setEx(cacheKey, PUBLIC_DATA_REVALIDATE_SECONDS, JSON.stringify(results));
        } catch (err) {
            console.warn('Redis set failed for RAG context', err);
        }
    }

    return results;
}

/** Clear cached RAG retrieval results (e.g. after articles/resources change). */
export async function invalidateRagCache() {
    const redis = await getRedis();
    if (!redis) return;

    try {
        const keys = await redis.keys(`${RAG_CACHE_PREFIX}*`);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    } catch (err) {
        console.warn('Redis invalidate failed for RAG cache', err);
    }
}
