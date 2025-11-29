import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPortfolioRepository } from './interface/portfolio.repository';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioType } from './enums/portfolio-type.enum';

@Injectable()
export class PortfolioRepository implements IPortfolioRepository {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  async findById(portfolioId: number): Promise<Portfolio | null> {
    return this.portfolioRepository.findOne({ where: { id: portfolioId } });
  }

  async findByUserId(userId: number): Promise<Portfolio[]> {
    return this.portfolioRepository.find({ where: { userId } });
  }

  async createPortfolio(
    name: string,
    userId: number,
    type: PortfolioType,
  ): Promise<Portfolio> {
    const portfolio = this.portfolioRepository.create({ name, userId, type });
    return this.portfolioRepository.save(portfolio);
  }

  async updatePortfolio(
    portfolioId: number,
    name: string,
  ): Promise<Portfolio | null> {
    const updateResult = await this.portfolioRepository.update(portfolioId, {
      name,
    });
    return updateResult.affected ? this.findById(portfolioId) : null;
  }

  async deletePortfolio(portfolioId: number): Promise<void> {
    await this.portfolioRepository.delete(portfolioId);
  }
}
