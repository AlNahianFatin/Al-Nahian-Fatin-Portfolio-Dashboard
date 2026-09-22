-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('ONGOING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "status" "PublicationStatus";
