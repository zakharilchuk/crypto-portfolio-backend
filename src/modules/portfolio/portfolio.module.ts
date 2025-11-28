import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PORTFOLIO_REPOSITORY } from './interface/portfolio.repository';
import { PortfolioRepository } from './portfolio.repository';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './portfolio.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, User])],
  providers: [
    PortfolioService,
    {
      provide: PORTFOLIO_REPOSITORY,
      useClass: PortfolioRepository,
    },
  ],
  controllers: [PortfolioController],
  exports: [PortfolioService],
})
export class PortfolioModule {}
