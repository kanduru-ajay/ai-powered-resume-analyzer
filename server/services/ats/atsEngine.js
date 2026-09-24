import { ATS_WEIGHTS } from '../../config/weights.js';
import { generateGeminiContent, parseJsonResponse } from '../ai/geminiService.js';
import { SYSTEM_PROMPTS } from '../ai/prompts.js';
import { skillMatchesText } from '../../utils/regexUtils.js';
import { generateCourseRecommendations } from '../recommendations/recommendationEngine.js';

export const calculateATSMetrics = (resumeJSON, jdJSON) => {
  const resumeSkills = (resumeJSON.skills || []).concat(resumeJSON.technologies || []);
  const resumeFullText = JSON.stringify(resumeJSON);

  const requiredSkills = jdJSON.requiredSkills || [];
  const preferredSkills = jdJSON.preferredSkills || [];
  const jdKeywords = jdJSON.keywords || [];
  const jdTechnologies = jdJSON.technologies || [];
  const jdResponsibilities = jdJSON.responsibilities || [];

  // 1. Skill Match Calculation
  const matchedSkills = [];
  const missingSkills = [];
  
  requiredSkills.forEach(skill => {
    const isMatched = resumeSkills.some(rs => skillMatchesText(skill, rs) || skillMatchesText(rs, skill)) || skillMatchesText(skill, resumeFullText);
    if (isMatched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const preferredSkillsMissing = [];
  preferredSkills.forEach(skill => {
    const isMatched = resumeSkills.some(rs => skillMatchesText(skill, rs) || skillMatchesText(rs, skill)) || skillMatchesText(skill, resumeFullText);
    if (!isMatched) {
      preferredSkillsMissing.push(skill);
    }
  });

  const totalSkillsCount = Math.max(requiredSkills.length, 1);
  const skillMatchPercentage = Math.min(100, Math.round((matchedSkills.length / totalSkillsCount) * 100));

  // 2. Keyword Match Calculation
  const matchedKeywords = [];
  const missingKeywords = [];

  jdKeywords.forEach(kw => {
    if (skillMatchesText(kw, resumeFullText)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const totalKwCount = Math.max(jdKeywords.length, 1);
  const keywordMatchPercentage = Math.min(100, Math.round((matchedKeywords.length / totalKwCount) * 100));

  // 3. Technology Match Calculation
  const matchedTech = jdTechnologies.filter(tech => 
    resumeSkills.some(rs => skillMatchesText(tech, rs) || skillMatchesText(rs, tech)) || skillMatchesText(tech, resumeFullText)
  );
  const totalTechCount = Math.max(jdTechnologies.length, 1);
  const technologyMatchPercentage = Math.min(100, Math.round((matchedTech.length / totalTechCount) * 100));

  // 4. Experience Match Calculation
  const expCount = (resumeJSON.experience || []).length;
  let experienceMatchPercentage = 60;
  if (expCount >= 3) experienceMatchPercentage = 90;
  else if (expCount === 2) experienceMatchPercentage = 80;
  else if (expCount === 1) experienceMatchPercentage = 70;

  // 5. Responsibilities Alignment
  let respMatchCount = 0;
  jdResponsibilities.forEach(resp => {
    const words = resp.split(/\s+/).filter(w => w.length > 4);
    const matchedWords = words.filter(w => skillMatchesText(w, resumeFullText));
    if (matchedWords.length >= 2) respMatchCount++;
  });
  const totalRespCount = Math.max(jdResponsibilities.length, 1);
  const responsibilitiesMatchPercentage = Math.min(100, Math.round((respMatchCount / totalRespCount) * 100));

  // 6. Education / Certification Match
  const hasEducation = (resumeJSON.education || []).length > 0;
  const hasCertifications = (resumeJSON.certifications || []).length > 0;
  let educationMatchPercentage = 50;
  if (hasEducation && hasCertifications) educationMatchPercentage = 100;
  else if (hasEducation) educationMatchPercentage = 85;

  const weightedScore = (
    skillMatchPercentage * ATS_WEIGHTS.skillsMatch +
    experienceMatchPercentage * ATS_WEIGHTS.experienceMatch +
    keywordMatchPercentage * ATS_WEIGHTS.keywordsMatch +
    technologyMatchPercentage * ATS_WEIGHTS.technologyMatch +
    responsibilitiesMatchPercentage * ATS_WEIGHTS.responsibilitiesAlignment +
    educationMatchPercentage * ATS_WEIGHTS.educationCertification
  );

  const atsScore = Math.min(99, Math.max(15, Math.round(weightedScore)));

  return {
    atsScore,
    skillMatchPercentage,
    keywordMatchPercentage,
    experienceMatchPercentage,
    technologyMatchPercentage,
    educationMatchPercentage,
    matchedSkills: [...new Set(matchedSkills)],
    missingSkills: [...new Set(missingSkills)],
    preferredSkillsMissing: [...new Set(preferredSkillsMissing)],
    matchedKeywords: [...new Set(matchedKeywords)],
    missingKeywords: [...new Set(missingKeywords)]
  };
};

export const analyzeResumeAndJD = async (resumeJSON, jdJSON) => {
  const metrics = calculateATSMetrics(resumeJSON, jdJSON);
  const jobTitle = jdJSON.jobTitle || jdJSON.parsedData?.jobTitle || 'Target Role';

  const recommendedLearning = await generateCourseRecommendations(metrics.missingSkills, jobTitle);

  let qualitativeAnalysis = {
    experienceAnalysis: `Candidate has ${resumeJSON.experience?.length || 0} documented role(s). Background aligns well with standard requirements, though specific domain highlights could be strengthened.`,
    educationAnalysis: `Educational background meets basic qualifications (${resumeJSON.education?.join(', ') || 'Degree listed'}).`,
    strengths: metrics.matchedSkills.length > 0 
      ? metrics.matchedSkills.slice(0, 4).map(s => `Strong proficiency in ${s}`)
      : ['Solid foundation in core technology concepts', 'Relevant project experience documented'],
    weaknesses: metrics.missingSkills.length > 0 
      ? metrics.missingSkills.slice(0, 3).map(s => `Missing key requirement: ${s}`)
      : ['Could expand on quantifiable achievements in work history'],
    suggestions: [
      `Add explicit sections highlighting experience with ${metrics.missingSkills.slice(0, 2).join(', ') || 'key tools'}.`,
      `Incorporate specific metric-driven outcomes (e.g., increased performance by 30%) in project descriptions.`,
      `Tailor resume keywords to closely match the job description terms.`
    ],
    recommendedLearning
  };

  const prompt = `RESUME JSON: ${JSON.stringify(resumeJSON)}\n\nJOB DESCRIPTION JSON: ${JSON.stringify(jdJSON)}\n\nMISSING SKILLS: ${JSON.stringify(metrics.missingSkills)}`;
  const aiRaw = await generateGeminiContent(SYSTEM_PROMPTS.aiAnalysis, prompt);
  if (aiRaw) {
    const aiParsed = parseJsonResponse(aiRaw);
    if (aiParsed) {
      qualitativeAnalysis = {
        experienceAnalysis: aiParsed.experienceAnalysis || qualitativeAnalysis.experienceAnalysis,
        educationAnalysis: aiParsed.educationAnalysis || qualitativeAnalysis.educationAnalysis,
        strengths: Array.isArray(aiParsed.strengths) && aiParsed.strengths.length > 0 ? aiParsed.strengths : qualitativeAnalysis.strengths,
        weaknesses: Array.isArray(aiParsed.weaknesses) && aiParsed.weaknesses.length > 0 ? aiParsed.weaknesses : qualitativeAnalysis.weaknesses,
        suggestions: Array.isArray(aiParsed.suggestions) && aiParsed.suggestions.length > 0 ? aiParsed.suggestions : qualitativeAnalysis.suggestions,
        recommendedLearning
      };
    }
  }

  return {
    ...metrics,
    ...qualitativeAnalysis
  };
};
