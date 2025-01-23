import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from 'bcrypt';

export const userSeeder = async (prisma: PrismaService) => {
    const hashedPassword = await bcrypt.hash("password", 10);

    const users = [
        {
            email: "admin@admin.com",
            name: "Admin",
            password: hashedPassword,
            roleId: 1,
            createdAt: new Date().toISOString(),
        },
        {
            email: "user1@test.com",
            name: "User 1",
            roleId: 3,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        },
        {
            email: "user2@test.com",
            name: "User 2",
            roleId: 3,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        },
        {
            email: "user3@test.com",
            name: "User 3",
            roleId: 3,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        },
        {
            email: "user4@test.com",
            name: "User 4",
            roleId: 3,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        },
    ];

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log("User seeding completed.");
};
