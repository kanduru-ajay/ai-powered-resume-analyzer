import express from 'express';
import {
  analyzeSingleResume,
  analyzeBulkResumes,
  compareCandidates,
  getAnalysisHistory,
  getAnalysisById,
  downloadReport
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/single', analyzeSingleResume);
router.post('/bulk-analyze', analyzeBulkResumes);
router.post('/compare', compareCandidates);
router.get('/history', getAnalysisHistory);
router.get('/:id', getAnalysisById);
router.get('/:id/report', downloadReport);

export default router;
