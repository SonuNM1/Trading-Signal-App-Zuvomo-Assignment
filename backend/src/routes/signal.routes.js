// Express router — lets us define routes separately from app.js
import { Router } from 'express';

// Import all controller handlers
import {
  createSignalHandler,
  getAllSignalsHandler,
  getSignalByIdHandler,
  deleteSignalHandler,
} from '../controllers/signal.controller.js';

// Create a new router instance
const router = Router();

// POST /api/signals — create a new signal
router.post('/signals', createSignalHandler);

// GET /api/signals — get all signals with live prices
router.get('/signals', getAllSignalsHandler);

// GET /api/signals/:id — get single signal by id
router.get('/signals/:id', getSignalByIdHandler);

// DELETE /api/signals/:id — delete a signal
router.delete('/signals/:id', deleteSignalHandler);

export default router;