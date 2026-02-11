
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { indicator, value, date, source, unit, metadata } = body;

        const newData = await prisma.economicData.create({
            data: {
                indicator,
                value,
                date: new Date(date),
                source,
                unit,
                metadata,
            },
        });

        return NextResponse.json(newData);
    } catch (error) {
        console.error('Error creating economic data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
