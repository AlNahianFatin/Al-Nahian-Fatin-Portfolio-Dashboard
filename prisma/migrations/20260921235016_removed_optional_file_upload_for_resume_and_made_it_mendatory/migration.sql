/*
  Warnings:

  - Made the column `title` on table `Resume` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileUrl` on table `Resume` required. This step will fail if there are existing NULL values in that column.
  - Made the column `filePublicId` on table `Resume` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Resume" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "fileUrl" SET NOT NULL,
ALTER COLUMN "filePublicId" SET NOT NULL;
