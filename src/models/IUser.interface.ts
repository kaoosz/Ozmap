import { Ref } from '@typegoose/typegoose';
import { Region } from './region.model';
import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  address?: string;
  coordinates?: [number, number];
  regions?: Ref<Region>[];
  created_at: Date;
}

export interface IUserCreateData {
  name: string;
  email: string;
  address?: string;
  coordinates?: [number, number];
  regions?: Ref<Region>[];
  password: string;
}

export interface IUserUpdateData {
  id?: string;
  name?: string;
  email?: string;
  address?: string;
  coordinates?: [number, number];
  regions?: Ref<Region>[];
  updated_by?: string;
}
