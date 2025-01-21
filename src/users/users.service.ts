import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) { }

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
                    createdAt: new Date(),              },
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
}

