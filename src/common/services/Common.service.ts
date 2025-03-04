import { PrismaService } from 'prisma/prisma.service';


export async function findId<T>(prisma: PrismaService, id: number, model: string): Promise<T> {
    const data = await prisma[model].findUnique({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!data) {
        throw new Error(`${model} not found`);
    }
    return data;
}