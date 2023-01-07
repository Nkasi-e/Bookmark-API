import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createDto: CreateAuthDto) {
    return this.authService.signup(createDto);
  }

  @Post('signin')
  singin(@Body() createDto: CreateAuthDto) {
    return this.authService.signin(createDto);
  }
}
