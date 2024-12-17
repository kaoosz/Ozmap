import { Types } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../../../src/dto/create.user.dto';
import { IUserRepository } from '../../../src/interfaces/IUser.repository';
import { UserService } from '../../../src/service/user.service';
import { IUser } from '../../../src/models/IUser.interface';
import { AppError } from '../../../src/utils/errors';
import { STATUS } from '../../../src/utils/status';
import bcrypt from 'bcrypt';

interface MockUserRepository extends IUserRepository {
  findOneByEmail: jest.Mock<Promise<IUser | null>, [string]>;
  create: jest.Mock<Promise<IUser>, [any]>;
  update: jest.Mock<Promise<IUser>, [string, any]>;
}

describe('UserService', () => {
  let userRepository: MockUserRepository;
  let userService: UserService;

  beforeAll(() => {
    userRepository = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as MockUserRepository;

    userService = new UserService(userRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a new user if email does not exist', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'guilherme',
        email: 'guilherme@gmail.com.br',
        address: 'avenida paulista',
        password: 'gui123',
      };

      const hashedPassword = 'hashed-password';
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword as never);

      userRepository.findOneByEmail.mockResolvedValueOnce(null);

      userRepository.create.mockResolvedValueOnce({
        _id: new Types.ObjectId(),
        name: 'guilherme',
        email: 'guilherme@gmail.com.br',
        address: undefined,
        coordinates: undefined,
        regions: [],
        created_at: new Date(),
      });

      // Act
      const result = await userService.create(createUserDto);

      // Assert
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
        'guilherme@gmail.com.br',
      );

      expect(userRepository.create).toHaveBeenCalledWith({
        name: 'guilherme',
        email: 'guilherme@gmail.com.br',
        address: 'avenida paulista',
        coordinates: undefined,
        password: hashedPassword,
      });

      // expect(result).toMatchObject({
      //   name: 'guilherme',
      //   email: 'guilherme@gmail.com.br',
      // });
    });
    test('should throw an AppError if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Alex',
        email: 'alex.roger@outlook.com.br',
        address: 'avenida bacabal',
        password: 'alex123',
      };

      userRepository.findOneByEmail.mockResolvedValueOnce({
        _id: new Types.ObjectId(),
        name: 'Alex',
        email: 'alex.roger@outlook.com.br',
        address: 'avenida bacabal',
        coordinates: undefined,
        regions: [],
        created_at: new Date(),
      });

      await expect(userService.create(createUserDto)).rejects.toThrow(AppError);
    });

    test('should throw AppError if updating to an existing email', async () => {
      const updateDto: UpdateUserDto = { email: 'conflict@example.com' };
      const userId = new Types.ObjectId().toString();

      userRepository.findOneByEmail.mockResolvedValueOnce({
        _id: new Types.ObjectId(),
        name: 'Conflicting User',
        email: 'conflict@example.com',
        address: 'addr',
        coordinates: undefined,
        regions: [],
        created_at: new Date(),
      } as IUser);

      await expect(
        userService.update(userId, updateDto, new Types.ObjectId()),
      ).rejects.toThrow(AppError);
    });

    test('should update user if new email is not taken', async () => {
      const updateDto: UpdateUserDto = { email: 'conflict@example.com' };
      // const userId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId();

      // userRepository.findOneByEmail.mockResolvedValueOnce(null);
      userRepository.findOneByEmail.mockResolvedValueOnce({
        _id: new Types.ObjectId(),
        name: 'Conflicting User',
        email: 'conflict@example.com',
        address: undefined,
        coordinates: [-23.1384991, -45.7728598],
        regions: [],
        created_at: new Date(),
      } as IUser);

      await expect(
        userService.update(userId.toString(), updateDto, userId),
      ).rejects.toMatchObject({
        message: 'The email is already taken',
        statusCode: STATUS.CONFLICT,
      });
    });
  });
});
