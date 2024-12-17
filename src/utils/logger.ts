import { createLogger, format, transports } from 'winston';

// Logger instance configuration
export const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp(), // Add a timestamp
    format.errors({ stack: true }), // Include stack traces for errors
    format.json(), // Log in JSON format
  ),
  transports: [
    // Log errors to 'error.log' file
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Log all levels to 'combined.log' file
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}
