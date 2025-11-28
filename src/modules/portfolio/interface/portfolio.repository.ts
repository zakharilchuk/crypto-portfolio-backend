import { PortfolioType } from '../enums/portfolio-type.enum';
import { Portfolio } from '../portfolio.entity';

export const PORTFOLIO_REPOSITORY = Symbol.for('PORTFOLIO_REPOSITORY');

export interface IPortfolioRepository {
  findById(portfolioId: number): Promise<Portfolio | null>;
  findByUserId(userId: number): Promise<Portfolio[]>;
  createPortfolio(
    name: string,
    userId: number,
    type: PortfolioType,
  ): Promise<Portfolio>;
  updatePortfolio(portfolioId: number, name: string): Promise<Portfolio | null>;
}
