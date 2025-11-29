import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from '../portfolio.service';
import { PORTFOLIO_REPOSITORY } from '../interface/portfolio.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePortfolioDto } from '../dtos/create-portfolio.dto';
import { PortfolioType } from '../enums/portfolio-type.enum';

describe('PortfolioService', () => {
  let portfolioService: PortfolioService;
  const mockedPortfolioRepository = {
    findById: jest.fn(),
    findByUserId: jest.fn(),
    createPortfolio: jest.fn(),
    updatePortfolio: jest.fn(),
    deletePortfolio: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: PORTFOLIO_REPOSITORY,
          useValue: mockedPortfolioRepository,
        },
      ],
    }).compile();
    portfolioService = moduleRef.get<PortfolioService>(PortfolioService);
  });

  it('should be defined', () => {
    expect(PortfolioService).toBeDefined();
  });

  describe('get portfolio by id', () => {
    it('should return a portfolio if found and belongs to user', async () => {
      const portfolioId = 1;
      const userId = 1;
      const mockedPortfolio = {
        id: portfolioId,
        userId: userId,
        name: 'My Portfolio',
        type: 'manual',
      };
      mockedPortfolioRepository.findById.mockResolvedValue(mockedPortfolio);

      const portfolio = await portfolioService.getPortfolioById(
        portfolioId,
        userId,
      );

      expect(portfolio).toEqual(mockedPortfolio);
      expect(mockedPortfolioRepository.findById).toHaveBeenCalledWith(
        portfolioId,
      );
    });

    it('should throw NotFoundException if portfolio does not exist', async () => {
      const portfolioId = 1;
      const userId = 1;
      mockedPortfolioRepository.findById.mockResolvedValue(null);

      await expect(
        portfolioService.getPortfolioById(portfolioId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if portfolio does not belong to user', async () => {
      const portfolioId = 1;
      const userId = 1;
      const mockedPortfolio = {
        id: portfolioId,
        userId: 2,
        name: 'Other Portfolio',
        type: 'manual',
      };
      mockedPortfolioRepository.findById.mockResolvedValue(mockedPortfolio);

      await expect(
        portfolioService.getPortfolioById(portfolioId, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('get portfolios by user id', () => {
    it('should return an array of portfolios for the user', async () => {
      const userId = 1;
      const mockedPortfolios = [
        { id: 1, userId: userId, name: 'Portfolio 1', type: 'manual' },
        { id: 2, userId: userId, name: 'Portfolio 2', type: 'binance' },
      ];
      mockedPortfolioRepository.findByUserId.mockResolvedValue(
        mockedPortfolios,
      );

      const portfolios = await portfolioService.getPortfoliosByUserId(userId);

      expect(portfolios).toEqual(mockedPortfolios);
      expect(mockedPortfolioRepository.findByUserId).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should return an empty array if user has no portfolios', async () => {
      const userId = 1;
      mockedPortfolioRepository.findByUserId.mockResolvedValue([]);

      const portfolios = await portfolioService.getPortfoliosByUserId(userId);

      expect(portfolios).toEqual([]);
      expect(mockedPortfolioRepository.findByUserId).toHaveBeenCalledWith(
        userId,
      );
    });
  });

  describe('create portfolio', () => {
    it('should create and return a new portfolio', async () => {
      const userId = 1;
      const createPortfolioDto: CreatePortfolioDto = {
        name: 'New Portfolio',
        type: PortfolioType.MANUAL,
      };
      const mockedCreatedPortfolio = {
        id: 1,
        userId: userId,
        name: createPortfolioDto.name,
        type: createPortfolioDto.type,
      };
      mockedPortfolioRepository.createPortfolio.mockResolvedValue(
        mockedCreatedPortfolio,
      );

      const portfolio = await portfolioService.createPortfolio(
        userId,
        createPortfolioDto,
      );

      expect(portfolio).toEqual(mockedCreatedPortfolio);
      expect(mockedPortfolioRepository.createPortfolio).toHaveBeenCalledWith(
        createPortfolioDto.name,
        userId,
        createPortfolioDto.type,
      );
    });
  });

  describe('update portfolio', () => {
    it('should update and return the portfolio if it exists and belongs to user', async () => {
      const portfolioId = 1;
      const userId = 1;
      const updatePortfolioDto = { name: 'Updated Portfolio' };
      const mockedPortfolio = {
        id: portfolioId,
        userId: userId,
        name: 'Old Portfolio',
        type: 'manual',
      };
      const mockedUpdatedPortfolio = {
        ...mockedPortfolio,
        name: updatePortfolioDto.name,
      };

      mockedPortfolioRepository.findById.mockResolvedValue(mockedPortfolio);
      mockedPortfolioRepository.updatePortfolio.mockResolvedValue(
        mockedUpdatedPortfolio,
      );

      const updatedPortfolio = await portfolioService.updatePortfolio(
        portfolioId,
        userId,
        updatePortfolioDto,
      );

      expect(updatedPortfolio).toEqual(mockedUpdatedPortfolio);
      expect(mockedPortfolioRepository.findById).toHaveBeenCalledWith(
        portfolioId,
      );
      expect(mockedPortfolioRepository.updatePortfolio).toHaveBeenCalledWith(
        portfolioId,
        updatePortfolioDto.name,
      );
    });

    it('should throw NotFoundException if portfolio does not exist', async () => {
      const portfolioId = 1;
      const userId = 1;
      const updatePortfolioDto = { name: 'Updated Portfolio' };

      mockedPortfolioRepository.findById.mockResolvedValue(null);

      await expect(
        portfolioService.updatePortfolio(
          portfolioId,
          userId,
          updatePortfolioDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if portfolio does not belong to user', async () => {
      const portfolioId = 1;
      const userId = 1;
      const updatePortfolioDto = { name: 'Updated Portfolio' };
      const mockedPortfolio = {
        id: portfolioId,
        userId: 2,
        name: 'Other Portfolio',
        type: 'manual',
      };

      mockedPortfolioRepository.findById.mockResolvedValue(mockedPortfolio);

      await expect(
        portfolioService.updatePortfolio(
          portfolioId,
          userId,
          updatePortfolioDto,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete portfolio', () => {
    it('should delete the portfolio if it exists and belongs to user', async () => {
      const portfolioId = 1;
      const userId = 1;
      const mockedPortfolio = {
        id: portfolioId,
        userId: userId,
        name: 'My Portfolio',
        type: 'manual',
      };

      mockedPortfolioRepository.findById.mockResolvedValue(mockedPortfolio);
      mockedPortfolioRepository.deletePortfolio.mockResolvedValue(undefined);

      await portfolioService.deletePortfolio(portfolioId, userId);

      expect(mockedPortfolioRepository.findById).toHaveBeenCalledWith(
        portfolioId,
      );
      expect(mockedPortfolioRepository.deletePortfolio).toHaveBeenCalledWith(
        portfolioId,
      );
    });

    it('should throw NotFoundException if portfolio does not exist', async () => {
      const portfolioId = 1;
      const userId = 1;

      mockedPortfolioRepository.findById.mockResolvedValue(null);

      await expect(
        portfolioService.deletePortfolio(portfolioId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if portfolio does not belong to user', async () => {
      const portfolioId = 1;
      const userId = 1;
      const mockedPortfolio = {
        id: portfolioId,
        userId: 2,
        name: 'Other Portfolio',
        type: 'manual',
      };

      mockedPortfolioRepository.findById.mockResolvedValue(mockedPortfolio);

      await expect(
        portfolioService.deletePortfolio(portfolioId, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
