import { Module } from '@nestjs/common';
import {TaskService} from './task.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { TaskController } from './task.contoller';


@Module({
  imports: [AuthModule],
  providers: [TaskService, PrismaService],
  controllers: [TaskController],
  exports: [],
})
export class TasksModule {}
