import express from 'express';
import {
  uploadSingleResume,
  uploadBulkResumes,
  getResumes,
  getResumeById,
  deleteResume
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('resume'), uploadSingleResume);
router.post('/bulk-upload', upload.array('resumes', 20), uploadBulkResumes);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;
