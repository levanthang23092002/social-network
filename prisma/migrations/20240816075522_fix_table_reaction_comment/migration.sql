/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Reactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Reactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("postId", "ownerId");

-- AlterTable
ALTER TABLE "Reactions" DROP CONSTRAINT "Reactions_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Reactions_pkey" PRIMARY KEY ("postId", "ownerId");
