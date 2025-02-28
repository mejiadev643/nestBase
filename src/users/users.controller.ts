import { Controller, Post, Body, HttpException, HttpStatus, Get, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(
        createUserDto.email,
        createUserDto.password,
        createUserDto.name,
        createUserDto.roleId,
      );
      return {
        // statusCode: 201,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('list')
  async findUsers() {
    try {
      const users = await this.usersService.findUsers();
      return {
        // statusCode: 200,
        message: 'Users fetched successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
      }

      const user = await this.usersService.deleteUser(userId);
      return {
        message: 'User deleted successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}