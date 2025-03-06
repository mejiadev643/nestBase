/*
  Warnings:

  - You are about to drop the column `TaskStatusId` on the `Subtasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subtasks" DROP CONSTRAINT "Subtasks_TaskStatusId_fkey";

-- DropForeignKey
ALTER TABLE "Subtasks" DROP CONSTRAINT "Subtasks_assignedTo_fkey";

-- DropForeignKey
ALTER TABLE "Subtasks" DROP CONSTRAINT "Subtasks_priorityId_fkey";

-- AlterTable
ALTER TABLE "Subtasks" DROP COLUMN "TaskStatusId",
ADD COLUMN     "taskStatusId" INTEGER,
ALTER COLUMN "assignedTo" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "priorityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subtasks" ADD CONSTRAINT "Subtasks_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priorities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtasks" ADD CONSTRAINT "Subtasks_taskStatusId_fkey" FOREIGN KEY ("taskStatusId") REFERENCES "Task_estatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtasks" ADD CONSTRAINT "Subtasks_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
