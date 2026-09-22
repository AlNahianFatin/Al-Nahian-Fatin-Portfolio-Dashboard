/*
  Warnings:

  - Made the column `field` on table `Education` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "gpa" DECIMAL(65,30),
ALTER COLUMN "field" SET NOT NULL;
