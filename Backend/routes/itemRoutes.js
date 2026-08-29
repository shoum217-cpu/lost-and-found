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
  resolveItem,
} from '../controllers/itemController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getItems)
  .post(protect, createItem);

router.get('/my', protect, getMyItems);

router.get('/:id/matches', optionalAuth, getItemMatches);
router.get('/:id/whatsapp', getWhatsAppLink);
router.post('/:id/resolve', protect, resolveItem);

router.route('/:id')
  .get(optionalAuth, getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

export default router;
