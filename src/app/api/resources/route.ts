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

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { fileName: { contains: search, mode: 'insensitive' } },
        ];
    }

    try {
        const [resources, total] = await prisma.$transaction([
            prisma.resource.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishedAt: 'desc' },
            }),
            prisma.resource.count({ where }),
        ]);

        return NextResponse.json({
            resources,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, fileUrl, fileName, fileType, fileSize, category, publishedAt, featured, tags } = body;

        // Basic validation
        if (!title || !fileUrl || !fileName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const resource = await prisma.resource.create({
            data: {
                title,
                description,
                fileUrl,
                fileName,
                fileType,
                fileSize: parseInt(fileSize),
                category: category || 'General',
                tags: tags || [],
                publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
                featured: featured || false,
                downloads: 0,
            },
        });

        return NextResponse.json(resource, { status: 201 });
    } catch (error) {
        console.error('Error creating resource:', error);
        return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
    }
}
