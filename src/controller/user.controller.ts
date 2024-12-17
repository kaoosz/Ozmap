import { Request, Response } from 'express';
import { CreateUserDto, UpdateUserDto } from '../dto/create.user.dto';
import { UserService } from '../service/user.service';
import { STATUS } from '../utils/status';
import { AppError } from '../utils/errors';
import { logger } from '../service/logger.service';

export class UserController {
  constructor(private userService: UserService) {}

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateUserDto: UpdateUserDto = req.body;

      if (!req.user || !('id' in req.user)) {
        throw new AppError('User is not authenticated', STATUS.UNAUTHORIZED);
      }

      const user = await this.userService.update(
        id,
        updateUserDto,
        req.user.id,
      );
      logger.info('User updated successfully', { userId: user });
      res.status(STATUS.UPDATED).json(user);
    } catch (error: any) {
      logger.error('Failed to update user', { error: error });
      const status = error.statusCode || STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Internal Server Error';
      res.status(status).json({ error: message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const createUserDto: CreateUserDto = req.body;
      const user = await this.userService.create(createUserDto);
      logger.info('User created successfully', { userId: user.id });
      res.status(STATUS.CREATED).json(user);
    } catch (error: any) {
      logger.error('Failed to create user', { error: error });
      const status = error.statusCode || STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || STATUS.DEFAULT_ERROR;
      res.status(status).json({ error: message });
    }
  }
}
