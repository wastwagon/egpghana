
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line: string) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
            process.env[key] = value;
        }
    });
}

import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.replace(/\n/g, ' '),
    });
    return response.data[0].embedding;
}

async function main() {
    console.log('🧠 Generating embeddings for content...');

    const articles = await prisma.article.findMany();

    console.log(`Found ${articles.length} articles to embed.`);

    for (const article of articles) {
        const textToEmbed = `${article.title}\n\n${article.excerpt || ''}\n\n${article.content}`;
        const embedding = await generateEmbedding(textToEmbed);

        // Update with raw query because Prisma doesn't natively support vector types in update yet
        await prisma.$executeRaw`
            UPDATE articles
            SET embedding = ${JSON.stringify(embedding)}::vector
            WHERE id = ${article.id}
        `;
        console.log(`✅ Embedded article: ${article.title}`);
    }

    const resources = await prisma.resource.findMany();

    console.log(`Found ${resources.length} resources to embed.`);

    for (const resource of resources) {
        const textToEmbed = `${resource.title}\n\n${resource.description || ''}`;
        const embedding = await generateEmbedding(textToEmbed);

        await prisma.$executeRaw`
            UPDATE resources
            SET embedding = ${JSON.stringify(embedding)}::vector
            WHERE id = ${resource.id}
        `;
        console.log(`✅ Embedded resource: ${resource.title}`);
    }

    console.log('🎉 Embedding generation complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
