import Analysis from '../models/Analysis.js';
import Resume from '../models/Resume.js';
import JobDescription from '../models/JobDescription.js';
import { analyzeResumeAndJD } from '../services/ats/atsEngine.js';
import { generateReportContent } from '../utils/reportGenerator.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc Analyze single resume against job description
export const analyzeSingleResume = async (req, res, next) => {
  try {
    const { resumeId, jdId } = req.body;

    if (!resumeId || !jdId) {
      return res.status(400).json({ success: false, message: 'Please provide both resumeId and jdId.' });
    }

    let resume, jd;
    if (memoryStore.isMongoDBConnected) {
      resume = await Resume.findById(resumeId);
      jd = await JobDescription.findById(jdId);
    } else {
      resume = await memoryStore.getResumeById(resumeId);
      jd = await memoryStore.getJDById(jdId);
    }

    if (!resume || !jd) {
      return res.status(404).json({ success: false, message: 'Resume or Job Description not found.' });
    }

    const analysisResult = await analyzeResumeAndJD(resume.parsedData, jd.parsedData);
    const analysisData = {
      user: req.user._id || req.user.id,
      resume: resume._id,
      jobDescription: jd._id,
      ...analysisResult
    };

    let newAnalysis;
    if (memoryStore.isMongoDBConnected) {
      newAnalysis = await Analysis.create(analysisData);
    } else {
      newAnalysis = await memoryStore.createAnalysis(analysisData);
    }

    return res.status(201).json({
      success: true,
      message: 'Analysis completed successfully',
      data: {
        analysis: newAnalysis,
        resume,
        jobDescription: jd
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Bulk analyze multiple resumes against 1 JD
export const analyzeBulkResumes = async (req, res, next) => {
  try {
    const { resumeIds, jdId } = req.body;

    if (!resumeIds || !Array.isArray(resumeIds) || resumeIds.length === 0 || !jdId) {
      return res.status(400).json({ success: false, message: 'Please provide resumeIds array and valid jdId.' });
    }

    let jd;
    if (memoryStore.isMongoDBConnected) {
      jd = await JobDescription.findById(jdId);
    } else {
      jd = await memoryStore.getJDById(jdId);
    }

    if (!jd) {
      return res.status(404).json({ success: false, message: 'Job Description not found.' });
    }

    const results = [];

    for (const rid of resumeIds) {
      let resume;
      if (memoryStore.isMongoDBConnected) {
        resume = await Resume.findById(rid);
      } else {
        resume = await memoryStore.getResumeById(rid);
      }

      if (resume) {
        const analysisResult = await analyzeResumeAndJD(resume.parsedData, jd.parsedData);
        const analysisData = {
          user: req.user._id || req.user.id,
          resume: resume._id,
          jobDescription: jd._id,
          ...analysisResult
        };

        let newAnalysis;
        if (memoryStore.isMongoDBConnected) {
          newAnalysis = await Analysis.create(analysisData);
        } else {
          newAnalysis = await memoryStore.createAnalysis(analysisData);
        }

        results.push({
          candidateName: resume.parsedData.name || resume.originalName,
          email: resume.parsedData.email || '',
          analysis: newAnalysis,
          resume
        });
      }
    }

    results.sort((a, b) => b.analysis.atsScore - a.analysis.atsScore);

    return res.status(200).json({
      success: true,
      message: `Successfully analyzed ${results.length} resumes.`,
      data: {
        jobTitle: jd.parsedData.jobTitle || jd.jobTitle,
        totalCandidates: results.length,
        candidates: results
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Compare selected candidate analyses
export const compareCandidates = async (req, res, next) => {
  try {
    const { analysisIds } = req.body;

    if (!analysisIds || !Array.isArray(analysisIds) || analysisIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide analysisIds array.' });
    }

    let analyses;
    if (memoryStore.isMongoDBConnected) {
      analyses = await Analysis.find({ _id: { $in: analysisIds } }).populate('resume').populate('jobDescription');
    } else {
      analyses = await memoryStore.getAnalysesByIds(analysisIds);
    }

    return res.status(200).json({
      success: true,
      data: { count: analyses.length, comparison: analyses }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get analysis history
export const getAnalysisHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let history;
    if (memoryStore.isMongoDBConnected) {
      history = await Analysis.find({ user: userId }).sort({ createdAt: -1 }).populate('resume').populate('jobDescription');
    } else {
      history = await memoryStore.getAnalysesByUser(userId);
    }

    return res.status(200).json({ success: true, data: { history } });
  } catch (error) {
    next(error);
  }
};

// @desc Get single analysis detail
export const getAnalysisById = async (req, res, next) => {
  try {
    let analysis;
    if (memoryStore.isMongoDBConnected) {
      analysis = await Analysis.findById(req.params.id).populate('resume').populate('jobDescription');
    } else {
      analysis = await memoryStore.getAnalysisById(req.params.id);
    }

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    return res.status(200).json({ success: true, data: { analysis } });
  } catch (error) {
    next(error);
  }
};

// @desc Download report
export const downloadReport = async (req, res, next) => {
  try {
    let analysis;
    if (memoryStore.isMongoDBConnected) {
      analysis = await Analysis.findById(req.params.id).populate('resume').populate('jobDescription');
    } else {
      analysis = await memoryStore.getAnalysisById(req.params.id);
    }

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis record not found' });
    }

    const reportContent = generateReportContent(analysis);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="ResumeAI_Report_${analysis._id}.txt"`);
    return res.send(reportContent);
  } catch (error) {
    next(error);
  }
};
