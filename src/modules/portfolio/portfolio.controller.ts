import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dtos/create-portfolio.dto';
import { User } from '../../common/decorators/user.decorator';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { UpdatePortfolioDto } from './dtos/update-portfolio.dto';

@UseGuards(AccessTokenGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  public async getPortfolios(@User('id') userId: number) {
    return await this.portfolioService.getPortfoliosByUserId(userId);
  }

  @Get(':id')
  public async getPortfolioById(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
  ) {
    return await this.portfolioService.getPortfolioById(id, userId);
  }

  @Post()
  public async createPortfolio(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @User('id') userId: number,
  ) {
    return await this.portfolioService.createPortfolio(
      createPortfolioDto,
      userId,
    );
  }

  @Put(':id')
  public async updatePortfolio(
    @Param('id', ParseIntPipe) portfolioId: number,
    @User('id') userId: number,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    return await this.portfolioService.updatePortfolio(
      portfolioId,
      userId,
      updatePortfolioDto,
    );
  }
}
