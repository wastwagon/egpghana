import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from '@/lib/slug';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const article = await prisma.article.findUnique({
            where: { id: params.id },
            include: { category: true },
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, slug, content, excerpt, categoryId, imageUrl, publishedAt, featured, tags } = body;

        const safeSlug = slugify(slug || title) || slugify(title);
        const article = await prisma.article.update({
            where: { id: params.id },
            data: {
                title,
                slug: safeSlug,
                content,
                excerpt,
                categoryId,
                imageUrl,
                publishedAt: publishedAt ? new Date(publishedAt) : undefined,
                featured,
                tags,
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.article.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Article deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
    }
}
