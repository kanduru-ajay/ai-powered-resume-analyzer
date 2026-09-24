import { generateGeminiChat, generateGeminiContent, parseJsonResponse } from '../ai/geminiService.js';
import { getContextForConversation } from './contextService.js';
import { SYSTEM_PROMPTS } from '../ai/prompts.js';

export const processChatMessage = async ({ conversationId, userId, messageText, history = [], quickAction = null }) => {
  const { contextInfo, analysis, resume, jd } = await getContextForConversation(conversationId, userId);

  let responseText = '';

  // Handle Quick Action Triggers
  if (quickAction) {
    switch (quickAction) {
      case 'Explain My ATS Score':
        if (analysis) {
          responseText = `🎯 **ATS Score Analysis (${analysis.atsScore}/100)**\n\n` +
            `• **Skill Match (${analysis.skillMatchPercentage}%):** Matched ${analysis.matchedSkills.length} out of ${analysis.matchedSkills.length + analysis.missingSkills.length} required skills.\n` +
            `• **Keyword Match (${analysis.keywordMatchPercentage}%):** ${analysis.matchedKeywords.length} matching job keywords detected.\n` +
            `• **Experience Match (${analysis.experienceMatchPercentage}%):** Aligning with requested experience level.\n\n` +
            `**Key Strengths:** ${analysis.strengths.slice(0, 2).join(', ')}\n` +
            `**Main Gap:** Missing ${analysis.missingSkills.join(', ') || 'none'}.`;
        } else {
          responseText = "You haven't run an ATS analysis yet. Upload a resume and enter a Job Description to get your detailed ATS score!";
        }
        break;

      case 'Show Missing Skills':
        if (analysis) {
          responseText = `⚠️ **Missing Required Skills:**\n` +
            (analysis.missingSkills.length > 0 
              ? analysis.missingSkills.map(s => `• ❌ **${s}**`).join('\n') 
              : `Great news! You have matched all required skills!`) +
            `\n\n⚠️ **Missing Preferred Skills:**\n` +
            (analysis.preferredSkillsMissing.length > 0 
              ? analysis.preferredSkillsMissing.map(s => `• 🔹 ${s}`).join('\n') 
              : `No preferred skills missing.`);
        } else {
          responseText = "Please analyze a resume against a Job Description first to view missing skills.";
        }
        break;

      case 'Improve My Resume':
        if (analysis) {
          responseText = `💡 **Resume Improvement Suggestions:**\n\n` +
            analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n\n') +
            `\n\n**Actionable Advice:** Make sure to feature missing keywords like: **${analysis.missingSkills.slice(0, 3).join(', ')}** in your summary and experience bullet points.`;
        } else {
          responseText = "Please run a resume analysis to receive tailored improvement suggestions.";
        }
        break;

      case 'Recommend Courses':
        if (analysis && analysis.recommendedLearning?.length > 0) {
          responseText = `📚 **Recommended Learning Roadmap:**\n\n` +
            analysis.recommendedLearning.map(rec => 
              `🔹 **${rec.skill}** [${rec.priority || 'High'} Priority]\n` +
              `  • *Why:* ${rec.whyRequired}\n` +
              `  • *Level:* ${rec.level}\n` +
              `  • *Topics to Master:* ${(rec.topics || []).join(', ')}`
            ).join('\n\n');
        } else {
          responseText = "Upload a resume and Job Description to get customized course & topic recommendations.";
        }
        break;

      case 'Explain Job Description':
        if (jd) {
          responseText = `📋 **Job Description Summary for ${jd.parsedData?.jobTitle || jd.jobTitle}**\n\n` +
            `• **Required Skills:** ${(jd.parsedData?.requiredSkills || []).join(', ')}\n` +
            `• **Experience:** ${jd.parsedData?.experience || 'Not specified'}\n` +
            `• **Key Responsibilities:** ${(jd.parsedData?.responsibilities || []).slice(0, 3).join('; ')}\n` +
            `• **Technologies:** ${(jd.parsedData?.technologies || []).join(', ')}`;
        } else {
          responseText = "No Job Description loaded. Please enter or upload a Job Description.";
        }
        break;

      case 'Show Skill Match':
        if (analysis) {
          responseText = `✅ **Matched Skills (${analysis.skillMatchPercentage}%):**\n` +
            analysis.matchedSkills.map(s => `• ✔️ ${s}`).join('\n') +
            `\n\n❌ **Missing Required Skills:**\n` +
            analysis.missingSkills.map(s => `• ❌ ${s}`).join('\n');
        } else {
          responseText = "Please upload a resume and Job Description to calculate your skill match.";
        }
        break;

      case 'Prepare Interview Questions':
        if (resume || jd || analysis) {
          const prompt = `Generate 5 structured interview questions for candidate ${resume?.parsedData?.name || 'Applicant'} applying for ${jd?.parsedData?.jobTitle || 'Role'}.\nContext: ${contextInfo}`;
          const aiQuestionsRaw = await generateGeminiContent(SYSTEM_PROMPTS.interviewQuestions, prompt);
          if (aiQuestionsRaw) {
            const parsed = parseJsonResponse(aiQuestionsRaw);
            if (parsed && Array.isArray(parsed.questions)) {
              responseText = `🎤 **Tailored Interview Questions:**\n\n` +
                parsed.questions.map((q, i) => 
                  `**Q${i + 1} (${q.category}):** ${q.question}\n` +
                  `*Sample Answer Focus:* ${q.sampleAnswer || q.keyPoints?.join(', ')}`
                ).join('\n\n');
            }
          }
          if (!responseText) {
            responseText = `🎤 **Tailored Interview Preparation Questions:**\n\n` +
              `1. **(Technical):** Walk us through your experience with ${(analysis?.matchedSkills || ['React', 'Node.js'])[0] || 'core technologies'}.\n` +
              `2. **(Skill Gap):** How would you quickly get up to speed with ${(analysis?.missingSkills || ['AWS'])[0] || 'new tools'} in this role?\n` +
              `3. **(Project):** Describe a challenging project where you solved complex architectural problems.\n` +
              `4. **(Role Alignment):** Why is this position at ${jd?.company || 'our company'} the right next step for your career?\n` +
              `5. **(HR):** How do you prioritize tasks when managing tight project deadlines?`;
          }
        } else {
          responseText = "Upload a resume or job description first so I can generate relevant interview questions.";
        }
        break;

      default:
        break;
    }
  }

  // Handle Natural Language Message with Gemini AI or Smart Fallback
  if (!responseText) {
    const aiResponse = await generateGeminiChat(history, messageText, contextInfo);
    if (aiResponse) {
      responseText = aiResponse;
    } else {
      // Deterministic Intelligent Context Fallback
      const lower = messageText.toLowerCase();
      if (lower.includes('score') || lower.includes('why did i get') || lower.includes('ats')) {
        responseText = analysis 
          ? `Your current ATS score is **${analysis.atsScore}/100**. Your skill match is **${analysis.skillMatchPercentage}%**, and your keyword alignment is **${analysis.keywordMatchPercentage}%**.`
          : `I don't have an active ATS score yet. Please upload your resume and a Job Description to compute your score.`;
      } else if (lower.includes('missing') || lower.includes('lacking') || lower.includes('gap')) {
        responseText = analysis
          ? `Compared with this JD, your missing required skills are: **${analysis.missingSkills.join(', ') || 'None! All match'}**.`
          : `Please run an analysis first so I can identify your skill gaps.`;
      } else if (lower.includes('course') || lower.includes('learn') || lower.includes('study')) {
        responseText = analysis
          ? `Based on missing skills, I recommend focusing on: **${analysis.missingSkills.slice(0, 3).join(', ') || 'Advanced Architecture & Performance'}**.`
          : `Upload your resume and a JD to get tailored course recommendations!`;
      } else if (lower.includes('interview') || lower.includes('question')) {
        responseText = `Here is a key interview question for you: *Explain how you have used ${(analysis?.matchedSkills || ['your primary skills'])[0]} to solve critical engineering challenges in past projects.*`;
      } else if (lower.includes('resume') || lower.includes('experience')) {
        responseText = resume
          ? `Your active resume lists skills: **${(resume.parsedData?.skills || []).join(', ')}**.`
          : `No resume uploaded yet. Upload a PDF or DOCX file to get started!`;
      } else {
        responseText = `I am your ResumeAI Assistant! I can help you evaluate your ATS score, discover missing skills, suggest learning roadmaps, and generate interview questions based on your resume and target job description.`;
      }
    }
  }

  return responseText;
};
