import { PrismaService } from "../prisma.service";
import { userSeeder } from "./UserSeeder";
import { roleSeeder } from "./RoleSeeder";

(async () => {
    const prisma = new PrismaService();
    await roleSeeder(prisma);
    await userSeeder(prisma);
    await prisma.$disconnect();
    console.log("Seeders finished.");
})();
