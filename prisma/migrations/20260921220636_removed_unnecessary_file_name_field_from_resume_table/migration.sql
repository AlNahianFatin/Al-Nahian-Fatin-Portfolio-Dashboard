/*
  Warnings:

  - You are about to drop the column `fileName` on the `Resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "fileName",
ALTER COLUMN "title" DROP NOT NULL;
