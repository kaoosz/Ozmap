import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/auth.dto';
import { STATUS } from '../utils/status';
import { logger } from '../service/logger.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDto: LoginDto = req.body;
      const token = await this.authService.login(loginDto);

      res.status(STATUS.OK).json(token);
    } catch (error: any) {
      logger.error('some error on auth', { error: error });
      const status = error.statusCode || STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Internal Server Error';
      res.status(status).json({ error: message });
    }
  }
}
