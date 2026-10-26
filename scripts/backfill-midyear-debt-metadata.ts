/**
 * One-off: tag end-June debt rows with mof_midyear metadata (legacy seeds).
 * Run: npx tsx scripts/backfill-midyear-debt-metadata.ts [year]
 */
import { prisma } from '../src/lib/prisma';
import { backfillMidYearDebtMetadata } from '../src/lib/data-sync/backfill-midyear-metadata';

const year = Number(process.argv[2] || new Date().getUTCFullYear());

backfillMidYearDebtMetadata(year)
    .then((n) => {
        console.log(`Backfilled ${n} row(s) for end-June ${year}.`);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
