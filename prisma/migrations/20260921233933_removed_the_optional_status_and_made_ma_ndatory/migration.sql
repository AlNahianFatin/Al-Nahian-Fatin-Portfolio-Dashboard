/*
  Warnings:

  - Made the column `status` on table `Publication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Publication" ALTER COLUMN "status" SET NOT NULL;
