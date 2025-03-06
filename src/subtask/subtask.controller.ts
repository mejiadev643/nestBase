import { Controller, Post, Body, HttpException, HttpStatus, Get, Delete, Param, UseGuards, Request, Query, Put } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SubtaskDto, GetSubTaskDto } from './dto/subtask.dto';
import { ParseIdDto } from 'src/common/dto/parseId.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/subtasks')
// @UseInterceptors(PaginationInterceptor)//esta comentado debido a que ahora el interceptor se aplica globalmente
export class SubtaskContoller {
    constructor(private readonly SubtaskService: SubtaskService) { }

    @Get()
    async index() {
        return {
            message: 'Subtask module',
        };
    }

    @Get(':taskId')
    async findSubtasks(@Param() taskId: GetSubTaskDto, @Query() pagination: PaginationDto) {
        try {
            const tasks = await this.SubtaskService.findSubtasks(taskId, pagination);
            return {
                // statusCode: 200,
                message: 'Tasks fetched successfully',
                ...tasks,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/info/:id')
    async findSubtask(@Param() id: ParseIdDto) {
        try {
            const Subtask = await this.SubtaskService.findSubtask(id);
            return {
                // statusCode: 200,
                message: 'Subtask fetched successfully',
                data: Subtask,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post()
    async createSubtask(@Request() req: any, @Body() Subtask: SubtaskDto) {
        try {
            const newSubtask = await this.SubtaskService.createSubtask(req.user, Subtask);
            return {
                // statusCode: 201,
                message: 'Subtask created successfully',
                data: newSubtask,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id')
    async updateSubtask(@Param() id: ParseIdDto, @Body() Subtask: SubtaskDto) {
        try {
            const updatedSubtask = await this.SubtaskService.updateSubtask(id, Subtask);
            return {
                // statusCode: 200,
                message: 'Subtask updated successfully',
                data: updatedSubtask,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':id')
    async deleteSubtask(@Param() id: ParseIdDto) {
        try {
            const deletedSubtask = await this.SubtaskService.deleteSubtask(id);
            return {
                // statusCode: 200,
                message: 'Subtask deleted successfully',
                data: deletedSubtask,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}