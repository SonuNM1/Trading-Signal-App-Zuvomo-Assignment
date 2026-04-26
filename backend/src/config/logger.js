// Winston is a logging library that saves logs to files and console
import winston from 'winston';

// Define log format — timestamp + level + message
const logFormat = winston.format.combine(
  // Adds timestamp to every log entry
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),

  // Formats log as readable string
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  // Minimum level to log — 'info' captures info, warn, error
  level: 'info',

  format: logFormat,

  transports: [
    // Print logs to console
    new winston.transports.Console(),

    // Save all info+ logs to combined.log file
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),

    // Save only error logs to separate error.log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error', // only error level goes here
    }),
  ],
});

export default logger;