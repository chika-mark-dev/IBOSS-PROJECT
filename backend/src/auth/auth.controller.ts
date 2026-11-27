import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/user-login.dto';

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
  @Post('refresh')
  @HttpCode(200)
  refresh(@Body('refresh_token') token: string) {
    return this.authService.refresh(token);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Body('refresh_token') token: string) {
    await this.authService.logout(token);
  }
}
