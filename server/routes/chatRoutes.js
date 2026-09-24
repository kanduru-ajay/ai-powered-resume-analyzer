import express from 'express';
import {
  sendMessage,
  startNewConversation,
  getChatHistory,
  clearChatHistory
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/message', sendMessage);
router.post('/new', startNewConversation);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

export default router;
