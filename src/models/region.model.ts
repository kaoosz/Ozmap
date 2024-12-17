import {
  getModelForClass,
  index,
  DocumentType,
  pre,
  prop,
  Ref,
  modelOptions,
} from '@typegoose/typegoose';
import { User, UserModel } from './user.model';

@index({ geometry: '2dsphere' })
@pre<Region>('save', async function (next) {
  const region = this as DocumentType<Region>;
  if (region.isNew) {
    const user = await UserModel.findById(region.user);
    if (user && user.regions) {
      user.regions.push(region._id);
      await user.save();
    }
  }
  next();
})
@modelOptions({ options: { allowMixed: 0 } })
export class Region {
  @prop({ require: true })
  name!: string;

  @prop({ required: true, type: () => Object })
  geometry!: {
    type: 'Polygon';
    coordinates: number[][][];
  };

  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

  @prop({ default: () => new Date() })
  created_at?: Date;

  @prop({ required: false })
  updated_at?: Date;

  @prop({ ref: () => 'User' })
  created_by?: Ref<User>;

  @prop({ ref: () => 'User' })
  updated_by?: Ref<User>;
}
export const RegionModel = getModelForClass(Region);
