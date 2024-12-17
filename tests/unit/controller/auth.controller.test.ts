import { AuthController } from '../../../src/controller/auth.controller';
import { AuthService } from '../../../src/service/auth.service';
import { LoginDto } from '../../../src/dto/auth.dto';
import { Request, Response } from 'express';
import { STATUS } from '../../../src/utils/status';
import { AppError } from '../../../src/utils/errors';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    authService = {
      login: jest.fn(),
      validateUser: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    authController = new AuthController(authService);

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as unknown as jest.Mock;
    mockResponse = {
      status: statusMock,
    };

    mockRequest = { body: {} };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return an access token when login is successful', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const mockToken = { accessToken: 'mockAccessToken' };
    mockRequest.body = loginDto;

    authService.login.mockResolvedValueOnce(mockToken);

    await authController.login(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(statusMock).toHaveBeenCalledWith(STATUS.OK);
    expect(jsonMock).toHaveBeenCalledWith(mockToken);
  });

  test('should fail invalid credentials error', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };
    mockRequest.body = loginDto;

    authService.login.mockRejectedValueOnce({
      statusCode: STATUS.UNAUTHORIZED,
      message: 'Invalid credentials',
    });

    await authController.login(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(statusMock).toHaveBeenCalledWith(STATUS.UNAUTHORIZED);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  test('should handle server errors', async () => {
    // Arrange
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    mockRequest.body = loginDto;

    authService.login.mockRejectedValueOnce(
      new AppError('Unexpected error', STATUS.INTERNAL_SERVER_ERROR),
    );

    await authController.login(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(statusMock).toHaveBeenCalledWith(STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Unexpected error' });
  });
});
