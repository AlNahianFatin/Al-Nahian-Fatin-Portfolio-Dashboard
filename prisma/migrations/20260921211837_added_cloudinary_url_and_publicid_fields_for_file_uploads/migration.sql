/*
  Warnings:

  - You are about to drop the column `profileImage` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Publication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "profileImage",
ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "image",
ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Publication" DROP COLUMN "image",
ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "filePublicId" TEXT,
ALTER COLUMN "fileUrl" DROP NOT NULL;
