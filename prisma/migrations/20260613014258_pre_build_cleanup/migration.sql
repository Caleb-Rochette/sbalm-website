/*
  Warnings:

  - You are about to alter the column `rate2ManCrew` on the `BusinessSettings` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `rate3ManCrew` on the `BusinessSettings` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `pricePerHour` on the `Job` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `totalCharged` on the `Job` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `quotedPrice` on the `Quote` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "BusinessSettings" ALTER COLUMN "rate2ManCrew" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "rate3ManCrew" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "pricePerHour" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "totalCharged" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Quote" ALTER COLUMN "quotedPrice" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Customer_status_idx" ON "Customer"("status");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Customer_deletedAt_idx" ON "Customer"("deletedAt");

-- CreateIndex
CREATE INDEX "Job_customerId_idx" ON "Job"("customerId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_jobDate_idx" ON "Job"("jobDate");

-- CreateIndex
CREATE INDEX "Job_deletedAt_idx" ON "Job"("deletedAt");
