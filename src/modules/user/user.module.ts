import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY } from './interface/user.repository';
import { UserService } from './user.service';
import { Portfolio } from '../portfolio/portfolio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Portfolio])],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
