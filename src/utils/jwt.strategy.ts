import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../repository/user.repository';
import { JwtPayloadDto } from '../dto/auth.dto';

export const configureJwtStrategy = (
  passport: PassportStatic,
  userRepository: UserRepository,
) => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'secret',
      },
      async (payload: JwtPayloadDto, done) => {
        try {
          const user = await userRepository.findOneByEmail(payload.email);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};
