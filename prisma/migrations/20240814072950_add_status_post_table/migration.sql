-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "statuspostid" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "StatusPost" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "StatusPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_statuspostid_fkey" FOREIGN KEY ("statuspostid") REFERENCES "StatusPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
