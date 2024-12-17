import { CreateUserDto, UpdateUserDto, UserDto } from '../dto/create.user.dto';
import { IUserRepository } from '../interfaces/IUser.repository';
import { IUser, IUserCreateData } from '../models/IUser.interface';
import { AppError } from '../utils/errors';
import { STATUS } from '../utils/status';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    requestingUserId: any,
  ): Promise<UserDto> {
    if (id != requestingUserId) {
      throw new AppError(
        'you not authorized update this user',
        STATUS.UNAUTHORIZED,
      );
    }

    if (updateUserDto.email) {
      const existsEmail = await this.userRepository.findOneByEmail(
        updateUserDto.email,
      );
      if (existsEmail) {
        throw new AppError('The email is already taken', STATUS.CONFLICT);
      }
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);
    return this.mapToUserDto(updatedUser, false);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const existsEmail = await this.userRepository.findOneByEmail(
      createUserDto.email,
    );

    if (existsEmail) {
      throw new AppError('The email is already taken', STATUS.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user: IUserCreateData = {
      name: createUserDto.name,
      email: createUserDto.email,
      address: createUserDto.address ?? undefined,
      coordinates: createUserDto.coordinates ?? undefined,
      password: hashedPassword,
    };

    const createUser = await this.userRepository.create(user);
    return this.mapToUserDto(createUser, true);
  }

  private mapToUserDto(user: IUser, excludeFields?: boolean): UserDto {
    const userDto: UserDto = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      address: user.address,
      coordinates: user.coordinates,
      created_at: user.created_at,
      updated_by: user._id.toString(),
    };

    if (excludeFields) {
      delete userDto.updated_by;
      return userDto;
    }

    return userDto;
  }
}
