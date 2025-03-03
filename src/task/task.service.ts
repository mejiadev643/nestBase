import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class TaskService {

    constructor(private prisma: PrismaService) { }

    async findTasks(req: any, pagination: PaginationDto) {
        const { skip, take, search } = pagination;
        let searchQuery = search ? {
            //buscar por and
            AND: [
                { taskName: { contains: search } },
                { taskDescription: { contains: search } },
            ],
        } : {};

        // Obtener el número total de registros sin paginación
        const totalItems = await this.prisma.tasks.count({
            where: {
                userId: req.roleId,
                ...searchQuery,
            },
        });

        // Obtener los registros paginados
        const tasks = await this.prisma.tasks.findMany({
            where: {
                userId: req.roleId,
                ...searchQuery,
            },
            include: {
                User: true,
                Projects: true,
                TaskStatus: true,
                Priorities: true,
                subtasks: true,
            },
            skip,
            take,
        });

        // Calcular la cantidad total de páginas
        const totalPages = Math.ceil(totalItems / take);

        return {
            data: tasks,
            meta: {
                totalItems,
                totalPages ,
                currentPage: Math.floor(skip / take) + 1,
                perPage: take,
                search,
            },
        };
    }
}
