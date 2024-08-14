-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "nameImage" TEXT,
ADD COLUMN     "pathImage" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'USER';
