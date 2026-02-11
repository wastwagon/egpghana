import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

import { prisma } from './prisma';

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text.replace(/\n/g, ' '),
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

export async function findRelevantContent(query: string) {
    const embedding = await generateEmbedding(query);
    const vectorQuery = `[${embedding.join(',')}]`;

    // Search Articles
    const articles = await prisma.$queryRaw`
    SELECT id, title, slug, content, 1 - (embedding <=> ${vectorQuery}::vector) as similarity
    FROM articles
    WHERE 1 - (embedding <=> ${vectorQuery}::vector) > 0.1
    ORDER BY similarity DESC
    LIMIT 3;
  ` as any[];

    // Search Resources
    const resources = await prisma.$queryRaw`
    SELECT id, title, description as content, "fileName" as slug, 1 - (embedding <=> ${vectorQuery}::vector) as similarity
    FROM resources
    WHERE 1 - (embedding <=> ${vectorQuery}::vector) > 0.1
    ORDER BY similarity DESC
    LIMIT 2;
  ` as any[];

    return [...articles, ...resources].sort((a, b) => b.similarity - a.similarity).slice(0, 4);
}
