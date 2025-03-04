import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TaskDto } from './dto/task.dto';
import { ParseIdDto } from 'src/common/dto/parseId.dto';
import { TaskRelations } from 'src/common/customQuerys/TaskRelation';
import { find } from 'rxjs';
import { findId } from 'src/common/services/Common.service';

@Injectable()
export class TaskService {

    constructor(private prisma: PrismaService) { }

    async findTasks(req: any, pagination: PaginationDto) {
        const { skip, take, search } = pagination;
        let searchQuery = search ? {
            //buscar por and
            AND: [
                {
                    OR: [
                        { taskName: { contains: search } },
                        { taskDescription: { contains: search } },
                    ]
                }
            ],
        } : {};

        // Obtener el número total de registros sin paginación
        const totalItems = await this.prisma.tasks.count({
            where: {
                deletedAt: null,
                userId: req.userId,
                ...searchQuery,
            },
        });

        // Obtener los registros paginados
        const tasks = await this.prisma.tasks.findMany({
            where: {
                deletedAt: null,
                userId: req.userId,
                ...searchQuery,
            },
            ...TaskRelations,
            skip,
            take,
            orderBy: {
                id: 'desc',
            },
        });

        // Calcular la cantidad total de páginas
        const totalPages = Math.ceil(totalItems / take);

        return {
            data: tasks,
            meta: {
                totalItems,
                totalPages,
                currentPage: Math.floor(skip / take) + 1,
                perPage: take,
                search,
            },
        };
    }
    async findTask(req: any, objId: ParseIdDto) {
        const id = objId.id;
        await findId(this.prisma, id, 'tasks');
        const task = await this.prisma.tasks.findUnique({
            where: {
                deletedAt: null,
                id: id,
            },
            ...TaskRelations,
        });
        if (!task) {
            throw new ConflictException('Task not found');
        }
        return task;
    }
    async createTask(req: any, taskData: TaskDto) {
        try {
            const { projectId, priorityId, taskStatusId, ...newTask } = taskData;
            const task = await this.prisma.tasks.create({
                data: {
                    ...newTask,
                    TaskStatus: {
                        connect: { id: taskStatusId ?? 1 },//1 es el id de la tarea en progreso
                    },
                    User: {
                        connect: { id: req.userId as number },
                    },
                    Projects: {
                        connect: { id: projectId },
                    },
                    Priorities: {
                        connect: { id: priorityId },
                    }

                },
            });
            return task;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
    async updateTask(req: any, objId: ParseIdDto, taskData: TaskDto) {
        const id = objId.id;
        await findId(this.prisma, id, 'tasks');
        const { projectId, priorityId, taskStatusId, ...editTask } = taskData;
        try {
            const task = await this.prisma.tasks.update({
                where: {
                    id: id,
                },
                data: {
                    ...editTask,
                    Priorities: {
                        connect: { id: priorityId },
                    },
                    TaskStatus: {
                        connect: { id: taskStatusId },
                    },
                }
            });
            return task;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
    async deleteTask(req: any, objId: ParseIdDto) {
        const id = objId.id;
        await findId(this.prisma, id, 'tasks');
        try {
            return await this.prisma.tasks.update({
                where: {
                    id,
                    userId: req.userId,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
