import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './auth.user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }
    
    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        // Si el usuario existe y la contraseña es válida
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            // Elimina la propiedad 'password' del objeto 'user'
            const { passwordHash, ...result } = user;
            // Devuelve el objeto 'user' sin la propiedad 'password'
            return result;
        }
        throw new UnauthorizedException('Credenciales inválidas.');
    }

    async login(user: any) {
        //aqui se genera el token, se puede mandar mas informacion en el payload SI SE REQUIERE
        
        const payload = { email: user.email, sub: user.id, role: user.role.name, roleId : user.role.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
