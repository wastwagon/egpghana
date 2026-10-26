import { NextRequest, NextResponse } from 'next/server';
import { findLatestEconomicData } from '@/lib/cached-economic-data';
import { parseDashboardRange } from '@/lib/dashboard-range';
import { siteBaseUrl } from '@/lib/seo';

const BRIEFING_INDICATORS: Record<
    string,
    { label: string; indicator: string; source?: string; format?: (v: number) => string }[]
> = {
    economy: [
        { label: 'GDP growth', indicator: 'GDP_GROWTH', format: (v) => `${v.toFixed(1)}%` },
        { label: 'Inflation', indicator: 'INFLATION_RATE', source: 'Bank of Ghana', format: (v) => `${v.toFixed(1)}%` },
        { label: 'Exchange rate (USD)', indicator: 'EXCHANGE_RATE_USD', format: (v) => v.toFixed(2) },
        { label: 'Policy rate', indicator: 'POLICY_RATE', source: 'Bank of Ghana', format: (v) => `${v.toFixed(1)}%` },
        { label: 'Forex reserves', indicator: 'FOREX_RESERVES', format: (v) => `$${(v / 1000).toFixed(2)}B` },
    ],
    debt: [
        { label: 'Total debt', indicator: 'DEBT_STOCK_TOTAL', source: 'Bank of Ghana', format: (v) => `GHS ${(v / 1000).toFixed(1)}B` },
        { label: 'Debt to GDP', indicator: 'DEBT_TO_GDP_RATIO', source: 'MOF', format: (v) => `${v.toFixed(1)}%` },
        { label: 'Debt service to revenue', indicator: 'DEBT_SERVICE_TO_REVENUE', source: 'MOF', format: (v) => `${v.toFixed(1)}%` },
    ],
    imf: [
        {
            label: 'Latest disbursement (completed)',
            indicator: 'IMF_DISBURSEMENT',
            format: (v) => `USD ${v.toFixed(1)}M`,
        },
    ],
};

const TITLES: Record<string, string> = {
    economy: 'Macro economy briefing',
    debt: 'Public debt briefing',
    imf: 'IMF program briefing',
};

export async function GET(req: NextRequest) {
    const dashboard = req.nextUrl.searchParams.get('dashboard') || 'economy';
    const rows = BRIEFING_INDICATORS[dashboard];
    if (!rows) {
        return NextResponse.json({ error: 'Unknown dashboard' }, { status: 400 });
    }

    const metrics = await Promise.all(
        rows.map(async (row) => {
            const data = await findLatestEconomicData(row.indicator, row.source);
            const value = data ? (row.format ? row.format(data.value) : String(data.value)) : '—';
            const asOf = data ? data.date.toISOString().slice(0, 10) : '—';
            return { label: row.label, value, asOf, source: data?.source ?? row.source ?? '—' };
        }),
    );

    const generated = new Date().toISOString();
    const title = TITLES[dashboard];
    const appUrl = siteBaseUrl();
    const chartRange = parseDashboardRange(req.nextUrl.searchParams.get('range') ?? undefined);
    const rangeNote =
        chartRange === 'all'
            ? 'Chart context: full series on site'
            : `Chart context on site: last ${chartRange.replace('y', ' year')}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title} | EGP Ghana</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; max-width: 720px; margin: 2rem auto; padding: 0 1.5rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
    th, td { text-align: left; padding: 0.65rem 0.5rem; border-bottom: 1px solid #e2e8f0; }
    th { font-size: 0.75rem; text-transform: none; color: #64748b; font-weight: 600; }
    footer { margin-top: 2.5rem; font-size: 0.75rem; color: #94a3b8; }
    @media print {
      body { margin: 0.75in; max-width: none; }
      a { color: inherit; text-decoration: none; }
      footer { page-break-inside: avoid; }
      table { page-break-inside: avoid; }
    }
    @page { size: A4; margin: 0.75in; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Economic Governance Platform Ghana · Generated ${generated.slice(0, 16).replace('T', ' ')} UTC · ${rangeNote}</p>
  <table>
    <thead><tr><th>Indicator</th><th>Latest</th><th>As of</th><th>Source</th></tr></thead>
    <tbody>
      ${metrics
          .map(
              (m) =>
                  `<tr><td>${m.label}</td><td><strong>${m.value}</strong></td><td>${m.asOf}</td><td>${m.source}</td></tr>`,
          )
          .join('')}
    </tbody>
  </table>
  <footer>
    Full interactive dashboards: <a href="${appUrl}/dashboards/${dashboard === 'economy' ? 'economy' : dashboard}">${appUrl}/dashboards/${dashboard}</a><br />
    Data is indicative; verify against official publications before policy use.
  </footer>
  <script>if (location.search.includes('print=1')) window.print();</script>
</body>
</html>`;

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
        },
    });
}
