# EGP Ghana - Dashboard & Data Maintenance Guide

This document serves as a reference for maintaining the data integrity of the EGP Ghana dashboards (Economy, IMF, and Debt Tracker).

## 🛠️ Data Maintenance Workflows

### 0. Automated freshness (preferred)
External sources are checked via **Admin → Data Freshness** (`/admin/dashboard/data-sync`):

| Source | What updates | Behaviour |
|---|---|---|
| Ghana Statistical Service (CPI highlights) | Headline inflation (YoY) | Official CPI month as `asOfDate`; preferred in indicator grid |
| Ghana Statistical Service (homepage) | Quarterly real GDP growth (production, YoY) | `gss_qgdp` sync; preferred for `GDP_GROWTH` when present |
| Bank of Ghana homepage | Inflation, MPR, inflation target | Auto-applies when value changes |
| BoG T-bill page | 91-day T-bill rate | Auto-applies when value changes |
| **MoF Mid-Year Fiscal Policy Review** | H1 debt stock, debt/GDP, shares (+ June inflation/T-bill checkpoints) | **Preferred debt authority** after mid-year presentation; auto-applies |
| BoG SEFD monthly PDF | Total/external/domestic debt (BoG source only), debt/GDP | Supplemental; **does not write Ministry of Finance rows**. Dashboard debt headlines prefer Mid-Year / MoF over SEFD. |
| World Bank API | GDP (USD), per capita income, population | Auto-applies; derives debt/capita |
| MoF quarterly debt bulletin PDF | Quarterly debt stock / ratios | Cross-check only; **never overwrites a newer as-of date** |

MoF validation checks: total ≈ external + domestic, debt/GDP in range, shares ≈ 100%, GDP components consistent.

**Production (preferred):** set `CRON_SECRET` + `RUN_SYNC_ON_STARTUP=true` in Coolify — sync runs automatically after each deploy. Add a daily Coolify cron for ongoing freshness (see `Coolify.md`).

CLI / manual:
```bash
npm run sync:indicators
npm run sync:indicators -- mof_midyear   # Mid-Year debt authority only
npm run sync:imf                        # IMF 6th review disbursements & milestones (after program events)
npm run backfill:midyear                # Tag legacy end-June debt rows with Mid-Year metadata
# or
curl -X POST "$NEXT_PUBLIC_APP_URL/api/admin/data-sync" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"all"}'
```

Test PDF parsing locally:
```bash
npx tsx scripts/test-midyear-parse.ts          # discover + parse Mid-Year
npx tsx scripts/test-mof-parse.ts /path/to/bulletin.pdf
```

Recommended Coolify schedule: daily or every Monday.

### 1. Updating Economic Indicators (manual)
Economic indicators are stored in the `EconomicData` table. To update them manually:
- **Admin UI**: Macro Indicators / Debt Tracker forms.
- **Local scripts**: Edit `scripts/seed-economic-data.ts` or `scripts/seed-current-2026-data.ts`, then `npm run db:seed`.
- **Production export sync**: Update `scripts/local_data_export.json`, commit, then run `npx prisma db seed` / Settings sync on the server.

### 2. Dashboard Indicator Harmonization (Mid-Year 2026 Truth)
Debt figures below are from the **MoF 2026 Mid-Year Fiscal Policy Review** (end-June 2026). Market rates may be newer via BoG sync.
- **Total public debt**: GH₵719.5B (domestic 391.1B / external 328.4B)
- **Debt-to-GDP**: 45.0% (shares 54.4% domestic / 45.6% external)
- **Inflation (Mid-Year checkpoint)**: 5.3% (end-June 2026)
- **Policy Rate (MPR)**: ~14% (BoG; confirm via latest sync)
- **GDP Growth**: 5.5% (Projected 2026)
- Prefer Admin → Data Freshness / `npm run sync:indicators -- mof_midyear` over manual seed edits

### 3. Metadata Requirements for Charts
The dashboard charts rely on specific metadata fields in the `EconomicData` records:
- **IMF Disbursements**: Must have `status: "Completed"` and `sdr: <value>` in metadata for the chart to render.
- **Debt Composition**: Must have `creditor: <name>` and `type: "Domestic" | "External"` in metadata.

## 🔍 Diagnostic Tools
Run these scripts to verify database health:
- `npm run check:stats`: Breakdown of all indicators in DB.
- `tsx scripts/verify-data-final.ts`: Deep check of IMF and Debt metadata.
- `tsx scripts/db-diagnostics.ts`: General count of all entities.

## 🚀 Deployment & Restoration
If the dashboards ever appear empty after a deployment:
1. Run `tsx scripts/master-restore.ts` to wipe and re-seed all critical economic metrics.
2. Verify with the diagnostic tools above.
