import { PrismaService } from "../prisma.service";
import { userSeeder } from "./UserSeeder";


(async () => {
    const prisma = new PrismaService();
    await userSeeder(prisma);


    await prisma.$disconnect();
    console.log("Seeders finished.");
})();
