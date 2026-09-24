import Resume from '../models/Resume.js';
import { extractTextFromFile, parseResumeToJSON } from '../services/resumeParser/parserService.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc Upload single resume
export const uploadSingleResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { buffer, mimetype, originalname } = req.file;
    const ext = originalname.split('.').pop().toLowerCase();
    const rawText = await extractTextFromFile(buffer, mimetype, originalname);
    const parsedData = await parseResumeToJSON(rawText);

    const resumeData = {
      user: req.user._id || req.user.id,
      filename: `resume_${Date.now()}.${ext}`,
      originalName: originalname,
      fileType: ext,
      textContent: rawText,
      parsedData
    };

    let newResume;
    if (memoryStore.isMongoDBConnected) {
      newResume = await Resume.create(resumeData);
    } else {
      newResume = await memoryStore.createResume(resumeData);
    }

    return res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      data: { resume: newResume }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Upload multiple resumes
export const uploadBulkResumes = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }

    const processedResumes = [];
    const errors = [];

    for (const file of req.files) {
      try {
        const { buffer, mimetype, originalname } = file;
        const ext = originalname.split('.').pop().toLowerCase();
        const rawText = await extractTextFromFile(buffer, mimetype, originalname);
        const parsedData = await parseResumeToJSON(rawText);

        const resumeData = {
          user: req.user._id || req.user.id,
          filename: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 4)}.${ext}`,
          originalName: originalname,
          fileType: ext,
          textContent: rawText,
          parsedData
        };

        let newResume;
        if (memoryStore.isMongoDBConnected) {
          newResume = await Resume.create(resumeData);
        } else {
          newResume = await memoryStore.createResume(resumeData);
        }

        processedResumes.push(newResume);
      } catch (err) {
        errors.push({ filename: file.originalname, error: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${processedResumes.length} resumes. ${errors.length} failed.`,
      data: { resumes: processedResumes, errors }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all user resumes
export const getResumes = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let resumes;
    if (memoryStore.isMongoDBConnected) {
      resumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });
    } else {
      resumes = await memoryStore.getResumesByUser(userId);
    }

    return res.status(200).json({
      success: true,
      data: { resumes }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single resume by ID
export const getResumeById = async (req, res, next) => {
  try {
    let resume;
    if (memoryStore.isMongoDBConnected) {
      resume = await Resume.findById(req.params.id);
    } else {
      resume = await memoryStore.getResumeById(req.params.id);
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    return res.status(200).json({ success: true, data: { resume } });
  } catch (error) {
    next(error);
  }
};

// @desc Delete resume
export const deleteResume = async (req, res, next) => {
  try {
    if (memoryStore.isMongoDBConnected) {
      await Resume.findByIdAndDelete(req.params.id);
    } else {
      await memoryStore.deleteResume(req.params.id);
    }

    return res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
};
