import { AuthService } from './auth.service';
import { RegisterDto } from "../users/dto/create-user.dto";
import { LoginDto } from "../users/dto/user-login.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(userEnteredData: RegisterDto): Promise<import("../tokens/types/token-payloads").IssuedTokens>;
    login(loginData: LoginDto): Promise<import("../tokens/types/token-payloads").IssuedTokens>;
    refresh(token: string): Promise<import("../tokens/types/token-payloads").IssuedTokens>;
    logout(token: string): Promise<void>;
}
