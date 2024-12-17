import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId;
      name: string;
      email: string;
      password: string;
      address: string;
      coordinates: [number, number];
      regions: Types.ObjectId[];
      created_at: Date;
      updated_at: Date;
    }
  }
}
