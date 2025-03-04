import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProjectDto } from './dto/project.dto';
import { ParseIdDto } from 'src/common/dto/parseId.dto';
import { TaskRelations } from 'src/common/customQuerys/TaskRelation';
import { findId } from 'src/common/services/Common.service';

@Injectable()
export class ProjectService {

    constructor(private prisma: PrismaService) { }

    async findProjects(req: any, pagination : PaginationDto) {
        const { skip, take, search,order,orderBy } = pagination;
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
                Tasks: {
                    ...TaskRelations,
                }
            },
            skip,
            take,
            orderBy: {
                [orderBy]: order,
           },
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

        await findId(this.prisma, objId.id, 'projects');

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
                Tasks:{
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
        await findId(this.prisma, objId.id, 'projects');
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
        await findId(this.prisma, objId.id, 'projects');
        const id = objId.id;
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
