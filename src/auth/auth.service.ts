import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }
    
    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        // Si el usuario existe y la contraseña es válida
        if (user && (await bcrypt.compare(password, user.password))) {
            // Elimina la propiedad 'password' del objeto 'user'
            const { password, ...result } = user;
            // Devuelve el objeto 'user' sin la propiedad 'password'
            return result;
        }
        throw new UnauthorizedException('Credenciales inválidas.');
    }

    async login(user: any) {
        //aqui se genera el token, se puede mandar mas informacion en el payload SI SE REQUIERE
        
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async logout(userId: number) {
        // Aquí puedes implementar la lógica para invalidar el token del usuario
        // Por ejemplo, podrías eliminar el token de una base de datos o marcarlo como inválido
        // En este caso, simplemente retornamos un mensaje de éxito
        return { message: 'Logout successful' };
    }
}
