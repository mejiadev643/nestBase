import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from 'bcrypt';

export const userSeeder = async (prisma: PrismaService) => {
    const hashedPassword = await bcrypt.hash("password", 10);

    const users = [
        {
            email: "admin@admin.com",
            userName: "Admin",
            passwordHash: hashedPassword,
            roleId: 1,
            createdAt: new Date().toISOString(),
        },
        {
            email: "user1@test.com",
            userName: "User 1",
            passwordHash: hashedPassword,
            roleId: 3,
            createdAt: new Date().toISOString(),
        },
        {
            email: "user2@test.com",
            userName: "User 2",
            passwordHash: hashedPassword,
            roleId: 3,
            createdAt: new Date().toISOString(),
        },
        {
            email: "user3@test.com",
            userName: "User 3",
            passwordHash: hashedPassword,
            roleId: 3,
            createdAt: new Date().toISOString(),
        },
        {
            email: "user4@test.com",
            userName: "User 4",
            passwordHash: hashedPassword,
            roleId: 3,
            createdAt: new Date().toISOString(),
        },
    ];

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log("Users seeding completed.");
}