import { IUserRepository } from './interface/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findById(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
    });
    return await this.userRepository.save(user);
  }
}
