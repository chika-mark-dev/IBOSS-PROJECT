import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/user-login.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userEnteredData: RegisterDto) {
    return this.authService.register(userEnteredData);
  }
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const result = await this.authService.login(loginData);
    return result;
  }

  //@UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  refresh(@Body('refresh_token') token: string) {
    return this.authService.refresh(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Body('refresh_token') token: string) {
    await this.authService.logout(token);
  }
}
