import { Module } from '@nestjs/common';
import {ProjectService} from './project.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectController } from './project.controller';
import { CommonService } from 'src/common/services/Common.service';


@Module({
  imports: [AuthModule],
  providers: [ProjectService, PrismaService,CommonService],
  controllers: [ProjectController],
  exports: [],
})
export class ProjecModule {}
