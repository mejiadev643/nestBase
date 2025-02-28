import { PrismaService } from "../prisma.service";
import { userSeeder } from "./UserSeeder";
import { roleSeeder } from "./RoleSeeder";
import { prioritiesSeeder } from "./PrioritiesSeeder";

(async () => {
    const prisma = new PrismaService();
    await roleSeeder(prisma);
    await userSeeder(prisma);
    await prioritiesSeeder(prisma);


    await prisma.$disconnect();
    console.log("Seeders finished.");
})();
