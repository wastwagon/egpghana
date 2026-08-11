/**
 * Cron-friendly external indicator sync.
 *
 * Usage:
 *   npx tsx scripts/sync-external-indicators.ts
 *   npx tsx scripts/sync-external-indicators.ts bog_homepage
 *
 * Coolify / cron can hit POST /api/admin/data-sync with:
 *   Authorization: Bearer $CRON_SECRET
 */
import { runDataSync, type SyncSourceKey } from '../src/lib/data-sync/run';

async function main() {
    const source = (process.argv[2] || 'all') as SyncSourceKey;
    console.log(`[data-sync] Starting source=${source}`);
    const result = await runDataSync(source);
    console.log('[data-sync] Aggregate:', result.aggregate);
    for (const r of result.results) {
        console.log(`  ${r.sourceKey}:`, r.summary);
    }
    if (result.aggregate.errors.length) {
        process.exitCode = 1;
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
