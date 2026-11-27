import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Role } from "../users/entities/user.entity";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: {
        sub: string;
        role: Role;
    }): {
        id: string;
        role: Role;
    };
}
export {};
