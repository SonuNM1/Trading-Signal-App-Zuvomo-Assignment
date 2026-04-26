
import cron from 'node-cron';
import logger from '../config/logger.js';
import { updateOpenSignals } from './signal.service.js';

let isRunning = false;

const startCronJob = () => {
  if (isRunning) {
    logger.warn('Cron job is already running — skipping duplicate start');
    return;
  }

  cron.schedule('*/15 * * * * *', async () => {
    try {
      logger.info(`[CRON] Checking open signals at ${new Date().toISOString()}`);
      await updateOpenSignals();
    } catch (error) {
      logger.error(`[CRON] Error during signal update: ${error.message}`);
    }
  });

  isRunning = true;
  logger.info('[CRON] Background signal checker started — runs every 15 seconds');
};


export { startCronJob };