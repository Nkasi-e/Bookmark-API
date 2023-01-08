import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginDto } from './dto';
import { HttpStatus } from '@nestjs/common/enums';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createDto: CreateAuthDto) {
    return this.authService.signup(createDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  singin(@Body() createDto: LoginDto) {
    return this.authService.signin(createDto);
  }
}
