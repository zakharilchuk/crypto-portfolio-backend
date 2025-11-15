import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterDto } from '../dtos/register.dto';
import { Response } from 'express';
import { ConflictException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('AuthController', () => {
  let authController: AuthController;
  const mockedAuthService = {
    register: jest.fn(),
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  };

  const mockedResponse = {
    status: jest.fn().mockReturnThis(),
    cookie: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const mockedAcessToken = 'mockedAccessToken';
  const mockedRefreshToken = 'mockedRefreshToken';

  beforeEach(async () => {
    const mockedModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },
      ],
    }).compile();

    authController = mockedModule.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(AuthController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return access token with refresh token cookie', async () => {
      const mockRegisterDto: RegisterDto = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'password123',
      };

      mockedAuthService.register.mockResolvedValue({
        accessToken: mockedAcessToken,
        refreshToken: mockedRefreshToken,
      });
      await authController.register(mockRegisterDto, mockedResponse);

      expect(mockedAuthService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(mockedResponse.status).toHaveBeenCalledWith(201);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        accessToken: mockedAcessToken,
      });
      expect(mockedResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockedRefreshToken,
        {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        },
      );
    });

    it('should return 409 with already existing data', async () => {
      const mockRegisterDto: RegisterDto = {
        name: 'John Doe',
        email: 'alreadyexists@gmail.com',
        password: 'password123',
      };

      mockedAuthService.register.mockRejectedValueOnce(
        new ConflictException(
          'Registration failed: User with this email already exists',
        ),
      );

      await expect(
        authController.register(mockRegisterDto, mockedResponse),
      ).rejects.toThrow(ConflictException);

      expect(mockedAuthService.register).toHaveBeenCalledWith(mockRegisterDto);
    });

    it('should return 400 with invalid RegisterDto field', async () => {
      const wrongMockedRegisterDto: RegisterDto = {
        name: '',
        email: 'invalidemail',
        password: '123',
      };

      const registerDto = plainToInstance(RegisterDto, wrongMockedRegisterDto);

      const errors = await validate(registerDto);

      expect(errors.length).not.toBe(0);
    });
  });
});
