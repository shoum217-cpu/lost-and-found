import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getItemMatches,
  getWhatsAppLink,
  getMyItems,
} from '../controllers/itemController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getItems)
  .post(optionalAuth, createItem);

router.get('/my', protect, getMyItems);

router.get('/:id/matches', optionalAuth, getItemMatches);
router.get('/:id/whatsapp', getWhatsAppLink);

router.route('/:id')
  .get(optionalAuth, getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

export default router;
