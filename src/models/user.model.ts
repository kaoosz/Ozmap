import {
  getModelForClass,
  pre,
  prop,
  Ref,
  DocumentType,
} from '@typegoose/typegoose';
import { Region } from './region.model';
import { GeoLib } from '../service/geo.service';
import { AppError } from '../utils/errors';
import { STATUS } from '../utils/status';
import { logger } from '../service/logger.service';

const geoLib = new GeoLib();

@pre<User>('save', async function (next) {
  const user = this as DocumentType<User>;

  try {
    if (user.isModified('coordinates') && user.coordinates) {
      user.address = await geoLib.getAddressFromCoordinates(user.coordinates);
    } else if (user.isModified('address') && user.address) {
      const { lat, lng } = await geoLib.getCoordinatesFromAddress(user.address);
      user.coordinates = [lat, lng];
    }
  } catch (error: any) {
    if (!(error instanceof AppError)) {
      logger.error('error find address or coordinates', { error: error });
      error = new AppError('Region not found', STATUS.NOT_FOUND);
    }

    return next(error);
  }
  next();
})
export class User {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop()
  address!: string;

  @prop({ type: () => [Number] })
  coordinates!: [number, number];

  @prop({ ref: () => 'Region', default: [], required: true })
  regions?: Ref<Region>[];

  @prop({ default: () => new Date() })
  created_at?: Date;

  @prop({ default: () => new Date() })
  updated_at?: Date;

  @prop({ ref: () => 'User' })
  updated_by?: Ref<User>;
}

export const UserModel = getModelForClass(User);
