import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/Dtos/SignUp.dto';
import { LoginUserDto } from 'src/Dtos/Login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(payload:CreateUserDto) {
    return this.authService.signUp(payload);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
  return this.authService.logIn(loginUserDto);
}

}
