import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/services/Common.service';
import { PaginationService } from 'src/common/services/Pagination.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService,
        private readonly commonService: CommonService,
        private readonly paginationService: PaginationService
    ) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        });
    }
    async createUser(email: string, password: string, name: string) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await this.prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    createdAt: new Date(),
                },
            });
        } catch (error) {
            // Manejo de errores de Prisma
            if (error.code === 'P2002') {
                // Código de error de unicidad en Prisma
                throw new ConflictException('El email ya está en uso.');
            }
            throw new InternalServerErrorException('Error al crear el usuario.');
        }
    }
    async findAllUsers(req: any, pagination: PaginationDto) {
        const users = await this.paginationService.paginate(
            'user',//modelo a paginar
            pagination,//dto de paginacion
            ['email'],//campos de busqueda
            {
                name: true,
                email: true,
                createdAt: true,
                id: true,
            },//campos a seleccionar
            {

            },//where clause
            undefined, //include relations
        )
        return {
            ...users
        };
    }
    async getCurrentUser(req: any) {
        const userId = req.user.userId; // Asumiendo que el ID del usuario está en req.user.id
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
    }

}

