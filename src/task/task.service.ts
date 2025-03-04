import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TaskDto } from './dto/task.dto';
import { ParseIdDto } from 'src/common/dto/parseId.dto';
import { TaskRelations } from 'src/common/customQuerys/TaskRelation';
import { CommonService } from '../common/services/Common.service';


@Injectable()
export class TaskService {

    constructor(private prisma: PrismaService,
        private commonService: CommonService
    ) { }

    async findTasks(req: any, pagination: PaginationDto) {
        const { skip, take, search, order, orderBy } = pagination;
        const adjustedSkip = skip * take;
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

        const totalItems = await this.commonService.countRecords('tasks', {
            deletedAt: null,
            userId: req.userId,
        });

        // Obtener los registros paginados
        const tasks = await this.prisma.tasks.findMany({
            where: {
                deletedAt: null,
                userId: req.userId,
                ...searchQuery,
            },
            ...TaskRelations,
            skip: adjustedSkip,
            take,
            orderBy: {
                [orderBy]: order,
            },
        });

        // Calcular la cantidad total de páginas
        const totalPages = Math.ceil(totalItems / take);

        return {
            data: tasks,
            meta: {
                totalItems,
                totalPages,
                currentPage: Math.floor(adjustedSkip / take) + 1,
                perPage: take,
                search,
            },
        };
    }
    async findTask(req: any, objId: ParseIdDto) {
        const id = objId.id;
        await this.commonService.findId(id, 'tasks');
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
        await this.commonService.findId(id, 'tasks');
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
        await this.commonService.findId(id, 'tasks');
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
