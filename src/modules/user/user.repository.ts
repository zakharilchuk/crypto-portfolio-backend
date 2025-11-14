import { IUserRepository } from './interface/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = this.userRepository.create({ name, email, password });
    return await this.userRepository.save(user);
  }
}
