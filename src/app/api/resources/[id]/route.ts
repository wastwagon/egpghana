import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const resource = await prisma.resource.findUnique({
            where: { id: params.id },
        });

        if (!resource) {
            return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
        }

        return NextResponse.json(resource);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, fileUrl, fileName, fileType, fileSize, category, publishedAt, featured, tags } = body;

        const resource = await prisma.resource.update({
            where: { id: params.id },
            data: {
                title,
                description,
                fileUrl,
                fileName,
                fileType,
                fileSize: fileSize ? parseInt(fileSize) : undefined,
                category,
                tags,
                publishedAt: publishedAt ? new Date(publishedAt) : undefined,
                featured,
            },
        });

        return NextResponse.json(resource);
    } catch (error) {
        console.error('Error updating resource:', error);
        return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.resource.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
    }
}
