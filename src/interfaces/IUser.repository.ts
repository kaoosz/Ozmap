import {
  IUser,
  IUserCreateData,
  IUserUpdateData,
} from '../models/IUser.interface';

export interface IUserRepository {
  create(data: IUserCreateData): Promise<IUser>;
  update(id: string, data: IUserUpdateData): Promise<IUser>;
  findOneByEmail(id: string): Promise<IUser | null>;
}
