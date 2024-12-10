import { Controller, Post, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/Dtos/SignUp.dto';
import { LoginUserDto } from 'src/Dtos/Login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.signUp(createUserDto);
      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.logIn(loginUserDto);
}

}
