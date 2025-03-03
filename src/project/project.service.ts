import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProjectDto } from './dto/project.dto';
import { ParseIdDto } from 'src/common/dto/parseId.dto';

@Injectable()
export class ProjectService {

    constructor(private prisma: PrismaService) { }

    async findProjects(req: any, pagination : PaginationDto) {
        const { skip, take, search } = pagination;
        let searchQuery = search ? {
            //buscar por and
            AND: [
                {
                    OR: [
                        { name: { contains: search } },
                        { description: { contains: search } },
                    ]
                }
            ],
        } : {};

        // Obtener el número total de registros sin paginación
        const totalItems = await this.prisma.projects.count({
            where: {
                userId: req.userId,
                deletedAt: null,
                ...searchQuery,
            },
        });

        // Obtener los registros paginados
        const projects = await this.prisma.projects.findMany({
            where: {
                userId: req.userId,
                deletedAt: null,
                ...searchQuery,
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
                Tasks: true,
            },
            skip,
            take,
        });

        // Calcular la cantidad total de páginas
        const totalPages = Math.ceil(totalItems / take);

        return {
            data: projects,
            meta: {
                totalItems,
                totalPages ,
                currentPage: Math.floor(skip / take) + 1,
                perPage: take,
                search,
            },
        };
    }

    async findProject(req: any, objId :ParseIdDto ) {
        const id = objId.id;

        await this.findProjectId(id);//unicamente para verificar que exista el proyecto

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
                    select: {
                        id: true,
                        taskName: true,
                        taskDescription: true,
                        taskStartDate: true,
                        taskEndDate: true,
                        TaskStatus: {
                            select: {
                                id: true,
                                statusName: true,
                            },
                        },
                        Priorities: {
                            select: {
                                id: true,
                                priorityName: true,
                            },
                        },
                        subtasks: {
                            select: {
                                id: true,
                                subtaskName: true,
                                assignedTo: true,
                                description: true,
                                User: {
                                    select: {
                                        id: true,
                                        userName: true,
                                    },
                                },
                                Priorities: {
                                    select: {
                                        id: true,
                                        priorityName: true,
                                    },
                                },
                                TaskStatus: {
                                    select: {
                                        id: true,
                                        statusName: true,
                                    }
                                }
                            },
                        },
                    },
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
        await this.findProjectId(objId.id);//unicamente para verificar que exista el proyecto
        const id = objId.id;
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
        await this.findProjectId(objId.id);//unicamente para verificar que exista el proyecto
        const id = objId.id;
        try {
            return await this.prisma.projects.update({
                where: {
                    id,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while deleting the project', error);
        }
    }

    private async findProjectId(id: number) {
        const project = await this.prisma.projects.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!project) {
            throw new ConflictException('Project not found');
        }
        return project;
    }
}
