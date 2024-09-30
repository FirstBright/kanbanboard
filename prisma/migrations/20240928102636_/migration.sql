-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'INPROGRESS', 'PENDING', 'DONE', 'CANCEL');

-- CreateTable
CREATE TABLE "KanbanBoard" (
    "idx" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KanbanBoard_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Task" (
    "idx" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "boardIdx" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("idx")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_boardIdx_fkey" FOREIGN KEY ("boardIdx") REFERENCES "KanbanBoard"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;
