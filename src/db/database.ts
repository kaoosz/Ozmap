import mongoose from 'mongoose';

export default class DataBase {
  private static instance: DataBase;

  private constructor() {}

  public static getInstance(): DataBase {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
    }
    return DataBase.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect('mongodb://localhost:27017', {});
      console.log('Connected to mongo');
    } catch (error) {
      console.error('failed to connect to MongoDb', error);
    }
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }
}
