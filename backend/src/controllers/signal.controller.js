import { Sentry } from '../config/sentry.js';
import logger from '../config/logger.js';
import validateSignal from '../validators/signal.validator.js';
import {
  createSignal,
  getAllSignals,
  getSignalById,
  deleteSignal,
} from '../services/signal.service.js';

const createSignalHandler = async (req, res) => {
  try {
    const validation = validateSignal(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.errors });
    }
    const signal = await createSignal(validation.data);
    return res.status(201).json(signal);
  } catch (error) {
    Sentry.captureException(error);
    logger.error(`createSignalHandler error: ${error.message}`);
    if (error.message.includes('Invalid symbol')) {
      return res.status(400).json({ errors: [error.message] });
    }
    return res.status(500).json({ error: 'Failed to create signal' });
  }
};

const getAllSignalsHandler = async (req, res) => {
  try {
    const signals = await getAllSignals();
    return res.status(200).json(signals);
  } catch (error) {
    Sentry.captureException(error);
    logger.error(`getAllSignalsHandler error: ${error.message}`);
    return res.status(500).json({ error: 'Failed to fetch signals' });
  }
};

const getSignalByIdHandler = async (req, res) => {
  try {
    const signal = await getSignalById(req.params.id);
    if (!signal) {
      return res.status(404).json({ error: 'Signal not found' });
    }
    return res.status(200).json(signal);
  } catch (error) {
    Sentry.captureException(error);
    logger.error(`getSignalByIdHandler error: ${error.message}`);
    return res.status(500).json({ error: 'Failed to fetch signal' });
  }
};

const deleteSignalHandler = async (req, res) => {
  try {
    const result = await deleteSignal(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Signal not found' });
    }
    return res.status(200).json({ message: 'Signal deleted successfully' });
  } catch (error) {
    Sentry.captureException(error);
    logger.error(`deleteSignalHandler error: ${error.message}`);
    return res.status(500).json({ error: 'Failed to delete signal' });
  }
};

export {
  createSignalHandler,
  getAllSignalsHandler,
  getSignalByIdHandler,
  deleteSignalHandler,
};