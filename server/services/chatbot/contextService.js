import Resume from '../../models/Resume.js';
import JobDescription from '../../models/JobDescription.js';
import Analysis from '../../models/Analysis.js';
import ChatConversation from '../../models/ChatConversation.js';
import { memoryStore } from '../../config/memoryStore.js';
import { telegramSessions } from './telegramService.js';

export const getContextForConversation = async (conversationId, userId) => {
  let contextInfo = '';
  let resume = null;
  let jd = null;
  let analysis = null;

  try {
    // 1. Check if conversation ID belongs to a Telegram session
    if (typeof conversationId === 'string' && conversationId.startsWith('telegram_')) {
      const chatId = conversationId.replace('telegram_', '');
      const telegramSession = telegramSessions.get(String(chatId));

      if (telegramSession) {
        resume = telegramSession.resume;
        jd = telegramSession.jd;
        analysis = telegramSession.analysis;
      }
    }

    // 2. Check Database / MemoryStore if not retrieved from Telegram session
    if (!analysis && !resume && !jd) {
      if (memoryStore.isMongoDBConnected) {
        const conv = await ChatConversation.findById(conversationId);
        if (conv) {
          if (conv.currentAnalysis) {
            analysis = await Analysis.findById(conv.currentAnalysis).populate('resume').populate('jobDescription');
          }
          if (!analysis && conv.currentResume) {
            resume = await Resume.findById(conv.currentResume);
          }
          if (!analysis && conv.currentJd) {
            jd = await JobDescription.findById(conv.currentJd);
          }
        }

        if (!analysis && userId) {
          analysis = await Analysis.findOne({ user: userId }).sort({ createdAt: -1 }).populate('resume').populate('jobDescription');
        }
        if (!resume && userId) {
          resume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
        }
        if (!jd && userId) {
          jd = await JobDescription.findOne({ user: userId }).sort({ createdAt: -1 });
        }
      } else {
        const conv = await memoryStore.getConversationById(conversationId);
        if (conv) {
          if (conv.currentAnalysis) {
            analysis = await memoryStore.getAnalysisById(conv.currentAnalysis);
          }
          if (!analysis && conv.currentResume) {
            resume = await memoryStore.getResumeById(conv.currentResume);
          }
          if (!analysis && conv.currentJd) {
            jd = await memoryStore.getJDById(conv.currentJd);
          }
        }

        if (!analysis && userId) {
          const userAnalyses = await memoryStore.getAnalysesByUser(userId);
          analysis = userAnalyses[0] || null;
        }
        if (!resume && userId) {
          const userResumes = await memoryStore.getResumesByUser(userId);
          resume = userResumes[0] || null;
        }
        if (!jd && userId) {
          const userJds = await memoryStore.getJDsByUser(userId);
          jd = userJds[0] || null;
        }
      }
    }

    // 3. Format Context String for Gemini AI / Chatbot Engine
    if (analysis) {
      contextInfo += `
[ACTIVE ATS ANALYSIS]
ATS Score: ${analysis.atsScore}/100
Skill Match: ${analysis.skillMatchPercentage}%
Keyword Match: ${analysis.keywordMatchPercentage}%
Experience Match: ${analysis.experienceMatchPercentage}%
Matched Skills: ${(analysis.matchedSkills || []).join(', ')}
Missing Skills: ${(analysis.missingSkills || []).join(', ')}
Preferred Missing Skills: ${(analysis.preferredSkillsMissing || []).join(', ')}
Strengths: ${(analysis.strengths || []).join('; ')}
Weaknesses: ${(analysis.weaknesses || []).join('; ')}
Suggestions: ${(analysis.suggestions || []).join('; ')}
`;
    }

    const activeResume = analysis?.resume || resume;
    if (activeResume) {
      contextInfo += `
[ACTIVE RESUME]
Candidate Name: ${activeResume.parsedData?.name || activeResume.originalName}
Skills: ${(activeResume.parsedData?.skills || []).join(', ')}
Experience: ${(activeResume.parsedData?.experience || []).join(' | ')}
Education: ${(activeResume.parsedData?.education || []).join(' | ')}
Technologies: ${(activeResume.parsedData?.technologies || []).join(', ')}
`;
    }

    const activeJd = analysis?.jobDescription || jd;
    if (activeJd) {
      contextInfo += `
[ACTIVE JOB DESCRIPTION]
Job Title: ${activeJd.parsedData?.jobTitle || activeJd.jobTitle}
Required Skills: ${(activeJd.parsedData?.requiredSkills || []).join(', ')}
Preferred Skills: ${(activeJd.parsedData?.preferredSkills || []).join(', ')}
Experience Needed: ${activeJd.parsedData?.experience || 'Not specified'}
Keywords: ${(activeJd.parsedData?.keywords || []).join(', ')}
`;
    }

    return { contextInfo, resume: activeResume, jd: activeJd, analysis };
  } catch (err) {
    console.error('Error fetching chat context:', err.message);
    return { contextInfo: 'No prior resume/JD analysis loaded.', resume: null, jd: null, analysis: null };
  }
};
