import { UsersService } from "../users/users.service";
import { RegisterDto } from "../users/dto/create-user.dto";
import { LoginDto } from "../users/dto/user-login.dto";
import { TokensService } from "../tokens/tokens.service";
export declare class AuthService {
    private readonly userService;
    private readonly tokenService;
    constructor(userService: UsersService, tokenService: TokensService);
    register(userEnteredData: RegisterDto): Promise<import("../tokens/types/token-payloads").IssuedTokens>;
    login(userData: LoginDto): Promise<import("../tokens/types/token-payloads").IssuedTokens>;
    refresh(rawToken: string): Promise<import("../tokens/types/token-payloads").IssuedTokens>;
    logout(rawToken: string): Promise<void>;
    private bycryptHash;
    private bycryptComparePassword;
}
