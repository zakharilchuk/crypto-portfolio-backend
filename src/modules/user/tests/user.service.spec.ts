import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { USER_REPOSITORY } from '../interface/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('fakesaltvalue'),
  hash: jest.fn().mockResolvedValue('somehashedpassword'),
}));

describe('UserService', () => {
  let userService: UserService;
  const mockedUserRepository = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockedModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: mockedUserRepository,
        },
      ],
    }).compile();

    userService = mockedModule.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(UserService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'password123',
      };

      mockedUserRepository.findByEmail.mockResolvedValue(null);
      mockedUserRepository.createUser.mockResolvedValue({
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
        password: 'somehashedPassword',
      });

      const user = await userService.createUser(createUserDto);
      expect(user).toBeDefined();
      expect(user.email).toBe(createUserDto.email);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockedUserRepository.createUser).toHaveBeenCalled();
    });

    it('should throw an error if user with email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'alreadyexisting@gmail.com',
        password: 'password123',
      };

      mockedUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: 'Existing User',
        email: createUserDto.email,
        password: 'hashedPassword',
      });

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockedUserRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw an error if invalid data is provided', async () => {
      const createUserDto: CreateUserDto = {
        name: '',
        email: 'invalidemail',
        password: '123',
      };

      await expect(userService.createUser(createUserDto)).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      const email = 'alreadyexisting@gmail.com';
      const mockedUser = {
        id: 1,
        name: 'Existing User',
        email: email,
        password: 'hashedPassword',
      };

      mockedUserRepository.findByEmail.mockResolvedValue(mockedUser);

      const user = await userService.findByEmail(email);
      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should return null if user not found', async () => {
      const email = 'nonexisting@gmail.com';

      mockedUserRepository.findByEmail.mockResolvedValue(null);
      const user = await userService.findByEmail(email);
      expect(user).toBeNull();
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });
});
