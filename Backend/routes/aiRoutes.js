import express from 'express';
import { identifyItem } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/identify', optionalAuth, identifyItem);

export default router;
