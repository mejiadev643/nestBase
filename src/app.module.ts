import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HomeController } from './home/home.controller';
import { HomeModule } from './home/home.module';

@Module({
  imports: [UsersModule, AuthModule, HomeModule],
  controllers: [HomeController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
