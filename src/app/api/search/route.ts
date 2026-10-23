import { NextRequest, NextResponse } from 'next/server';
import { searchPublicContent } from '@/lib/public-search';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 12), 30);
    const result = await searchPublicContent(q, limit);
    return NextResponse.json(result);
}
