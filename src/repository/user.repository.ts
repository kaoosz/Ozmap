import { Types } from 'mongoose';
import DataBase from '../db/database';
import { IUserRepository } from '../interfaces/IUser.repository';
import {
  IUser,
  IUserCreateData,
  IUserUpdateData,
} from '../models/IUser.interface';
import { UserModel } from '../models/user.model';
import { AppError } from '../utils/errors';
import { STATUS } from '../utils/status';

export class UserRepository implements IUserRepository {
  private db;

  constructor() {
    this.db = DataBase.getInstance();
  }

  async create(data: IUserCreateData): Promise<IUser> {
    const user = new UserModel(data);
    const userData = await user.save();
    return userData as IUser;
  }

  async update(id: string, data: IUserUpdateData): Promise<IUser> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new AppError('user not found', STATUS.BAD_REQUEST);
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    if (data.address !== undefined) user.address = data.address;
    if (data.coordinates !== undefined) user.coordinates = data.coordinates;
    user.updated_at = new Date();
    user.updated_by = new Types.ObjectId(id);

    const updatedUser = await user.save();
    return updatedUser as IUser;
  }

  async findOneByEmail(data: string): Promise<IUser | null> {
    const exists = await UserModel.findOne({
      email: data,
    }).lean<IUser | null>();
    return exists;
  }
}
