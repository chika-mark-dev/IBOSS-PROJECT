"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const users_service_1 = require("../users/users.service");
const clocks_1 = require("./clocks");
let TokensService = class TokensService {
    refreshTokens;
    jwt;
    config;
    users;
    clock;
    constructor(refreshTokens, jwt, config, users, clock) {
        this.refreshTokens = refreshTokens;
        this.jwt = jwt;
        this.config = config;
        this.users = users;
        this.clock = clock;
    }
    async issue(user) {
        return this.refreshTokens.manager.transaction((em) => this.issueWith(em, user));
    }
    async rotate(rawToken) {
        const payload = await this.verifyRefresh(rawToken);
        const token_hash = this.hash(rawToken);
        const old = await this.refreshTokens.findOne({ where: { token_hash } });
        if (!old) {
            throw new common_1.UnauthorizedException('Refresh token is no longer valid');
        }
        if (old.expires_at <= this.clock.now()) {
            await this.refreshTokens.delete({ id: old.id });
            throw new common_1.UnauthorizedException('Refresh token has expired');
        }
        const user = await this.users.findById(payload.sub);
        if (!user) {
            await this.refreshTokens.delete({ id: old.id });
            throw new common_1.UnauthorizedException('User no longer exists');
        }
        return this.refreshTokens.manager.transaction(async (em) => {
            const deleted = await em.delete(refresh_token_entity_1.RefreshToken, { id: old.id });
            if (!deleted.affected) {
                throw new common_1.UnauthorizedException('Refresh token was already rotated');
            }
            return this.issueWith(em, user);
        });
    }
    async revoke(rawToken) {
        const payload = await this.tryVerifyRefresh(rawToken);
        if (!payload)
            return;
        await this.refreshTokens.delete({ token_hash: this.hash(rawToken) });
    }
    async revokeAll(userId) {
        await this.refreshTokens.delete({ user_id: userId });
    }
    async issueWith(em, user) {
        const accessPayload = {
            sub: user.user_id,
            role: user.role,
        };
        const refreshPayload = {
            sub: user.user_id,
            jti: (0, crypto_1.randomUUID)(),
        };
        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(accessPayload, {
                secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
                expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
            }),
            this.jwt.signAsync(refreshPayload, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);
        const refreshDecoded = this.jwt.decode(refresh_token);
        if (!refreshDecoded?.exp) {
            throw new common_1.InternalServerErrorException('Signed refresh token has no exp');
        }
        const expires_at = new Date(refreshDecoded.exp * 1000);
        const token_hash = this.hash(refresh_token);
        await em.save(refresh_token_entity_1.RefreshToken, {
            user_id: user.user_id,
            jti: refreshPayload.jti,
            token_hash,
            expires_at,
        });
        const accessDecoded = this.jwt.decode(access_token);
        const expires_in = accessDecoded?.exp && accessDecoded?.iat
            ? accessDecoded.exp - accessDecoded.iat
            : 15 * 60;
        return {
            access_token,
            refresh_token,
            token_type: 'Bearer',
            expires_in,
        };
    }
    async verifyRefresh(rawToken) {
        try {
            return await this.jwt.verifyAsync(rawToken, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async tryVerifyRefresh(rawToken) {
        try {
            return await this.jwt.verifyAsync(rawToken, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            return null;
        }
    }
    hash(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
};
exports.TokensService = TokensService;
exports.TokensService = TokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __param(4, (0, common_1.Inject)(clocks_1.CLOCK)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService, Object])
], TokensService);
//# sourceMappingURL=tokens.service.js.map