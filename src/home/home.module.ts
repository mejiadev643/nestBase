import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule], // Importar AuthModule para usar el guard
    controllers: [HomeController], // Registrar el controlador
})
export class HomeModule { }