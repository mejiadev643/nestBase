import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() body: { email: string; password: string; name: string }) {
    try {
      const user = await this.usersService.createUser(body.email, body.password, body.name);
      return {
        // statusCode: 201,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}