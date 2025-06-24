import { PrismaService } from "../prisma.service";

export const roleSeeder = async (prisma: PrismaService) => {
    const roles = [
        { id: 1, name: "admin" },
        { id: 2, name: "moderator" },
        { id: 3, name: "user" },
    ];

    await prisma.role.createMany({
        data: roles,
        skipDuplicates: true,
    });
    console.log("Role seeding completed.");
};