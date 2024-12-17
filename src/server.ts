import { app } from './app';
import dotenv from 'dotenv';
import DataBase from './db/database';
import { PORT } from './config/config';
import { logger } from './service/logger.service';
dotenv.config();

async function bootstrap() {
  try {
    const db = DataBase.getInstance();
    await db.connect();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start application', { error: error });
    console.error('Failed to start application', error);
    // process.exit(1);
  }
}

bootstrap();
