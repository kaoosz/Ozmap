import { Router } from 'express';
import { AuthService } from '../service/auth.service';
import { UserRepository } from '../repository/user.repository';
import { AuthController } from '../controller/auth.controller';

const authRouter = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRouter.post('/login', (req, res) => authController.login(req, res));

export default authRouter;
