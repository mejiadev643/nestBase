import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from 'bcrypt';

export const userSeeder = async (prisma: PrismaService) => {
    const hashedPassword = await bcrypt.hash("password", 10);

    const users = [
        {
            email: "admin@admin.com",
            name: "Admin",
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        },
        
    ];

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log("Users seeding completed.");
}