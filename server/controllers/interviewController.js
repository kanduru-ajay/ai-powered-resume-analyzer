import Analysis from '../models/Analysis.js';
import Resume from '../models/Resume.js';
import JobDescription from '../models/JobDescription.js';
import InterviewSession from '../models/InterviewSession.js';
import { generateGeminiContent, parseJsonResponse } from '../services/ai/geminiService.js';
import { SYSTEM_PROMPTS } from '../services/ai/prompts.js';

// @desc Generate interview questions
// @route POST /api/interview/questions
export const generateInterviewQuestions = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { analysisId, resumeId, jdId } = req.body;

    let analysis = null;
    let resume = null;
    let jd = null;

    if (analysisId) {
      analysis = await Analysis.findById(analysisId).populate('resume').populate('jobDescription');
      resume = analysis?.resume;
      jd = analysis?.jobDescription;
    }

    if (!resume && resumeId) resume = await Resume.findById(resumeId);
    if (!jd && jdId) jd = await JobDescription.findById(jdId);

    const jobTitle = jd?.parsedData?.jobTitle || jd?.jobTitle || 'Target Professional Role';
    const matchedSkills = analysis?.matchedSkills || resume?.parsedData?.skills || ['JavaScript', 'React'];
    const missingSkills = analysis?.missingSkills || ['Docker', 'AWS'];

    let questions = [];

    const prompt = `Job Title: ${jobTitle}\nMatched Skills: ${JSON.stringify(matchedSkills)}\nMissing Skills: ${JSON.stringify(missingSkills)}\nResume Summary: ${resume?.parsedData?.summary || ''}`;
    const aiRaw = await generateGeminiContent(SYSTEM_PROMPTS.interviewQuestions, prompt);

    if (aiRaw) {
      const parsed = parseJsonResponse(aiRaw);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        questions = parsed.questions;
      }
    }

    // Default fallback interview questions
    if (questions.length === 0) {
      questions = [
        {
          category: 'Technical',
          question: `Can you walk us through a challenging technical problem you solved using ${matchedSkills[0] || 'core technologies'}?`,
          sampleAnswer: `The candidate should discuss architectural choices, problem identification, implementation details, and measured results.`,
          keyPoints: ['Problem formulation', 'Solution architecture', 'Outcome metrics']
        },
        {
          category: 'Skill Gap',
          question: `This role requires production experience with ${missingSkills[0] || 'AWS/Docker'}. How do you plan to quickly get up to speed?`,
          sampleAnswer: `The candidate should highlight transferable concepts, self-driven learning ability, and hands-on laboratory practice.`,
          keyPoints: ['Transferable knowledge', 'Learning speed', 'Hands-on practice']
        },
        {
          category: 'Project',
          question: `Describe the end-to-end architecture of your most impactful web project listed on your resume.`,
          sampleAnswer: `Focus on backend API structure, database choice, state management, and deployment workflow.`,
          keyPoints: ['System components', 'Database design', 'Deployment pipeline']
        },
        {
          category: 'Role Alignment',
          question: `What specific aspects of our ${jobTitle} position align best with your long-term career goals?`,
          sampleAnswer: `Alignment between job responsibilities, candidate's existing strengths, and desired skill expansion.`,
          keyPoints: ['Motivation', 'Career trajectory', 'Company fit']
        },
        {
          category: 'HR',
          question: `Describe a situation where project scope changed unexpectedly. How did you adapt your priorities?`,
          sampleAnswer: `Demonstrate agile communication, team collaboration, and transparent status updates.`,
          keyPoints: ['Agile mindset', 'Stakeholder communication', 'Adaptability']
        }
      ];
    }

    const session = await InterviewSession.create({
      user: userId,
      analysis: analysis?._id || null,
      jobTitle,
      questions
    });

    return res.status(201).json({
      success: true,
      data: {
        session,
        questions
      }
    });
  } catch (error) {
    next(error);
  }
};
