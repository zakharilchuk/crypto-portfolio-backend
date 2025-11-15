import { AuthService } from '../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterDto } from '../dtos/register.dto';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../../config/config.service';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  const mockedUserService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const mockedModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockedUserService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest
              .fn()
              .mockResolvedValueOnce('mockedAccessToken')
              .mockResolvedValueOnce('mockedRefreshToken'),
          },
        },
        {
          provide: AppConfigService,
          useValue: {
            accessTokenSecretKey: 'accessSecret',
            refreshTokenSecretKey: 'refreshSecret',
          },
        },
      ],
    }).compile();

    authService = mockedModule.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(AuthService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      const mockRegisterDto: RegisterDto = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'password123',
      };

      const mockedUser = {
        id: 1,
        name: mockRegisterDto.name,
        email: mockRegisterDto.email,
        password: 'hashedPassword',
      };

      mockedUserService.createUser.mockResolvedValue(mockedUser);

      const result = await authService.register(mockRegisterDto);

      expect(mockedUserService.createUser).toHaveBeenCalledWith({
        name: mockRegisterDto.name,
        email: mockRegisterDto.email,
        password: mockRegisterDto.password,
      });
      expect(result).toHaveProperty('accessToken', 'mockedAccessToken');
      expect(result).toHaveProperty('refreshToken', 'mockedRefreshToken');
    });

    it('should return 409 if email already exists', async () => {
      const mockedRegisterDTO = {
        name: 'Jane',
        email: 'alreadyexisting@gmail.com',
        password: 'pass123',
      };

      mockedUserService.createUser.mockRejectedValue(
        new Error('user with this email already exists'),
      );

      await expect(authService.register(mockedRegisterDTO)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
