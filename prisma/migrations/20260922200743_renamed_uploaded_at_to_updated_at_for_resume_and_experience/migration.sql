/*
  Warnings:

  - You are about to drop the column `uploadedAt` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedAt` on the `Resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "uploadedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "uploadedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
