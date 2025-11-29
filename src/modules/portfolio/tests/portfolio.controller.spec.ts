import { PortfolioController } from '../portfolio.controller';
import { Test } from '@nestjs/testing';
import { PortfolioService } from '../portfolio.service';
import { CreatePortfolioDto } from '../dtos/create-portfolio.dto';
import { PortfolioType } from '../enums/portfolio-type.enum';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('PortfolioController', () => {
  let portfolioController: PortfolioController;
  const mockedPortfolioService = {
    getPortfoliosByUserId: jest.fn(),
    getPortfolioById: jest.fn(),
    createPortfolio: jest.fn(),
    updatePortfolio: jest.fn(),
    deletePortfolio: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [PortfolioController],
      providers: [
        {
          provide: PortfolioService,
          useValue: mockedPortfolioService,
        },
      ],
    }).compile();

    portfolioController =
      moduleRef.get<PortfolioController>(PortfolioController);
  });

  it('should be defined', () => {
    expect(PortfolioController).toBeDefined();
  });

  describe("get all user's portfolios", () => {
    it('should return an array of portfolios', async () => {
      const userId = 1;
      const result = [{ id: 1, name: 'Portfolio 1', type: 'manual' }];
      mockedPortfolioService.getPortfoliosByUserId.mockResolvedValue(result);

      const portfolios = await portfolioController.getPortfolios(userId);

      expect(portfolios).toEqual(result);
      expect(mockedPortfolioService.getPortfoliosByUserId).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should return empty array if no portfolios exist', async () => {
      const userId = 1;
      mockedPortfolioService.getPortfoliosByUserId.mockResolvedValue([]);

      const portfolios = await portfolioController.getPortfolios(userId);

      expect(portfolios).toEqual([]);
    });
  });

  describe('get portfolio by id', () => {
    it('should return a portfolio', async () => {
      const userId = 1;
      const portfolioId = 1;
      const result = { id: portfolioId, name: 'Portfolio 1', type: 'manual' };
      mockedPortfolioService.getPortfolioById.mockResolvedValue(result);

      const portfolio = await portfolioController.getPortfolioById(
        portfolioId,
        userId,
      );

      expect(portfolio).toEqual(result);
      expect(mockedPortfolioService.getPortfolioById).toHaveBeenCalledWith(
        portfolioId,
        userId,
      );
    });

    it('should return NotFound when portfolio does not exist', async () => {
      const userId = 1;
      const portfolioId = 1;
      mockedPortfolioService.getPortfolioById.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(
        portfolioController.getPortfolioById(portfolioId, userId),
      ).rejects.toThrow(NotFoundException);
      expect(mockedPortfolioService.getPortfolioById).toHaveBeenCalledWith(
        portfolioId,
        userId,
      );
    });

    it('should return Forbidden when user does not own portfolio', async () => {
      const userId = 1;
      const portfolioId = 1;
      mockedPortfolioService.getPortfolioById.mockRejectedValueOnce(
        new ForbiddenException(),
      );

      await expect(
        portfolioController.getPortfolioById(portfolioId, userId),
      ).rejects.toThrow(ForbiddenException);
      expect(mockedPortfolioService.getPortfolioById).toHaveBeenCalledWith(
        portfolioId,
        userId,
      );
    });
  });

  describe('create portfolio', () => {
    it('should create a portfolio', async () => {
      const userId = 1;
      const createPortfolioDto: CreatePortfolioDto = {
        name: 'Portfolio 1',
        type: PortfolioType.MANUAL,
      };
      const result = { id: 1, ...createPortfolioDto, userId };
      mockedPortfolioService.createPortfolio.mockResolvedValue(result);

      const portfolio = await portfolioController.createPortfolio(
        userId,
        createPortfolioDto,
      );

      expect(portfolio).toEqual(result);
      expect(mockedPortfolioService.createPortfolio).toHaveBeenCalledWith(
        userId,
        createPortfolioDto,
      );
    });

    it('should return BadRequests when CreatePortfolioDto is invalid', async () => {
      const userId = 1;
      const createPortfolioDto = {
        name: '',
        type: PortfolioType.MANUAL,
      };
      const result = { id: 1, ...createPortfolioDto, userId };
      mockedPortfolioService.createPortfolio.mockResolvedValue(result);

      const portfolio = await portfolioController.createPortfolio(
        userId,
        createPortfolioDto,
      );

      const createDto = plainToInstance(CreatePortfolioDto, createPortfolioDto);
      const errors = await validate(createDto);

      expect(errors.length).toBeGreaterThan(0);
      expect(portfolio).toEqual(result);
      expect(mockedPortfolioService.createPortfolio).toHaveBeenCalledWith(
        userId,
        createPortfolioDto,
      );
    });
  });

  describe('update portfolio', () => {
    it('should update a portfolio', async () => {
      const userId = 1;
      const portfolioId = 1;
      const updatePortfolioDto = {
        name: 'Updated Portfolio',
      };
      const result = { id: portfolioId, ...updatePortfolioDto, userId };
      mockedPortfolioService.updatePortfolio.mockResolvedValue(result);

      const portfolio = await portfolioController.updatePortfolio(
        portfolioId,
        userId,
        updatePortfolioDto,
      );

      expect(portfolio).toEqual(result);
      expect(mockedPortfolioService.updatePortfolio).toHaveBeenCalledWith(
        portfolioId,
        userId,
        updatePortfolioDto,
      );
    });

    it('should return NotFound when portfolio does not exist', async () => {
      const userId = 1;
      const portfolioId = 1;
      const updatePortfolioDto = {
        name: 'Updated Portfolio',
      };
      mockedPortfolioService.updatePortfolio.mockRejectedValueOnce(
        new NotFoundException('Portfolio not found'),
      );

      await expect(
        portfolioController.updatePortfolio(
          portfolioId,
          userId,
          updatePortfolioDto,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(mockedPortfolioService.updatePortfolio).toHaveBeenCalledWith(
        portfolioId,
        userId,
        updatePortfolioDto,
      );
    });

    it('should return AccessForbidden when user does not own portfolio', async () => {
      const userId = 1;
      const portfolioId = 1;
      const updatePortfolioDto = {
        name: 'Updated Portfolio',
      };
      mockedPortfolioService.updatePortfolio.mockRejectedValueOnce(
        new ForbiddenException(),
      );

      await expect(
        portfolioController.updatePortfolio(
          portfolioId,
          userId,
          updatePortfolioDto,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(mockedPortfolioService.updatePortfolio).toHaveBeenCalledWith(
        portfolioId,
        userId,
        updatePortfolioDto,
      );
    });
  });

  describe('delete portfolio', () => {
    it('should delete a portfolio', async () => {
      const userId = 1;
      const portfolioId = 1;
      mockedPortfolioService.deletePortfolio.mockResolvedValue(undefined);

      const response = await portfolioController.deletePortfolio(
        portfolioId,
        userId,
      );

      expect(response).toEqual({ message: 'Portfolio deleted successfully' });
      expect(mockedPortfolioService.deletePortfolio).toHaveBeenCalledWith(
        portfolioId,
        userId,
      );
    });

    it('should return NotFound when portfolio does not exist', async () => {
      const userId = 1;
      const portfolioId = 1;
      mockedPortfolioService.deletePortfolio.mockRejectedValueOnce(
        new NotFoundException('Portfolio not found'),
      );

      await expect(
        portfolioController.deletePortfolio(portfolioId, userId),
      ).rejects.toThrow(NotFoundException);
      expect(mockedPortfolioService.deletePortfolio).toHaveBeenCalledWith(
        portfolioId,
        userId,
      );
    });

    it('should return AccessForbidden when user does not own portfolio', async () => {
      const userId = 1;
      const portfolioId = 1;
      mockedPortfolioService.deletePortfolio.mockRejectedValueOnce(
        new ForbiddenException(),
      );

      await expect(
        portfolioController.deletePortfolio(portfolioId, userId),
      ).rejects.toThrow(ForbiddenException);
      expect(mockedPortfolioService.deletePortfolio).toHaveBeenCalledWith(
        portfolioId,
        userId,
      );
    });
  });
});
