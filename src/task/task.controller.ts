import { Controller, Post, Body, HttpException, HttpStatus, Get, Delete, Param, UseGuards, Request, Query, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TaskDto } from './dto/task.dto';
import { ParseIdDto } from 'src/common/dto/parseId.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/tasks')
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
    
    @Get(':id')
    async findTask(@Request() req: any, @Param() id: ParseIdDto) {
        try {
            const task = await this.tasksService.findTask(req.user, id);
            return {
                // statusCode: 200,
                message: 'Task fetched successfully',
                data: task,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post()
    async createTask(@Request() req: any, @Body() task: TaskDto) {
        try {
            const newTask = await this.tasksService.createTask(req.user, task);
            return {
                // statusCode: 201,
                message: 'Task created successfully',
                data: newTask,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id')
    async updateTask(@Request() req: any, @Param() id: ParseIdDto, @Body() task: TaskDto) {
        try {
            const updatedTask = await this.tasksService.updateTask(req.user, id, task);
            return {
                // statusCode: 200,
                message: 'Task updated successfully',
                data: updatedTask,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':id')
    async deleteTask(@Request() req: any, @Param() id: ParseIdDto) {
        try {
            const deletedTask = await this.tasksService.deleteTask(req.user, id);
            return {
                // statusCode: 200,
                message: 'Task deleted successfully',
                data: deletedTask,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}