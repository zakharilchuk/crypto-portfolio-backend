import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';

export const USER_REPOSITORY = Symbol.for('USER_REPOSITORY');

export interface IUserRepository {
  findById(userId: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createUser(createUserDto: CreateUserDto): Promise<User>;
}
