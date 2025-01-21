import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('home')
export class HomeController {
    constructor() {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getHome(@Request() req: any) {
        return {
            message: 'Welcome to the home page',
            user: req.user,
        }
    }
}
