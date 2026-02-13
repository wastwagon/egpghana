# EGP Ghana - Dashboard & Data Maintenance Guide

This document serves as a reference for maintaining the data integrity of the EGP Ghana dashboards (Economy, IMF, and Debt Tracker).

## 🛠️ Data Maintenance Workflows

### 1. Updating Economic Indicators
Economic indicators (Policy Rate, Inflation, etc.) are stored in the `EconomicData` table. To update them:
- **Local**: Edit `scripts/seed-economic-data.ts` or `scripts/seed-current-2026-data.ts`.
- **Sync**: Run `npm run db:seed` to push changes to the database.
- **Production**: Ensure `scripts/local_data_export.json` is updated and committed, then run `npx prisma db seed` on the production server.

### 2. Dashboard Indicator Harmonization (Feb 2026 Truth)
The following figures have been verified and harmonized across the Homepage and Dashboards as of Feb 13, 2026:
- **Policy Rate (MPR)**: 15.5% (Monetary Easing)
- **Inflation Rate**: 3.8% (Jan 26)
- **Debt-to-GDP**: 45.5% (Nov 2025 Actual)
- **GDP Growth**: 5.5% (Projected 2026)
- **Forex Reserves**: $6.7B
- **IMF Facility**: $3.0B Total ($1.8B Disbursed / 60% Progress)

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
