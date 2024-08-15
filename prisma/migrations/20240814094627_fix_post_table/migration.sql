/*
  Warnings:

  - You are about to drop the column `status` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `statuspostid` on the `Post` table. All the data in the column will be lost.
  - Added the required column `statusId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_statuspostid_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "status",
DROP COLUMN "statuspostid",
ADD COLUMN     "approves" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "statusId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
