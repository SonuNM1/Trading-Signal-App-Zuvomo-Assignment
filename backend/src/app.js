import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database.js';
import './models/signal.model.js';
import signalRoutes from './routes/signal.routes.js';
import { startCronJob } from './services/cron.service.js';
import logger from './config/logger.js';
import { initSentry, Sentry } from './config/sentry.js';

// Initialize Sentry FIRST before anything else
initSentry();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', signalRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Sentry error handler — must be BEFORE your own error handler
app.use(Sentry.expressErrorHandler());

// Your global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false })
  .then(() => {
    logger.info('Database connected and synced');
    startCronJob();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`Failed to connect to database: ${err.message}`);
    process.exit(1);
  });