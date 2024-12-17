import { UserController } from '../../../src/controller/user.controller';
import { UserService } from '../../../src/service/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from '../../../src/dto/create.user.dto';
import { Request, Response } from 'express';
import { STATUS } from '../../../src/utils/status';
import { AppError } from '../../../src/utils/errors';
import { Types } from 'mongoose';

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Mock the UserService
    userService = {
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    // Initialize UserController with the mocked UserService
    userController = new UserController(userService);

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as unknown as jest.Mock;

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a new user and return 201 status with the created user', async () => {
      const user: CreateUserDto = {
        name: 'Gui Alves',
        email: 'guialves@gmail.com',
        address: 'Avenida Paulista',
        password: '123456',
      };

      const userResponse: UserDto = {
        id: 'some id',
        name: 'Gui Alves',
        email: 'guialves@gmail.com',
        address: 'Avenida Paulista',
      };

      userService.create.mockResolvedValueOnce(userResponse);

      mockRequest.body = user;

      await userController.create(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(userService.create).toHaveBeenCalledWith(user);

      expect(statusMock).toHaveBeenCalledWith(201);

      expect(jsonMock).toHaveBeenCalledWith(userResponse);
    });

    test('should handle errors during user creation', async () => {
      const error = new Error('Creation failed');
      userService.create.mockRejectedValueOnce(error);

      await userController.create(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Creation failed',
      });
    });

    test('should email already exist', async () => {
      const user: CreateUserDto = {
        name: 'Gui Alves',
        email: 'guialves@gmail.com',
        address: 'Avenida Paulista',
        password: '4561',
      };
      const emailExistsError = new AppError(
        'The email is already taken',
        STATUS.CONFLICT,
      );
      userService.create.mockRejectedValueOnce(emailExistsError);

      mockRequest.body = user;

      const result = await userController.create(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(STATUS.CONFLICT);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'The email is already taken',
      });
      expect(result).not.toBeDefined();
    });
  });
  describe('update', () => {
    test('should update a user and return 200 status updated user', async () => {
      const userId = new Types.ObjectId();
      const requestingUserId = userId; // Mock the same ID for testing authorization
      const updateUserDto: UpdateUserDto = {
        address: 'Avenida Pauslita',
        name: 'Alves',
      };
      const updatedUser = {
        id: userId.toHexString(),
        name: 'Updated Name',
        email: 'guialves@gmail.com',
        address: 'Updated Address',
      };

      // Mock request data
      mockRequest.params = { id: userId.toHexString() };
      mockRequest.body = updateUserDto;
      mockRequest.user = {
        id: userId,
        name: 'Existing User',
        email: 'existinguser@gmail.com',
        password: 'hashedpassword',
        address: 'Old Address',
        coordinates: [-23.1379888, -45.7730633],
        regions: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      userService.update.mockResolvedValueOnce(updatedUser);

      await userController.update(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(userService.update).toHaveBeenCalledWith(
        userId.toHexString(),
        updateUserDto,
        userId,
      );

      expect(userService.update).toHaveBeenCalledWith(
        userId.toHexString(),
        updateUserDto,
        userId,
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(updatedUser);
    });

    test('handle errors during user update', async () => {
      const userId = 'abc'; // Invalid ID to simulate 'not found' case
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      mockRequest.params = { id: userId };
      mockRequest.body = updateUserDto;
      mockRequest.user = {
        id: new Types.ObjectId(),
        name: 'Existing User',
        email: 'existinguser@gmail.com',
        password: 'hashedpassword',
        address: 'Old Address',
        coordinates: [-23.1379888, -45.7730633],
        regions: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updateError = new AppError('User not found', STATUS.NOT_FOUND);
      userService.update.mockRejectedValueOnce(updateError);

      await userController.update(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(userService.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
        mockRequest.user.id,
      );
      expect(statusMock).toHaveBeenCalledWith(STATUS.NOT_FOUND);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
});
