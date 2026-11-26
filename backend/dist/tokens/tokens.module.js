"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const tokens_service_1 = require("./tokens.service");
const clocks_1 = require("./clocks");
const users_module_1 = require("../users/users.module");
let TokensModule = class TokensModule {
};
exports.TokensModule = TokensModule;
exports.TokensModule = TokensModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([refresh_token_entity_1.RefreshToken]),
            jwt_1.JwtModule.register({}),
            users_module_1.UsersModule,
        ],
        providers: [tokens_service_1.TokensService, { provide: clocks_1.CLOCK, useClass: clocks_1.SystemClock }],
        exports: [tokens_service_1.TokensService],
    })
], TokensModule);
//# sourceMappingURL=tokens.module.js.map