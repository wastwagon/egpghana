import { prisma } from '@/lib/prisma';
import { generateEmbedding, invalidateRagCache } from '@/lib/ai';

export type EmbeddingRefreshResult = {
    articles: number;
    resources: number;
};

/** Regenerate OpenAI embeddings for all articles and resources (for RAG chat). */
export async function refreshContentEmbeddings(): Promise<EmbeddingRefreshResult> {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not configured.');
    }

    const articles = await prisma.article.findMany({ select: { id: true, title: true, excerpt: true, content: true } });
    for (const article of articles) {
        const textToEmbed = `${article.title}\n\n${article.excerpt || ''}\n\n${article.content}`;
        const embedding = await generateEmbedding(textToEmbed);
        await prisma.$executeRaw`
            UPDATE articles
            SET embedding = ${JSON.stringify(embedding)}::vector
            WHERE id = ${article.id}
        `;
    }

    const resources = await prisma.resource.findMany({ select: { id: true, title: true, description: true } });
    for (const resource of resources) {
        const textToEmbed = `${resource.title}\n\n${resource.description || ''}`;
        const embedding = await generateEmbedding(textToEmbed);
        await prisma.$executeRaw`
            UPDATE resources
            SET embedding = ${JSON.stringify(embedding)}::vector
            WHERE id = ${resource.id}
        `;
    }

    await invalidateRagCache();

    return { articles: articles.length, resources: resources.length };
}

export async function embedArticleById(articleId: string) {
    if (!process.env.OPENAI_API_KEY) return;

    const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: { id: true, title: true, excerpt: true, content: true },
    });
    if (!article) return;

    const textToEmbed = `${article.title}\n\n${article.excerpt || ''}\n\n${article.content}`;
    const embedding = await generateEmbedding(textToEmbed);
    await prisma.$executeRaw`
        UPDATE articles
        SET embedding = ${JSON.stringify(embedding)}::vector
        WHERE id = ${article.id}
    `;
    await invalidateRagCache();
}

export async function embedResourceById(resourceId: string) {
    if (!process.env.OPENAI_API_KEY) return;

    const resource = await prisma.resource.findUnique({
        where: { id: resourceId },
        select: { id: true, title: true, description: true },
    });
    if (!resource) return;

    const embedding = await generateEmbedding(`${resource.title}\n\n${resource.description || ''}`);
    await prisma.$executeRaw`
        UPDATE resources
        SET embedding = ${JSON.stringify(embedding)}::vector
        WHERE id = ${resource.id}
    `;
    await invalidateRagCache();
}
