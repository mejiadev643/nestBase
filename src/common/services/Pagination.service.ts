import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class PaginationService {
    constructor(private prisma: PrismaService) { }
    /**
     * Service to paginate records from a model
     * @param {string} model - The model to paginate
     * @param {PaginationDto} pagination - The pagination options
     * @param {string[]} searchFields - The fields to search
     * @param {Record<string, any>} select - The fields to select
     * @param {Record<string, any>} where - The where clause
     * @param {Record<string, any>} include - The relations to include
     * @returns {Promise<{ data: any; meta: { totalItems: number; totalPages: number; currentPage: number; perPage: number; search: string; }; }>} - The paginated data
     * @example
     * // Get all Tasks
     * const tasks = await paginationService.paginate('tasks', pagination, ['taskName', 'taskDescription'])
     * @example
     * // Get all Tasks with select and where clause
     * const tasks = await paginationService.paginate('tasks', pagination, ['taskName', 'taskDescription'], {
     *     id: true,
     *     taskName: true,
     *     taskDescription: true,
     * }, {
     *     taskStatusId: 1,
     * });
     * @example
     * // Get all Tasks with select, where clause and include relation
     * const tasks = await paginationService.paginate('tasks', pagination, ['taskName', 'taskDescription'], {
     *    id: true,
     *   taskName: true,
     *   taskDescription: true,
     * }, {
     *    taskStatusId: 1,
     * }, {
     *    TaskStatus: {
     *       select: {
     *          id: true,
     *         name: true,
     *     },
     *  },
     * });
     */
    async paginate<T>(
        model: string,
        pagination: PaginationDto,
        searchFields: string[] = [],
        select?: Record<string, any>,
        where?: Record<string, any>,
        include?: Record<string, any> // <-- Para incluir relaciones
    ): Promise<{ data: T[]; meta: { totalItems: number; totalPages: number; currentPage: number; perPage: number; search: string } }> {
        const { skip, take, search, order, orderBy } = pagination;
        const adjustedSkip = skip * take;

        if (!this.prisma[model]) {
            throw new BadRequestException(`El modelo ${model} no es válido.`);
        }

        // Construcción del filtro de búsqueda
        const searchQuery = search
            ? {
                AND: [
                    {
                        OR: searchFields.map((field) => ({
                            [field]: { contains: search, mode: 'insensitive' },
                        })),
                    },
                ],
            }
            : {};

        const finalWhere = { ...where, ...searchQuery };

        // Obtener total de registros
        const totalItems = await this.prisma[model].count({ where: finalWhere });
        // Obtener registros paginados
        const data = await this.prisma[model].findMany({
            where: finalWhere,
            select,
            include, // <-- Relaciones opcionales
            skip: adjustedSkip,
            take,
            orderBy: orderBy ? { [orderBy]: order } : undefined,
        });

        return {
            data,
            meta: {
                totalItems,
                totalPages: Math.ceil(totalItems / take),
                currentPage: Math.floor(adjustedSkip / take) + 1,
                perPage: take,
                search,
            },
        };
    }
}
