import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterDto } from '../dtos/register.dto';
import { Request, Response } from 'express';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dtos/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  const mockedAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
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
    jest.clearAllMocks();
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

  describe('login', () => {
    it('should login a user and return access token with refresh token cookie', async () => {
      const mockLoginDto: LoginDto = {
        email: 'johndoe@gmail.com',
        password: 'password123',
      };

      mockedAuthService.login.mockResolvedValue({
        accessToken: mockedAcessToken,
        refreshToken: mockedRefreshToken,
      });
      await authController.login(mockLoginDto, mockedResponse);

      expect(mockedAuthService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(mockedResponse.status).toHaveBeenCalledWith(200);
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

    it('should return 400 with invalid LoginDto field', async () => {
      const wrongMockerLoginDto: LoginDto = {
        email: 'invalidemail',
        password: '',
      };

      const loginDto = plainToInstance(LoginDto, wrongMockerLoginDto);

      const errors = await validate(loginDto);

      expect(errors.length).not.toBe(0);
    });

    it('should return 401 when email or password is incorrect', async () => {
      const mockLoginDto: LoginDto = {
        email: 'invalidemail@gmail.com',
        password: '222222',
      };

      mockedAuthService.login.mockRejectedValueOnce(
        new UnauthorizedException('Invalid email or password'),
      );

      await expect(
        authController.login(mockLoginDto, mockedResponse),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockedAuthService.login).toHaveBeenCalledWith(mockLoginDto);
    });
  });

  describe('refresh', () => {
    const mockRefreshToken = 'existingRefreshToken';
    const mockAccessToken = 'newAccessToken';
    const mockNewRefreshToken = 'newRefreshToken';
    it('should refresh tokens successfully', async () => {
      const mockedRequest = {
        cookies: {
          refreshToken: mockRefreshToken,
        },
      } as unknown as Request;
      mockedAuthService.refreshTokens.mockResolvedValue({
        accessToken: mockAccessToken,
        newRefreshToken: mockNewRefreshToken,
      });

      await authController.refresh(mockedRequest, mockedResponse);

      expect(mockedAuthService.refreshTokens).toHaveBeenCalledWith(
        mockRefreshToken,
      );
      expect(mockedResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockNewRefreshToken,
        { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
      );
      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        accessToken: mockAccessToken,
      });
    });

    it('should return 401 if refreshToken is missing', async () => {
      const mockedRequest = {
        cookies: {},
      } as unknown as Request;

      await authController.refresh(mockedRequest, mockedResponse);
      expect(mockedAuthService.refreshTokens).not.toHaveBeenCalled();

      expect(mockedResponse.status).toHaveBeenCalledWith(401);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: 'Refresh token missing',
      });
    });
  });

  describe('logout', () => {
    it('should successfully log out by cleaning cookies', () => {
      const mockedLogoutResponse = {
        clearCookie: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      authController.logOut(mockedLogoutResponse);

      expect(mockedLogoutResponse.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
      );
      expect(mockedLogoutResponse.json).toHaveBeenCalled();
    });
  });
});
