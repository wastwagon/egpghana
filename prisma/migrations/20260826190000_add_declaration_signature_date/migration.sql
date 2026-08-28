-- AlterTable
ALTER TABLE "career_applications" ADD COLUMN IF NOT EXISTS "declarationSignature" TEXT;
ALTER TABLE "career_applications" ADD COLUMN IF NOT EXISTS "declarationDate" TEXT;
