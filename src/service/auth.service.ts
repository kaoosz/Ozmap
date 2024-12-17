import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/user.repository';
import { IUser } from '../models/IUser.interface';
import { JwtPayloadDto, LoginDto } from '../dto/auth.dto';
import { AppError } from '../utils/errors';
import { STATUS } from '../utils/status';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    return isPasswordValid ? user : null;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new AppError('Invalid credentials', STATUS.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password || '',
    );

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', STATUS.UNAUTHORIZED);
    }

    const payload: JwtPayloadDto = {
      id: String(user._id),
      email: user.email,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    return { accessToken };
  }
}
