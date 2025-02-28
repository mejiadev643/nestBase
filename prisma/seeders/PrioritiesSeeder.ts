import { PrismaService } from "../prisma.service";

export const prioritiesSeeder = async (prisma: PrismaService) => {
    const priorities = [
        { id: 1, priorityName: "Low" },
        { id: 2, priorityName: "Medium" },
        { id: 3, priorityName: "High" },
    ];

    await prisma.priorities.createMany({
        data: priorities,
        skipDuplicates: true,
    });
    console.log("Priorities seeding completed.");
}
