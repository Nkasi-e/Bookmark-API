import { Controller, Get, UseGuards, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { Users } from '@prisma/client';
import { EditUserDto } from './dto/user.dto';

@UseGuards(JwtGuard) // for authorization, from nestjs // the JwtGuard is a custom guard
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('myprofile')
  getMe(@GetUser() user: Users) {
    return user;
  }

  @Patch('edit-profile')
  updateUser(@GetUser('id') userId: string, @Body() editUserDto: EditUserDto) {
    return this.userService.updateUser(userId, editUserDto);
  }
}
