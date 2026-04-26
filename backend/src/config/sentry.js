// Import Sentry using ES module syntax
import * as Sentry from '@sentry/node';
import logger from './logger.js';

const initSentry = () => {
  if (!process.env.SENTRY_DSN) {
    logger.warn('Sentry DSN not found — error tracking disabled');
    return;
  }

  // Initialize Sentry with our config
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
    sendDefaultPii: true,
  });

  logger.info('Sentry initialized successfully');
};

export { initSentry, Sentry };