import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(userEnteredData: RegisterDto): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findByEmailWithPassword(email: string): Promise<User | null>;
    findById(userId: string): Promise<User>;
}
