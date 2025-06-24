import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto'

export const userSeeder = async (prisma: PrismaService) => {
    const hashedPassword = await bcrypt.hash("password", 10);
    const uuid = randomUUID();

    const users = [
        {
            email: "admin@admin.com",
            name: "Admin",
            password: hashedPassword,
            uuid: uuid,
            createdAt: new Date().toISOString(),
        },
        
    ];

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log("Users seeding completed.");
}