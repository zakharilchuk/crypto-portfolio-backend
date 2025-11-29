import {
  Body,
  Controller,
  Delete,
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AccessTokenGuard)
@ApiTags('Portfolio')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get all portfolios for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Portfolios retrieved successfully',
  })
  public async getPortfolios(@User('id') userId: number) {
    return await this.portfolioService.getPortfoliosByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a portfolio by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Portfolio retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid ID' })
  @ApiResponse({ status: 403, description: 'Forbidden. Access denied' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  public async getPortfolioById(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
  ) {
    return await this.portfolioService.getPortfolioById(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new portfolio' })
  @ApiResponse({ status: 201, description: 'Portfolio created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation errors' })
  public async createPortfolio(
    @User('id') userId: number,
    @Body() createPortfolioDto: CreatePortfolioDto,
  ) {
    return await this.portfolioService.createPortfolio(
      userId,
      createPortfolioDto,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing portfolio' })
  @ApiResponse({ status: 200, description: 'Portfolio updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden. Access denied' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio' })
  @ApiResponse({ status: 200, description: 'Portfolio deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Access denied' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  public async deletePortfolio(
    @Param('id', ParseIntPipe) portfolioId: number,
    @User('id') userId: number,
  ) {
    await this.portfolioService.deletePortfolio(portfolioId, userId);
    return { message: 'Portfolio deleted successfully' };
  }
}
