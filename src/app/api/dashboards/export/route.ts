import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const EXPORT_MAP: Record<string, string[]> = {
    economy: [
        'GDP_GROWTH',
        'INFLATION_RATE',
        'EXCHANGE_RATE_USD',
        'POLICY_RATE',
        'FOREX_RESERVES',
        'UNEMPLOYMENT_RATE',
    ],
    debt: ['TOTAL_DEBT', 'DEBT_TO_GDP_RATIO', 'DEBT_SERVICE_TO_REVENUE', 'DEBT_STOCK_TOTAL'],
    imf: ['IMF_DISBURSEMENT'],
};

function escapeCsv(value: string | number) {
    const s = String(value);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}

export async function GET(req: NextRequest) {
    const dashboard = req.nextUrl.searchParams.get('dashboard') || 'economy';
    const indicators = EXPORT_MAP[dashboard];
    if (!indicators) {
        return NextResponse.json({ error: 'Unknown dashboard' }, { status: 400 });
    }

    const from = req.nextUrl.searchParams.get('from');
    const to = req.nextUrl.searchParams.get('to');
    const dateWhere =
        from || to
            ? {
                  date: {
                      ...(from ? { gte: new Date(from) } : {}),
                      ...(to ? { lte: new Date(to) } : {}),
                  },
              }
            : {};

    const rows = await prisma.economicData.findMany({
        where: { indicator: { in: indicators }, ...dateWhere },
        orderBy: [{ indicator: 'asc' }, { date: 'desc' }],
        take: 500,
    });

    const header = ['indicator', 'value', 'unit', 'date', 'source'];
    const lines = [
        header.join(','),
        ...rows.map((r) =>
            [
                escapeCsv(r.indicator),
                escapeCsv(r.value),
                escapeCsv(r.unit || ''),
                escapeCsv(r.date.toISOString().split('T')[0]),
                escapeCsv(r.source),
            ].join(',')
        ),
    ];

    const filename = `egp-${dashboard}-indicators.csv`;
    return new NextResponse(lines.join('\n'), {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}
