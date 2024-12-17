import { Router } from 'express';
import { validateCreateUser } from '../middleware/create.user';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { UserRepository } from '../repository/user.repository';
import { validateUpdateUser } from '../middleware/update.user';
import { jwtAuthentication } from '../middleware/jwt.authenticate';

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/users', validateCreateUser, (req, res) =>
  userController.create(req, res),
);

router.put('/users/:id', jwtAuthentication, validateUpdateUser, (req, res) => {
  userController.update(req, res);
});

export default router;
