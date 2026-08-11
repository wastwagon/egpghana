-- CreateTable
CREATE TABLE IF NOT EXISTS "data_sync_runs" (
    "id" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "summary" JSONB,
    "error" TEXT,

    CONSTRAINT "data_sync_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "data_sync_proposals" (
    "id" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "currentValue" DOUBLE PRECISION,
    "proposedValue" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "asOfDate" TIMESTAMP(3) NOT NULL,
    "sourceUrl" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "autoApplied" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "data_sync_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "data_sync_runs_sourceKey_idx" ON "data_sync_runs"("sourceKey");
CREATE INDEX IF NOT EXISTS "data_sync_runs_startedAt_idx" ON "data_sync_runs"("startedAt");
CREATE INDEX IF NOT EXISTS "data_sync_proposals_status_idx" ON "data_sync_proposals"("status");
CREATE INDEX IF NOT EXISTS "data_sync_proposals_indicator_idx" ON "data_sync_proposals"("indicator");
CREATE INDEX IF NOT EXISTS "data_sync_proposals_createdAt_idx" ON "data_sync_proposals"("createdAt");
