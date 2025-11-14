import { User } from '../user.entity';

export const USER_REPOSITORY = Symbol.for('USER_REPOSITORY');

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(name: string, email: string, password: string): Promise<User>;
}
