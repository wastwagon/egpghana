-- CreateTable
CREATE TABLE IF NOT EXISTS "career_opportunities" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'consultancy',
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "notifyEmail" TEXT NOT NULL DEFAULT 'egpghana20@gmail.com',
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "career_applications" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantType" TEXT NOT NULL,
    "location" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "profile" TEXT NOT NULL,
    "relevantExperience" TEXT NOT NULL,
    "assignments" JSONB NOT NULL,
    "references" JSONB NOT NULL,
    "methodology" TEXT NOT NULL,
    "teamQualifications" TEXT NOT NULL,
    "teamMembers" JSONB NOT NULL,
    "totalFee" TEXT NOT NULL,
    "currency" TEXT,
    "levelOfEffort" TEXT,
    "financialNotes" TEXT,
    "contactName" TEXT NOT NULL,
    "contactPosition" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "declarationName" TEXT NOT NULL,
    "declarationOrg" TEXT,
    "attachments" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "career_opportunities_slug_key" ON "career_opportunities"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "career_opportunities_status_idx" ON "career_opportunities"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "career_opportunities_deadline_idx" ON "career_opportunities"("deadline");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "career_applications_opportunityId_idx" ON "career_applications"("opportunityId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "career_applications_email_idx" ON "career_applications"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "career_applications_createdAt_idx" ON "career_applications"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "career_applications_status_idx" ON "career_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "career_applications_opportunityId_email_key" ON "career_applications"("opportunityId", "email");

-- AddForeignKey
ALTER TABLE "career_applications" DROP CONSTRAINT IF EXISTS "career_applications_opportunityId_fkey";
ALTER TABLE "career_applications" ADD CONSTRAINT "career_applications_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "career_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
