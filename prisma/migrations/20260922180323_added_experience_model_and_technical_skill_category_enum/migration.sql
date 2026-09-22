/*
  Warnings:

  - The `category` column on the `Skill` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TechnicalSkillCategory" AS ENUM ('LANGUAGE', 'WEB', 'SOFTWARE', 'DATABASE', 'TOOL');

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "category",
ADD COLUMN     "category" "TechnicalSkillCategory";

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);
