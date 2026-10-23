
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { onEconomicDataChanged } from "@/lib/revalidate-public";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { indicator, value, date, source, unit, metadata } = body;

        const updatedData = await prisma.economicData.update({
            where: { id: params.id },
            data: {
                indicator,
                value,
                date: new Date(date),
                source,
                unit,
                metadata,
            },
        });

        await onEconomicDataChanged();
        return NextResponse.json(updatedData);
    } catch (error) {
        console.error('Error updating economic data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.economicData.delete({
            where: { id: params.id },
        });

        await onEconomicDataChanged();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting economic data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
