import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CommonService } from 'src/common/services/Common.service';
import { PaginationService } from 'src/common/services/Pagination.service';

@Module({
  imports: [],
  providers: [UsersService, PrismaService, PrismaModule, CommonService, PaginationService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
