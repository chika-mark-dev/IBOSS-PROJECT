import { Role } from "../users/entities/user.entity";
export interface AuthUser {
    id: string;
    role: Role;
}
export declare const CurrentUser: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof AuthUser | undefined)[]) => ParameterDecorator;
