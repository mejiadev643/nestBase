import { Module } from '@nestjs/common';
import {TaskService} from './task.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { TaskController } from './task.controller';
import { CommonService } from 'src/common/services/Common.service';
import { PaginationService } from 'src/common/services/Pagination.service';
import { PrismaModule } from 'prisma/prisma.module';


@Module({
  imports: [AuthModule,PrismaModule],
  providers: [TaskService, PrismaService,CommonService, PaginationService],
  controllers: [TaskController],
  exports: [],
})
export class TasksModule {}
