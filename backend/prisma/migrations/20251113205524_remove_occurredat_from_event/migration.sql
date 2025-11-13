/*
  Warnings:

  - You are about to drop the column `occurredAt` on the `Event` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Event_campaignId_occurredAt_idx";

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "occurredAt";

-- CreateIndex
CREATE INDEX "Event_campaignId_createdAt_idx" ON "public"."Event"("campaignId", "createdAt");
