import { Module } from '@nestjs/common';
import {SubtaskService} from './subtask.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { SubtaskContoller } from './subtask.controller';
import { CommonService } from 'src/common/services/Common.service';
import { PaginationService } from 'src/common/services/Pagination.service';
import { PrismaModule } from 'prisma/prisma.module';


@Module({
  imports: [AuthModule,PrismaModule],
  providers: [SubtaskService, PrismaService,CommonService, PaginationService],
  controllers: [SubtaskContoller],
  exports: [],
})
export class SubTaskModule {}
