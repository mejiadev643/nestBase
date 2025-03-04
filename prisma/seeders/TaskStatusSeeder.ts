import { PrismaService } from "../prisma.service";

export const TaskStatusSeeder = async (prisma: PrismaService) => {
    const taskStatus = [
        { id: 1, statusName: "To Do" },
        { id: 2, statusName: "In Progress" },
        { id: 3, statusName: "Ready for testing" },
        { id: 4, statusName: "Closed" },
        { id: 5, statusName: "Rejected" },
        { id: 6, statusName: "Done" },
    ];

    await prisma.task_estatuses.createMany({
        data: taskStatus,
        skipDuplicates: true,
    });
    console.log("task_status seeding completed.");
};
