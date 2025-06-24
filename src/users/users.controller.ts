import { Controller, Post, Body, HttpException, HttpStatus, Get, Delete, Param, UseGuards, Request, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt')) //uncomment this line if you want to protect the routes with JWT authentication
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
  ) { }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(
        createUserDto.email,
        createUserDto.password,
        createUserDto.name
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
  @Get('allUsers')
  async findAllUsers(@Request() req: any, @Query() pagination: PaginationDto) {
    try {
      const users = await this.usersService.findAllUsers(req, pagination);
      return {
        ...users,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('me')
  async getMe(@Request() req: any) {
    try {
      // Aquí puedes implementar la lógica para obtener el usuario actual
      // Por ejemplo, si estás usando JWT, puedes obtener el usuario del token
      const user = await this.usersService.getCurrentUser(req);
      return {
        ...user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}