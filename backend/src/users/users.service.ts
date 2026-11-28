import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(userEnteredData: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userEnteredData.email },
    });
    if (existingUser) {
      throw new ConflictException('User already exist');
    }
    const createdUser = await this.userRepository.create({
      name: userEnteredData.name,
      email: userEnteredData.email,
      password: userEnteredData.password,
      student_school_id: userEnteredData.student_school_id,
    });
    return await this.userRepository.save(createdUser);
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    return user;
  }
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email })
      .getOne();
  }
  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  findManyByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return Promise.resolve([]);
    return this.userRepository.find({ where: { user_id: In(ids) } });
  }
}
