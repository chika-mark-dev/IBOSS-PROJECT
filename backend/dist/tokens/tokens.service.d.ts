import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { IssuedTokens } from './types/token-payloads';
import { Role } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import type { Clock } from './clocks';
type IssueUser = {
    user_id: string;
    role: Role;
};
export declare class TokensService {
    private readonly refreshTokens;
    private readonly jwt;
    private readonly config;
    private readonly users;
    private readonly clock;
    constructor(refreshTokens: Repository<RefreshToken>, jwt: JwtService, config: ConfigService, users: UsersService, clock: Clock);
    issue(user: IssueUser): Promise<IssuedTokens>;
    rotate(rawToken: string): Promise<IssuedTokens>;
    revoke(rawToken: string): Promise<void>;
    revokeAll(userId: string): Promise<void>;
    private issueWith;
    private verifyRefresh;
    private tryVerifyRefresh;
    private hash;
}
export {};
