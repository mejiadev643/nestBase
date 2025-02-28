import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) { }

    async findUsers(pagination: { skip?: number; take?: number } = { skip: 0, take: 5 }) {
        const { skip = 0, take = 10 } = pagination;
        let total = await this.prisma.user.count();
        let paginas = Math.ceil(total / take);
        let paginaactual = Math.ceil(skip / take) + 1;

        let response = await this.prisma.user.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            },
            skip,
            take,
        });
        return {
            data: response,
            meta: {
                total,
                pages: paginas,
                page: paginaactual,
            }
        }
    }

    async createUser(email: string, password: string, name: string, roleId: number) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await this.prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    roleId: roleId ? roleId : 3,
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
    async editUser(id: number, name: string, roleId: number) {
        await this.finduserId(id);

        try {
            return await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    name,
                    roleId,
                    updatedAt: new Date().toISOString(),
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al editar el usuario.');
        }
    }
    async deleteUser(id: number) {
        await this.finduserId(id);

        try {
            return await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    isActive: false,
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar el usuario.');
        }
    }

    private async finduserId(id: number) {
        if (!id) {
            throw new Error('ID no proporcionado.');
        }
        let consulta = await this.prisma.user.findFirst({
            where: {
                id,
                isActive: true,
            },
        });
        console.log(consulta);
        if (!consulta) {
            throw new Error('El usuario no existe o no está activo.');
        }


    }
}


