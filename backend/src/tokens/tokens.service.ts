import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { createHash, randomUUID } from 'crypto';

import { RefreshToken } from './entities/refresh-token.entity';
import {
  AccessPayload,
  RefreshPayload,
  IssuedTokens,
} from './types/token-payloads';
import { Role } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CLOCK } from './clocks';
import type { Clock } from './clocks';

type DecodedToken = { iat: number; exp: number };
type IssueUser = { user_id: string; role: Role };

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly users: UsersService,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async issue(user: IssueUser): Promise<IssuedTokens> {
    return this.refreshTokens.manager.transaction((em) =>
      this.issueWith(em, user),
    );
  }

  async rotate(rawToken: string): Promise<IssuedTokens> {
    const payload = await this.verifyRefresh(rawToken);
    const token_hash = this.hash(rawToken);

    const old = await this.refreshTokens.findOne({ where: { token_hash } });

    if (!old) {
      throw new UnauthorizedException('Refresh token is no longer valid');
    }

    if (old.expires_at <= this.clock.now()) {
      await this.refreshTokens.delete({ id: old.id });
      throw new UnauthorizedException('Refresh token has expired');
    }

    const user = await this.users.findById(payload.sub);

    if (!user) {
      await this.refreshTokens.delete({ id: old.id });
      throw new UnauthorizedException('User no longer exists');
    }

    return this.refreshTokens.manager.transaction(async (em) => {
      const deleted = await em.delete(RefreshToken, { id: old.id });

      if (!deleted.affected) {
        throw new UnauthorizedException('Refresh token was already rotated');
      }

      return this.issueWith(em, user);
    });
  }

  async revoke(rawToken: string): Promise<void> {
    const payload = await this.tryVerifyRefresh(rawToken);
    if (!payload) return;
    await this.refreshTokens.delete({ token_hash: this.hash(rawToken) });
  }

  async revokeAll(userId: string): Promise<void> {
    await this.refreshTokens.delete({ user_id: userId });
  }

  private async issueWith(
    em: EntityManager,
    user: IssueUser,
  ): Promise<IssuedTokens> {
    const accessPayload: AccessPayload = {
      sub: user.user_id,
      role: user.role,
    };
    const refreshPayload: RefreshPayload = {
      sub: user.user_id,
      jti: randomUUID(),
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(accessPayload, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '15m',
        ) as JwtSignOptions['expiresIn'],
      }),
      this.jwt.signAsync(refreshPayload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ) as JwtSignOptions['expiresIn'],
      }),
    ]);

    const refreshDecoded = this.jwt.decode<DecodedToken>(refresh_token);

    if (!refreshDecoded?.exp) {
      throw new InternalServerErrorException('Signed refresh token has no exp');
    }

    const expires_at = new Date(refreshDecoded.exp * 1000);
    const token_hash = this.hash(refresh_token);

    await em.save(RefreshToken, {
      user_id: user.user_id,
      jti: refreshPayload.jti,
      token_hash,
      expires_at,
    });

    const accessDecoded = this.jwt.decode<DecodedToken>(access_token);
    const expires_in =
      accessDecoded?.exp && accessDecoded?.iat
        ? accessDecoded.exp - accessDecoded.iat
        : 15 * 60;

    return {
      access_token,
      refresh_token,
      token_type: 'Bearer',
      expires_in,
    };
  }

  private async verifyRefresh(rawToken: string): Promise<RefreshPayload> {
    try {
      return await this.jwt.verifyAsync<RefreshPayload>(rawToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async tryVerifyRefresh(
    rawToken: string,
  ): Promise<RefreshPayload | null> {
    try {
      return await this.jwt.verifyAsync<RefreshPayload>(rawToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      return null;
    }
  }

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
