import { Module } from '@nestjs/common';
import {ProjectService} from './project.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectController } from './project.controller';
import { CommonService } from 'src/common/services/Common.service';
import { PaginationService } from 'src/common/services/Pagination.service';


@Module({
  imports: [AuthModule],
  providers: [ProjectService, PrismaService,CommonService,PaginationService],
  controllers: [ProjectController],
  exports: [],
})
export class ProjecModule {}
