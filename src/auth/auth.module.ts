import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from './auth.user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretkey',
      signOptions: { expiresIn: '1d' }
    })
  ],
  providers: [AuthService, JwtStrategy, PrismaService, UserService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
