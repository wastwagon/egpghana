import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status'); // 'published', 'draft'

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (status === 'published') {
        where.publishedAt = { not: null, lte: new Date() };
    } else if (status === 'draft') {
        where.publishedAt = null;
    }

    try {
        const [articles, total] = await prisma.$transaction([
            prisma.article.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishedAt: 'desc' },
                include: { category: true },
            }),
            prisma.article.count({ where }),
        ]);

        return NextResponse.json({
            articles,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, slug, content, excerpt, categoryId, imageUrl, publishedAt, featured, tags } = body;

        // Basic validation
        if (!title || !slug || !content || !categoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                categoryId,
                imageUrl,
                publishedAt: publishedAt ? new Date(publishedAt) : new Date(), // Default to now if not provided, or handle as draft logic
                featured: featured || false,
                tags: tags || [],
            },
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}
