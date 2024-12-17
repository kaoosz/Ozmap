import { createLogger, format, transports, Logger } from 'winston';

export class LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
      ),
      transports: [
        new transports.File({ filename: 'src/logs/error.log', level: 'error' }),
        new transports.File({ filename: 'src/logs/combined.log' }),
      ],
    });
  }

  public info(message: string, meta?: unknown) {
    this.logger.info(message, meta);
  }

  public error(message: string, meta?: unknown) {
    this.logger.error(message, meta);
  }

  //   public warn(message: string, meta?: any) {
  //     this.logger.warn(message, meta);
  //   }

  //   public debug(message: string, meta?: any) {
  //     this.logger.debug(message, meta);
  //   }
}

export const logger = new LoggerService();
