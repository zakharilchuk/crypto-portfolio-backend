import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PORTFOLIO_REPOSITORY } from './interface/portfolio.repository';
import type { IPortfolioRepository } from './interface/portfolio.repository';
import { CreatePortfolioDto } from './dtos/create-portfolio.dto';
import { UpdatePortfolioDto } from './dtos/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @Inject(PORTFOLIO_REPOSITORY)
    private readonly portfolioRepository: IPortfolioRepository,
  ) {}

  public async getPortfolioById(portfolioId: number, userId: number) {
    const portfolio = await this.portfolioRepository.findById(portfolioId);

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('Access to this portfolio is forbidden');
    }

    return portfolio;
  }

  public async getPortfoliosByUserId(userId: number) {
    return await this.portfolioRepository.findByUserId(userId);
  }

  public async createPortfolio(
    userId: number,
    createPortfolioDto: CreatePortfolioDto,
  ) {
    return await this.portfolioRepository.createPortfolio(
      createPortfolioDto.name,
      userId,
      createPortfolioDto.type,
    );
  }

  public async updatePortfolio(
    portfolioId: number,
    userId: number,
    updatePortfolioDto: UpdatePortfolioDto,
  ) {
    const portfolio = await this.portfolioRepository.findById(portfolioId);
    if (!portfolio) throw new NotFoundException('Portfolio not found');

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('Access forbidden');
    }

    const updated = await this.portfolioRepository.updatePortfolio(
      portfolioId,
      updatePortfolioDto.name,
    );

    return updated;
  }

  public async deletePortfolio(portfolioId: number, userId: number) {
    const portfolio = await this.portfolioRepository.findById(portfolioId);
    if (!portfolio) throw new NotFoundException('Portfolio not found');

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('Access forbidden');
    }

    await this.portfolioRepository.deletePortfolio(portfolioId);
  }
}
