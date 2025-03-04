-- AlterTable
ALTER TABLE "Subtasks" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "deletedAt" TIMESTAMP(3);
