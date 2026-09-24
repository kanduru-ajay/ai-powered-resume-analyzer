import JobDescription from '../models/JobDescription.js';
import { parseJobDescriptionToJSON } from '../services/jdAnalyzer/jdService.js';
import { extractTextFromFile } from '../services/resumeParser/parserService.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc Analyze / save job description
export const createJobDescription = async (req, res, next) => {
  try {
    let rawText = req.body.rawText || '';
    const jobTitle = req.body.jobTitle || 'Software Professional';
    const company = req.body.company || 'Target Organization';

    if (req.file) {
      const { buffer, mimetype, originalname } = req.file;
      rawText = await extractTextFromFile(buffer, mimetype, originalname);
    }

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide Job Description text or document.' });
    }

    const parsedData = await parseJobDescriptionToJSON(rawText);
    if (jobTitle && jobTitle !== 'Software Professional') {
      parsedData.jobTitle = jobTitle;
    }

    const jdData = {
      user: req.user._id || req.user.id,
      jobTitle: parsedData.jobTitle,
      company,
      rawText,
      parsedData
    };

    let newJD;
    if (memoryStore.isMongoDBConnected) {
      newJD = await JobDescription.create(jdData);
    } else {
      newJD = await memoryStore.createJD(jdData);
    }

    return res.status(201).json({
      success: true,
      message: 'Job Description parsed and saved successfully',
      data: { jobDescription: newJD }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all user JDs
export const getJobDescriptions = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let jds;
    if (memoryStore.isMongoDBConnected) {
      jds = await JobDescription.find({ user: userId }).sort({ createdAt: -1 });
    } else {
      jds = await memoryStore.getJDsByUser(userId);
    }

    return res.status(200).json({ success: true, data: { jobDescriptions: jds } });
  } catch (error) {
    next(error);
  }
};

// @desc Get JD by ID
export const getJobDescriptionById = async (req, res, next) => {
  try {
    let jd;
    if (memoryStore.isMongoDBConnected) {
      jd = await JobDescription.findById(req.params.id);
    } else {
      jd = await memoryStore.getJDById(req.params.id);
    }

    if (!jd) {
      return res.status(404).json({ success: false, message: 'Job Description not found' });
    }

    return res.status(200).json({ success: true, data: { jobDescription: jd } });
  } catch (error) {
    next(error);
  }
};
