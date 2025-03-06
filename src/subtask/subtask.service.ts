import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GetSubTaskDto, SubtaskDto } from './dto/subtask.dto';
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

    async findSubtasks(subtaskId: GetSubTaskDto, pagination: PaginationDto) {

        // Obtener los registros paginados, mientras las tareas pertenescan a una tarea en especifico
        const subtasks = await this.paginationService.paginate(
            'subtasks',
            pagination,
            ['subtaskName', 'description'],
            TaskRelations.select.subtasks.select,//select para una sola tabla
            {
                deletedAt: null,
                taskId: subtaskId.taskId,
            },
            undefined //include para relaciones
        );

        return {
            ...subtasks,
        };
    }

    async findSubtask(objId: ParseIdDto) {
        const id = objId.id;
        await this.commonService.findId(id, 'subtasks');
        const subtasks = await this.prisma.subtasks.findFirst({
            where: {
                id: id,
                deletedAt: null
            },
            select: {
                ...TaskRelations.select.subtasks.select,
            },
        });
        console.log(subtasks);
        if (!subtasks) {
            throw new ConflictException('subtasks not found');
        }
        return subtasks;
    }

    async createSubtask(req: any, subtaskData: SubtaskDto) {
        try {
            const subtask = await this.prisma.subtasks.create({
                data: {
                    ...subtaskData
                },
            });
            return subtask;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateSubtask(objId: ParseIdDto, subtaskData: SubtaskDto) {
        const id = objId.id;
        await this.commonService.findId(id, 'subtasks');
        const { taskId, ...newSubTask } = subtaskData;
        try {
            const task = await this.prisma.subtasks.update({
                where: {
                    id: id,
                },
                data: {
                    ...newSubTask,
                },
            });
            return task;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async deleteSubtask(objId: ParseIdDto) {
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
