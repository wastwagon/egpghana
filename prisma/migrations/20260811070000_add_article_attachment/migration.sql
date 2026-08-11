-- AlterTable
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "attachmentUrl" TEXT;
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "attachmentName" TEXT;
