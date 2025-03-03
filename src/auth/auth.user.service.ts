import { Injectable } from "@nestjs/common";
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
                isActive: true,
            },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }
}