"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcryptjs"));
const tokens_service_1 = require("../tokens/tokens.service");
let AuthService = class AuthService {
    userService;
    tokenService;
    constructor(userService, tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }
    async register(userEnteredData) {
        const hashedPassword = await this.bycryptHash(userEnteredData.password);
        userEnteredData.password = hashedPassword;
        const registeredUser = this.userService.create(userEnteredData);
        return registeredUser;
    }
    async login(userData) {
        const user = await this.userService.findByEmail(userData.email);
        const ok = this.bycryptComparePassword(userData.password, user.password);
        if (!ok) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.tokenService.issue;
    }
    async refresh(rawToken) {
        return this.tokenService.rotate(rawToken);
    }
    async logout(rawToken) {
        await this.tokenService.revoke(rawToken);
    }
    bycryptHash(password) {
        const hashedPassword = bcrypt.hash(password, 12);
        return hashedPassword;
    }
    bycryptComparePassword(userEnteredPasswor, dataBasePassword) {
        const comparedPassword = bcrypt.compare(userEnteredPasswor, dataBasePassword);
        return comparedPassword;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        tokens_service_1.TokensService])
], AuthService);
//# sourceMappingURL=auth.service.js.map