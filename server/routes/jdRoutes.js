import express from 'express';
import {
  createJobDescription,
  getJobDescriptions,
  getJobDescriptionById
} from '../controllers/jdController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', upload.single('jdDocument'), createJobDescription);
router.get('/', getJobDescriptions);
router.get('/:id', getJobDescriptionById);

export default router;
