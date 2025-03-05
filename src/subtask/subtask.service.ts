import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SubtaskDto } from './dto/subtask.dto';
import { ParseIdDto } from 'src/common/dto/parseId.dto';
import { TaskRelations } from 'src/common/customQuerys/TaskRelation';
import { CommonService } from '../common/services/Common.service';
import { PaginationService } from 'src/common/services/Pagination.service';

@Injectable()
export class SubtaskService {

    constructor(private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
        private readonly paginationService: PaginationService
    ) { }

    async findSubtasks(req: any, pagination: PaginationDto) {

        // Obtener los registros paginados
        const subtasks = await this.paginationService.paginate(
            'subtasks',
            pagination,
            ['subtaskName', 'description'],
                TaskRelations.select.subtasks.select,//select para una sola tabla
            {
                deletedAt: null,
                userId: req.userId,
            },
            undefined //include para relaciones
        );

        return {
            ...subtasks,
        };
    }

    async findSubtask(req: any, objId: ParseIdDto) {
        const id = objId.id;
        await this.commonService.findId(id, 'subtasks');
        const subtasks = await this.prisma.subtasks.findFirst({
            where: {
                deletedAt: null,
                id: id,
            },
            ...TaskRelations.select.subtasks,
        });
        if (!subtasks) {
            throw new ConflictException('Task not found');
        }
        return subtasks;
    }

    async createSubtask(req: any, subtaskData: SubtaskDto) {
        try {
            const { taskId, priorityId, taskStatusId,assignedTo, ...newSubTask } = subtaskData;
            const subtask = await this.prisma.subtasks.create({
                data: {
                    ...newSubTask,
                    TaskStatus: {
                        connect: { id: taskStatusId ?? 1 },//1 es el id de la tarea en progreso
                    },
                    Tasks: {
                        connect: { id: taskId },
                    },
                    User: {
                        connect: { id: assignedTo },
                    },
                    Priorities: {
                        connect: { id: priorityId },
                    }

                },
            });
            return subtask;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateSubtask(req: any, objId: ParseIdDto, subtaskData: SubtaskDto) {
        const id = objId.id;
        await this.commonService.findId(id, 'subtasks');
        const { taskId, priorityId, taskStatusId,assignedTo, ...newSubTask } = subtaskData;
        try {
            const task = await this.prisma.tasks.update({
                where: {
                    id: id,
                },
                data: {
                    ...newSubTask,
                    TaskStatus: {
                        connect: { id: taskStatusId },//1 es el id de la tarea en progreso
                    },
                    User: {
                        connect: { id: assignedTo },
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
    
    async deleteSubtask(req: any, objId: ParseIdDto) {
        const id = objId.id;
        await this.commonService.findId(id, 'subtasks');
        try {
            return await this.prisma.subtasks.update({
                where: {
                    id,
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
