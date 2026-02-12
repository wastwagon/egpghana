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

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const systemPrompt = `
You are the EGP Ghana Economic Assistant. Your role is identify yourself as a representative of the Economic Governance Platform (EGP).

CURRENT DATE: ${currentDate} (Current Year: 2026).

Context from EGP Database:
${contextString}

Instructions for Best Practice Response:
1. CITATION RULES:
   - If using information from the "EGP Database" context, highlight the source using markdown links.
   - For Articles: Use [Title](/articles/slug)
   - For Resources/Reports: Use [Title](/resources/slug)
   - Do NOT make up links. Only use slugs provided in the context.

2. ACCURACY & TIME-AWARENESS:
   - Ghanaians want 2026 data. If the context has 2023/2024 data, label it as "According to 2023 reports..." and THEN trigger the 'searchWeb' tool to get 2026 updates.
   - If 'searchWeb' finds 2026 data, prioritize it in your answer.

3. STRUCTURE:
   - Use Markdown (bolding, lists, tables) for readability.
   - Be concise but authoritative.

4. WEB SEARCH:
   - Use 'searchWeb' for exchange rates, current inflation, breaking news, or if the provided context is more than 1 year old.
`;

    const result = await streamText({
        model: openai('gpt-4o-mini'), // Switched to gpt-4o-mini for much better tool handling and clean text
        messages,
        system: systemPrompt,
        tools: {
            searchWeb: tool({
                description: 'Search the web for real-time information like news, exchange rates, and current events. Use this when the provided context is insufficient.',
                parameters: z.object({
                    query: z.string().describe('The search query to find information about'),
                }),
                execute: async ({ query }: { query: string }) => {
                    console.log('--- LIVE SEARCH TRIGGERED ---');
                    console.log('Query:', query);

                    if (!process.env.SERPER_API_KEY) {
                        console.error('❌ Missing SERPER_API_KEY in environment!');
                        return 'Local environment error: Live search is currently unavailable (missing API key).';
                    }

                    try {
                        const res = await fetch('https://google.serper.dev/search', {
                            method: 'POST',
                            headers: {
                                'X-API-KEY': process.env.SERPER_API_KEY,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ q: query })
                        });

                        if (!res.ok) {
                            throw new Error(`Serper API error: ${res.status}`);
                        }

                        const json = await res.json();
                        const results = json.organic?.slice(0, 5) || [];

                        console.log(`✅ Search found ${results.length} results.`);

                        return JSON.stringify(results.map((r: any) => ({
                            title: r.title,
                            link: r.link,
                            snippet: r.snippet
                        })));
                    } catch (error) {
                        console.error('❌ Search tool error:', error);
                        return 'Failed to search the web for real-time information.';
                    }
                },
            }),
        },
        maxSteps: 2,
    });

    return result.toTextStreamResponse();
}
