import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class WebController {
    constructor() {}

    @Get()
    async getHome() {
        return {
            message: 'Welcome to nest Api',
        }
    }
}
