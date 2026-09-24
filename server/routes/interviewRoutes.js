import express from 'express';
import { generateInterviewQuestions } from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/questions', generateInterviewQuestions);

export default router;
