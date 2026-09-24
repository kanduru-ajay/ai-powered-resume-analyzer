import { generateGeminiContent, parseJsonResponse } from '../ai/geminiService.js';
import { SYSTEM_PROMPTS } from '../ai/prompts.js';
import { skillMatchesText } from '../../utils/regexUtils.js';

const COMMON_JD_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'Python', 'Django',
  'Java', 'Spring Boot', 'C++', 'C#', '.NET', 'SQL', 'PostgreSQL', 'MongoDB',
  'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Agile', 'Scrum', 'REST API',
  'Microservices', 'GraphQL', 'Tailwind', 'HTML', 'CSS', 'Linux', 'Unit Testing'
];

export const parseJdFallback = (rawText) => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  let jobTitle = 'Software Developer';
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 60) {
      jobTitle = firstLine.replace(/^Job Title:?\s*/i, '').trim();
    }
  }

  // Safely find skills using skillMatchesText without regex syntax errors
  const foundSkills = [];
  COMMON_JD_SKILLS.forEach(skill => {
    if (skillMatchesText(skill, rawText)) {
      foundSkills.push(skill);
    }
  });

  const requiredSkills = foundSkills.slice(0, Math.ceil(foundSkills.length * 0.7));
  const preferredSkills = foundSkills.slice(Math.ceil(foundSkills.length * 0.7));

  const expMatch = rawText.match(/(\d+\+?\s*(?:-\s*\d+)?\s*(?:years|yrs)\s*(?:of\s*)?(?:experience|exp)?)/i);
  const experience = expMatch ? expMatch[0] : '2+ years of relevant experience';

  const respLines = lines.filter(l => 
    /design|develop|build|maintain|collaborate|lead|implement|ensure|manage|write/i.test(l)
  ).slice(0, 5);

  return {
    jobTitle,
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['JavaScript', 'Problem Solving', 'Git'],
    preferredSkills: preferredSkills.length > 0 ? preferredSkills : ['AWS', 'Docker'],
    experience,
    education: ['Bachelor\'s degree in Computer Science or related field'],
    responsibilities: respLines.length > 0 ? respLines : [
      'Develop scalable web applications and features',
      'Collaborate with cross-functional teams to deliver quality software',
      'Participate in code reviews and maintain clean architecture'
    ],
    technologies: foundSkills,
    certifications: ['Relevant Industry Certification (Preferred)'],
    keywords: [...new Set([...foundSkills, 'Software Development', 'Agile', 'Teamwork'])]
  };
};

export const parseJobDescriptionToJSON = async (rawText) => {
  if (!rawText || rawText.trim().length < 15) {
    throw new Error('Job description text is empty or too short.');
  }

  const aiRawResponse = await generateGeminiContent(SYSTEM_PROMPTS.jdAnalyzer, rawText);
  if (aiRawResponse) {
    const jsonResult = parseJsonResponse(aiRawResponse);
    if (jsonResult && (jsonResult.requiredSkills || jsonResult.jobTitle)) {
      return {
        jobTitle: jsonResult.jobTitle || 'Software Professional',
        requiredSkills: Array.isArray(jsonResult.requiredSkills) ? jsonResult.requiredSkills : [],
        preferredSkills: Array.isArray(jsonResult.preferredSkills) ? jsonResult.preferredSkills : [],
        experience: jsonResult.experience || '2+ years',
        education: Array.isArray(jsonResult.education) ? jsonResult.education : [],
        responsibilities: Array.isArray(jsonResult.responsibilities) ? jsonResult.responsibilities : [],
        technologies: Array.isArray(jsonResult.technologies) ? jsonResult.technologies : [],
        certifications: Array.isArray(jsonResult.certifications) ? jsonResult.certifications : [],
        keywords: Array.isArray(jsonResult.keywords) ? jsonResult.keywords : []
      };
    }
  }

  return parseJdFallback(rawText);
};
