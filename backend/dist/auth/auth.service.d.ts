import { UsersService } from "../users/users.service";
import { RegisterDto } from "../users/dto/create-user.dto";
import { LoginDto } from "../users/dto/user-login.dto";
import { Role } from "../users/entities/user.entity";
import { TokensService } from "../tokens/tokens.service";
export declare class AuthService {
    private readonly userService;
    private readonly tokenService;
    constructor(userService: UsersService, tokenService: TokensService);
    register(userEnteredData: RegisterDto): Promise<import("src/users/entities/user.entity").User>;
    login(userData: LoginDto): Promise<(user: {
        user_id: string;
        role: Role;
    }) => Promise<import("../tokens/types/token-payloads").IssuedTokens>>;
    refresh(rawToken: string): Promise<import("../tokens/types/token-payloads").IssuedTokens>;
    logout(rawToken: string): Promise<void>;
    private bycryptHash;
    private bycryptComparePassword;
}
