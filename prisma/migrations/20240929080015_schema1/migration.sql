/*
  Warnings:

  - You are about to drop the column `userId` on the `KanbanBoard` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Task` table. All the data in the column will be lost.
  - Added the required column `userIdx` to the `KanbanBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contents` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KanbanBoard" DROP COLUMN "userId",
ADD COLUMN     "userIdx" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "name",
ADD COLUMN     "contents" TEXT NOT NULL,
ADD COLUMN     "tag" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "idx" SERIAL NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "KanbanBoard" ADD CONSTRAINT "KanbanBoard_userIdx_fkey" FOREIGN KEY ("userIdx") REFERENCES "User"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;
