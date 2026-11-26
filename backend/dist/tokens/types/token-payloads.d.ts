import { Role } from '../../users/entities/user.entity';
export type AccessPayload = {
    sub: string;
    role: Role;
};
export type RefreshPayload = {
    sub: string;
    jti: string;
};
export type IssuedTokens = {
    access_token: string;
    refresh_token: string;
    token_type: 'Bearer';
    expires_in: number;
};
