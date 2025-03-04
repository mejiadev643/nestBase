import { Module } from '@nestjs/common';
import {TaskService} from './task.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { TaskController } from './task.controller';
import { CommonService } from 'src/common/services/Common.service';


@Module({
  imports: [AuthModule],
  providers: [TaskService, PrismaService,CommonService],
  controllers: [TaskController],
  exports: [],
})
export class TasksModule {}
