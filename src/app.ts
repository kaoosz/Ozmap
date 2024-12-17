import express from 'express';
import userRoutes from './routes/user.routes';
import regionRoutes from './routes/region.routes';
import authRouter from './routes/auth.routes';
import { UserRepository } from './repository/user.repository';
import passport from 'passport';
import { configureJwtStrategy } from './utils/jwt.strategy';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRepository = new UserRepository();

configureJwtStrategy(passport, userRepository);

app.use(passport.initialize());
app.use(userRoutes);
app.use(regionRoutes);
app.use(authRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
