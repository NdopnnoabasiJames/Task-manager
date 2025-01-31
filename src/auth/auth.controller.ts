import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../Dtos/SignUp.dto';
import { LoginUserDto } from '../Dtos/Login.dto';

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

  // Endpoint to handle "Forgot Password" requests
  // The user provides their email, and a reset token is generated and sent to the email.
  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.authService.generateResetToken(email);
    return { message: 'Password reset link sent to your email.' };
  }

  // Endpoint to handle password reset using a token
  // The user provides the token (received via email) and a new password.
  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Password has been successfully reset.' };
  }
}
