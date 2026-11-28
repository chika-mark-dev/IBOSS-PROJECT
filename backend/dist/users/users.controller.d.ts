import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(current: {
        id: string;
    }): Promise<{
        id: string;
        name: string;
        role: import("./entities/user.entity").Role;
        email: string;
    }>;
}
