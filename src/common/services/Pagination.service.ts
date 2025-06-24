import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class PaginationService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Service to paginate records from a model
     * @param {string} model - The model to paginate
     * @param {PaginationDto} pagination - The pagination options
     * @param {string[]} searchFields - The fields to search
     * @param {Record<string, any>} select - The fields to select
     * @param {Record<string, any>} where - The where clause
     * @param {Record<string, any>} include - The relations to include
     * @returns {Promise<{ data: any; meta: { totalItems: number; totalPages: number; currentPage: number; perPage: number; search: string; }; }>} - The paginated data
     */
    async paginate(
        model: string,
        pagination: PaginationDto,
        searchFields: string[] = [],
        select?: Record<string, any>,
        where?: Record<string, any>,
        include?: Record<string, any>,
    ) {
        const { skip, take, search, order, orderBy } = pagination;
        const adjustedSkip = skip * take;

        if (!this.prisma[model]) {
            throw new BadRequestException(`El modelo ${model} no es válido.`);
        }

        // Construcción del filtro de búsqueda
        const searchQuery = search
            ? {
                OR: searchFields.map((field) => ({
                    [field]: { contains: search, mode: 'insensitive' },
                })),
            }
            : {};

        // Construir la cláusula where sin deletedAt
        let finalWhere = {
            ...where? where : {},
            ...searchQuery,
        };

        try {
            // Obtener total de registros
            const totalItems = await this.prisma[model].count({
                where: finalWhere
            });

            // Obtener registros paginados
            const data = await this.prisma[model].findMany({
                where: finalWhere,
                select,
                include,
                skip: adjustedSkip,
                take,
                orderBy: orderBy ? { [orderBy]: order } : undefined,
            });

            return {
                data,
                total: totalItems,
                currentPage: skip + 1,
                perPage: take,
                totalPages: Math.ceil(totalItems / take),
            };
        } catch (error) {
            throw new BadRequestException(`Error en la paginación: ${error.message}`);
        }
    }
}