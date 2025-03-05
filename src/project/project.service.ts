import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProjectDto } from './dto/project.dto';
import { ParseIdDto } from 'src/common/dto/parseId.dto';
import { TaskRelations } from 'src/common/customQuerys/TaskRelation';
import { CommonService } from '../common/services/Common.service';
import { PaginationService } from 'src/common/services/Pagination.service';

@Injectable()
export class ProjectService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly commonService: CommonService,
        private readonly paginationService: PaginationService,
    ) { }

    async findProjects(req: any, pagination: PaginationDto) {
        

        // Obtener los registros paginados
        const projects = await this.paginationService.paginate(
            'projects',
            pagination,
            ['name', 'description'],
            {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                User: {
                    select: {
                        id: true,
                        email: true,
                        userName: true,
                    },
                },
                Tasks: {
                    ...TaskRelations,
                },
            },
            {
                deletedAt: null,
                userId: req.userId,
            },
            undefined
        );
        return {
            ...projects // <-- Retornar los proyectos,
        };
    }

    async findProject(req: any, objId: ParseIdDto) {
        const id = objId.id;

        await this.commonService.findId(id, 'projects');

        // Obtener los registros paginados
        const projects = await this.prisma.projects.findFirst({
            where: {
                userId: req.userId,
                deletedAt: null,
                id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                User: {
                    select: {
                        id: true,
                        email: true,
                        userName: true,
                    },
                },
                Tasks: {
                    ...TaskRelations,
                },
            },
        });
        return {
            data: projects,
        };
    }

    async createProject(req: any, projectData: ProjectDto) {
        try {
            const project = await this.prisma.projects.create({
                data: {
                    ...projectData,
                    User: {
                        connect: {
                            id: req.userId,
                        },
                    },
                },
            });
            return project;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Project already exists');
            }
            throw new InternalServerErrorException('An error occurred while creating the project', error);
        }
    }

    async updateProject(req: any, objId: ParseIdDto, projectData: ProjectDto) {
        const id = objId.id;
        await this.commonService.findId(id, 'projects');
        try {

            return await this.prisma.projects.update({
                where: {
                    id,
                },
                data: {
                    ...projectData,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Project already exists');
            }
            throw new InternalServerErrorException('An error occurred while updating the project', error);
        }
    }
    async deleteProject(req: any, objId: ParseIdDto) {
        const id = objId.id;
        await this.commonService.findId(id, 'projects');
        try {
            return await this.prisma.projects.update({
                where: {
                    id,
                    userId: req.userId,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while deleting the project', error);
        }
    }
}
