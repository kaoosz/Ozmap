import { Types } from 'mongoose';
import { User } from './user.model';
import { Ref } from '@typegoose/typegoose';

export interface IRegion {
  _id: Types.ObjectId;
  name: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  user: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: Ref<User>;
  updated_by?: Ref<User>;
}

export interface RegionQuery {
  geometry: {
    $geoWithin: {
      $centerSphere: [[number, number], number];
    };
  };
  user?: Types.ObjectId;
}
