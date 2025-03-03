import { Controller, Post, Body, HttpException, HttpStatus, Get, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
// @UseInterceptors(PaginationInterceptor)//esta comentado debido a que ahora el interceptor se aplica globalmente
export class TaskController {
    constructor(private readonly tasksService: TaskService) { }

    @Get()
    async findTasks(@Request() req: any, @Query() pagination: PaginationDto) {
        try {
            const tasks = await this.tasksService.findTasks(req.user, pagination);
            return {
                // statusCode: 200,
                message: 'Tasks fetched successfully',
                ...tasks,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}