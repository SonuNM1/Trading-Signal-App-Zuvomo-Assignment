
import Signal from '../models/signal.model.js';
import { getLivePrice, getLivePrices } from './binance.service.js';
import logger from '../config/logger.js';

const calculateROI = (direction, entryPrice, currentPrice) => {
  let roi;
  if (direction === 'BUY') {
    roi = ((currentPrice - entryPrice) / entryPrice) * 100;
  } else {
    roi = ((entryPrice - currentPrice) / entryPrice) * 100;
  }

  return parseFloat(roi.toFixed(2));
};

const evaluateSignalStatus = (signal, currentPrice) => {
  const { direction, entry_price, target_price, stop_loss, expiry_time, status } = signal;

  if (status !== 'OPEN') {
    return { status, roi: signal.realized_roi };
  }

  const now = new Date();
  const expiry = new Date(expiry_time);

  if (direction === 'BUY') {
    if (currentPrice >= target_price) {

      return {
        status: 'TARGET_HIT',
        roi: calculateROI('BUY', entry_price, currentPrice),
      };
    }
    if (currentPrice <= stop_loss) {
      return {
        status: 'STOPLOSS_HIT',
        roi: calculateROI('BUY', entry_price, currentPrice),
      };
    }
  }

  if (direction === 'SELL') {
    if (currentPrice <= target_price) {
      return {
        status: 'TARGET_HIT',
        roi: calculateROI('SELL', entry_price, currentPrice),
      };
    }
    if (currentPrice >= stop_loss) {
      return {
        status: 'STOPLOSS_HIT',
        roi: calculateROI('SELL', entry_price, currentPrice),
      };
    }
  }

  if (now > expiry) {
    return {
      status: 'EXPIRED',
      roi: calculateROI(direction, entry_price, currentPrice),
    };
  }

  return {
    status: 'OPEN',
    roi: calculateROI(direction, entry_price, currentPrice),
  };
};

const createSignal = async (validatedData) => {
  await getLivePrice(validatedData.symbol);

  const signal = await Signal.create({
    ...validatedData,
    status: 'OPEN',
    realized_roi: null, 
  });

  return signal;
};


const getAllSignals = async () => {
  const signals = await Signal.findAll({
    order: [['createdAt', 'DESC']],
  });

  if (signals.length === 0) return [];

  const openSignals = signals.filter((s) => s.status === 'OPEN');
  const symbols = openSignals.map((s) => s.symbol);

  const priceMap = await getLivePrices(symbols);

  return signals.map((signal) => {
    const plain = signal.toJSON(); 

    if (signal.status !== 'OPEN') {
      return { ...plain, current_price: null };
    }

    const currentPrice = priceMap[signal.symbol];

    if (!currentPrice) {
      return { ...plain, current_price: null };
    }

    const liveRoi = calculateROI(signal.direction, signal.entry_price, currentPrice);

    return {
      ...plain,
      current_price: currentPrice,
      realized_roi: liveRoi, 
    };
  });
};

const getSignalById = async (id) => {
  const signal = await Signal.findByPk(id);

  if (!signal) return null;

  const plain = signal.toJSON();

  if (signal.status !== 'OPEN') {
    return { ...plain, current_price: null };
  }

  const currentPrice = await getLivePrice(signal.symbol);
  const liveRoi = calculateROI(signal.direction, signal.entry_price, currentPrice);

  return {
    ...plain,
    current_price: currentPrice,
    realized_roi: liveRoi,
  };
};

const deleteSignal = async (id) => {
  const signal = await Signal.findByPk(id);

  if (!signal) return null;

  await signal.destroy();
  return true;
};

const updateOpenSignals = async () => {

  const openSignals = await Signal.findAll({
    where: { status: 'OPEN' },
  });

  if (openSignals.length === 0) return;

  const symbols = openSignals.map((s) => s.symbol);

  const priceMap = await getLivePrices(symbols);

  const updatePromises = openSignals.map(async (signal) => {
    const currentPrice = priceMap[signal.symbol];

    if (!currentPrice) return;

    const { status, roi } = evaluateSignalStatus(signal, currentPrice);

    if (status !== 'OPEN') {
      await signal.update({
        status,
        realized_roi: roi, 
      });

      logger.info(`Signal ${signal.id} updated to ${status} with ROI: ${roi}%`);
    }
  });

  await Promise.allSettled(updatePromises);
};

export {
  createSignal,
  getAllSignals,
  getSignalById,
  deleteSignal,
  updateOpenSignals,
  evaluateSignalStatus,
  calculateROI,
};