import { NextRequest, NextResponse } from 'next/server';
import { findLatestEconomicData } from '@/lib/cached-economic-data';
import { clientIp, consumeRateLimit } from '@/lib/rate-limit';

/** Public read-only snapshot of headline indicators (partners, widgets, research tools). */
const PUBLIC_INDICATORS: { key: string; indicator: string; source?: string; label: string }[] = [
    { key: 'gdp_growth', indicator: 'GDP_GROWTH', label: 'GDP growth' },
    { key: 'inflation', indicator: 'INFLATION_RATE', source: 'Bank of Ghana', label: 'Inflation' },
    { key: 'exchange_rate_usd', indicator: 'EXCHANGE_RATE_USD', label: 'USD exchange rate' },
    { key: 'policy_rate', indicator: 'POLICY_RATE', source: 'Bank of Ghana', label: 'Policy rate' },
    { key: 'forex_reserves', indicator: 'FOREX_RESERVES', label: 'Forex reserves' },
    { key: 'debt_to_gdp', indicator: 'DEBT_TO_GDP_RATIO', source: 'MOF', label: 'Debt to GDP' },
    { key: 'debt_stock_total', indicator: 'DEBT_STOCK_TOTAL', source: 'Bank of Ghana', label: 'Total debt stock' },
];

const KEY_MAP = new Map(PUBLIC_INDICATORS.map((row) => [row.key, row]));

export async function GET(req: NextRequest) {
    const ip = clientIp(req);
    const allowed = await consumeRateLimit(`indicators-public:${ip}`, 120, 60 * 60);
    if (!allowed) {
        return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    const keysParam = req.nextUrl.searchParams.get('keys');
    const rows = keysParam
        ? keysParam
              .split(',')
              .map((k) => k.trim().toLowerCase())
              .filter((k) => KEY_MAP.has(k))
              .map((k) => KEY_MAP.get(k)!)
        : PUBLIC_INDICATORS;

    if (rows.length === 0) {
        return NextResponse.json(
            {
                error: 'No valid keys. Use keys from the indicators list or omit for all.',
                available: PUBLIC_INDICATORS.map((r) => r.key),
            },
            { status: 400 },
        );
    }

    const indicators = await Promise.all(
        rows.map(async (row) => {
            const data = await findLatestEconomicData(row.indicator, row.source);
            return {
                key: row.key,
                label: row.label,
                indicator: row.indicator,
                source: data?.source ?? row.source ?? null,
                value: data?.value ?? null,
                unit: data?.unit ?? null,
                asOf: data?.date ? data.date.toISOString().slice(0, 10) : null,
            };
        }),
    );

    return NextResponse.json(
        {
            generatedAt: new Date().toISOString(),
            disclaimer: 'Indicative only; verify against official publications before policy use.',
            indicators,
        },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        },
    );
}
