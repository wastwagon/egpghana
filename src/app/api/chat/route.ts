import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { findRelevantContent } from '@/lib/ai';
import { z } from 'zod';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// export const runtime = 'edge'; // Disabled: Prisma requires Node.js runtime

export async function POST(req: Request) {
    const { messages } = await req.json();

    const lastUserMessage = messages[messages.length - 1];

    console.log('User asked:', lastUserMessage.content);

    let relevantContent: any[] = [];
    try {
        // Query the database via RAG
        relevantContent = await findRelevantContent(lastUserMessage.content);
        console.log(`Found ${relevantContent.length} relevant context items.`);

        // Debug: Log the titles of found content to verify relevance
        relevantContent.forEach(item => console.log('Context Source:', item.title));

    } catch (error) {
        console.error('Error in RAG search:', error);
    }

    const contextString = relevantContent
        .map((item: any) => `Title: ${item.title}\nContent: ${item.content || item.description}\nSource: ${item.slug || item.fileName}\n`)
        .join('\n---\n');

    const systemPrompt = `
You are the EGP Ghana Economic Assistant. Your role is to help citizens understand Ghana's economic situation.

Context from EGP Database:
${contextString}

Instructions:
- FIRST, check the "Context from EGP Database" above. If it contains the answer, use it and cite the sources.
- IF the database does not contain the answer (e.g., current exchange rates, breaking news, recent events), USE THE searchWeb TOOL to find the information.
- ALWAYS use the searchWeb tool for questions about "today", "current", or "latest" data if not in the context.
- Be concise, professional, and helpful.
- Format your response in Markdown.
`;

    const result = await streamText({
        model: openai('gpt-3.5-turbo'),
        messages,
        system: systemPrompt,
        tools: {
            searchWeb: tool({
                description: 'Search the web for real-time information like news, exchange rates, and current events. Use this when the provided context is insufficient.',
                parameters: z.object({
                    query: z.string().describe('The search query to find information about'),
                }),
                execute: async ({ query }: { query: string }) => {
                    console.log('Using search tool for:', query);
                    try {
                        const res = await fetch('https://google.serper.dev/search', {
                            method: 'POST',
                            headers: {
                                'X-API-KEY': process.env.SERPER_API_KEY || '',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ q: query })
                        });
                        const json = await res.json();
                        const results = json.organic?.slice(0, 4) || [];
                        return JSON.stringify(results.map((r: any) => ({
                            title: r.title,
                            link: r.link,
                            snippet: r.snippet
                        })));
                    } catch (error) {
                        console.error('Search tool error:', error);
                        return 'Failed to search the web.';
                    }
                },
            }),
        },
        maxSteps: 2,
    });

    return result.toTextStreamResponse();
}
