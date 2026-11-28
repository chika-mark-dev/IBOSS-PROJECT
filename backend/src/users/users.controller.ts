import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UsersService } from './users.service'; // ASSUMED path

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() current: { id: string }) {
    // ASSUMED: your CurrentUser decorator returns an object with the user id as "userId"
    const user = await this.usersService.findById(current.id);
    return {
      id: user.user_id,
      name: user.name,
      role: user.role,
      email: user.email,
    };
  }
}
