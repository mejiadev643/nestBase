import { Controller, Post, Body, HttpException, HttpStatus, Get, Delete, Param, UseGuards, Request, Query, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProjectDto } from './dto/project.dto';
import { ParseIdDto } from 'src/common/dto/parseId.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/projects')
// @UseInterceptors(PaginationInterceptor)//esta comentado debido a que ahora el interceptor se aplica globalmente
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Get()
    async findTasks(@Request() req: any, @Query() pagination: PaginationDto) {
        try {
            const tasks = await this.projectService.findProjects(req.user, pagination);
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
            const tasks = await this.projectService.findProject(req.user, id);
            return {
                // statusCode: 200,
                message: 'Tasks fetched successfully',
                ...tasks,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    @Post()
    async createProject(@Request() req: any, @Body() projectData: ProjectDto) {
        try {
            const project = await this.projectService.createProject(req.user, projectData);
            return {
                // statusCode: 201,
                message: 'Project created successfully',
                data: project,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    @Put(':id')
    async updateProject(@Request() req: any, @Param() id: ParseIdDto, @Body() projectData: ProjectDto) {
        try {
            const project = await this.projectService.updateProject(req.user, id, projectData);
            return {
                // statusCode: 200,
                message: 'Project updated successfully',
                data: project,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':id')
    async deleteProject(@Request() req: any, @Param() id: ParseIdDto) {
        try {
            await this.projectService.deleteProject(req.user, id);
            return {
                // statusCode: 200,
                message: 'Project deleted successfully',
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}