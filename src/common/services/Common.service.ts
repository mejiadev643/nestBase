import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CommonService {
    constructor(private readonly prisma: PrismaService) { }

    async countRecords(model: string, query: any): Promise<number> {
        try {
            const count = await this.prisma[model].count({
                where: {
                    ...query,
                },
            });
            return count;
        } catch (error) {
            throw new Error(`Error counting records: ${error.message}`);
        }
    }

    async findId<T>(id: number, model: string): Promise<T> {
        const data = await this.prisma[model].findFirst({
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
}