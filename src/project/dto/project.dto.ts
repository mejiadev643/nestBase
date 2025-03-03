import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
//validar los campos requeridos en los métodos POST utilizando DTOs (Data Transfer Objects)
//junto con los pipes de validación y las bibliotecas class-validator y class-transformer
export class ProjectDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;
}