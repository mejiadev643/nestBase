import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
//validar los campos requeridos en los métodos POST utilizando DTOs (Data Transfer Objects)
//junto con los pipes de validación y las bibliotecas class-validator y class-transformer
export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo no puede estar vacío' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  roleId: number;
}
