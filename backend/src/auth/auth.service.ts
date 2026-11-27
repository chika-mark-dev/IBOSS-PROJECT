import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/user-login.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/users/entities/user.entity';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokensService,
  ) {}

  async register(userEnteredData: RegisterDto) {
    const hashedPassword = await this.bycryptHash(userEnteredData.password);
    const registeredUser = await this.userService.create({
      ...userEnteredData,
      password: hashedPassword,
    });
    return this.tokenService.issue(registeredUser);
  }

  async login(userData: LoginDto) {
    const user = await this.userService.findByEmailWithPassword(userData.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await this.bycryptComparePassword(
      userData.password,
      user.password,
    );
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.tokenService.issue(user);
  }
  async refresh(rawToken: string) {
    return this.tokenService.rotate(rawToken);
  }

  async logout(rawToken: string) {
    await this.tokenService.revoke(rawToken);
  }
  private bycryptHash(password: string) {
    const hashedPassword = bcrypt.hash(password, 12);
    return hashedPassword;
  }

  private bycryptComparePassword(
    userEnteredPasswor: string,
    dataBasePassword: string,
  ) {
    const comparedPassword = bcrypt.compare(
      userEnteredPasswor,
      dataBasePassword,
    );
    return comparedPassword;
  }
}
