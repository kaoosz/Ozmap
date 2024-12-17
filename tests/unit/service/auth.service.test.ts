import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../../src/service/auth.service';
import { UserRepository } from '../../../src/repository/user.repository';
import { IUser } from '../../../src/models/IUser.interface';
import { LoginDto } from '../../../src/dto/auth.dto';
import { Types } from 'mongoose';

interface MockUserRepository extends UserRepository {
  findOneByEmail: jest.Mock<Promise<IUser | null>, [string]>;
}

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    userRepository = {
      findOneByEmail: jest.fn(),
    } as unknown as MockUserRepository;

    authService = new AuthService(userRepository);
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    test('should return a user if credentials are valid', async () => {
      const userId = new Types.ObjectId();
      const mockUser: IUser = {
        _id: userId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        address: 'Some Address',
        coordinates: [0, 0],
        regions: [],
        created_at: new Date(),
      };

      userRepository.findOneByEmail.mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual(mockUser);
    });

    test('should return null if user is not found', async () => {
      userRepository.findOneByEmail.mockResolvedValueOnce(null);

      const result = await authService.validateUser(
        'unknown@example.com',
        'password',
      );
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
        'unknown@example.com',
      );
      expect(result).toBeNull();
    });

    test('should return null if password is invalid', async () => {
      const userId = new Types.ObjectId();
      const mockUser: IUser = {
        _id: userId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        address: 'Some Address',
        coordinates: [0, 0],
        regions: [],
        created_at: new Date(),
      };

      userRepository.findOneByEmail.mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

      const result = await authService.validateUser(
        'test@example.com',
        'wrongPassword',
      );
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    test('should return an access token for valid credentials', async () => {
      const userId = new Types.ObjectId();
      const mockUser: IUser = {
        _id: userId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        address: 'Some Address',
        coordinates: [0, 0],
        regions: [],
        created_at: new Date(),
      };

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      userRepository.findOneByEmail.mockResolvedValueOnce(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(true as never)
        .mockResolvedValueOnce(true as never);

      jest.spyOn(jwt, 'sign').mockReturnValue('mockAccessToken' as any);

      const result = await authService.login(loginDto);
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(result).toEqual({ accessToken: 'mockAccessToken' });
    });
  });
});
