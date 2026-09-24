import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import { generateGeminiContent, parseJsonResponse } from '../ai/geminiService.js';
import { SYSTEM_PROMPTS } from '../ai/prompts.js';
import { skillMatchesText } from '../../utils/regexUtils.js';

// Common technical skills for deterministic extraction fallback
const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'React.js', 'Node.js', 'Express', 'Express.js',
  'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C++', 'C#', '.NET', 'Go', 'Golang',
  'Rust', 'PHP', 'Laravel', 'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind', 'Tailwind CSS',
  'Bootstrap', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  'RESTful APIs', 'Microservices', 'AWS', 'Amazon Web Services', 'Azure', 'GCP',
  'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub', 'GitLab', 'Jira', 'Agile', 'Scrum',
  'Unit Testing', 'Jest', 'Cypress', 'Machine Learning', 'Data Analysis', 'Linux', 'Bash'
];

export const extractTextFromFile = async (fileBuffer, mimetype, originalName) => {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error('Uploaded file is empty.');
  }

  let text = '';
  const ext = originalName.split('.').pop().toLowerCase();

  try {
    if (mimetype === 'application/pdf' || ext === 'pdf') {
      const parsed = await pdfParse(fileBuffer);
      text = parsed.text || '';
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword' ||
      ext === 'docx' || ext === 'doc'
    ) {
      const parsed = await mammoth.extractRawText({ buffer: fileBuffer });
      text = parsed.value || '';
    } else {
      text = fileBuffer.toString('utf-8');
    }
  } catch (err) {
    console.error(`File text extraction failed (${originalName}):`, err.message);
    throw new Error(`Could not parse file content. File might be corrupted or password protected.`);
  }

  const cleanText = text.replace(/\r\n/g, '\n').trim();
  if (cleanText.length < 20) {
    throw new Error('Extracted text is too short or invalid to analyze.');
  }

  return cleanText;
};

// Fallback deterministic JSON parser when Gemini is unavailable or returns non-JSON
export const parseResumeTextFallback = (text) => {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const name = lines.length > 0 ? lines[0].substring(0, 50) : 'Candidate Name';

  // Safely find skills using skillMatchesText without regex syntax errors
  const foundSkills = [];
  COMMON_SKILLS.forEach(skill => {
    if (skillMatchesText(skill, text)) {
      foundSkills.push(skill);
    }
  });

  const experienceLines = lines.filter(l => 
    /developer|engineer|manager|intern|associate|analyst|specialist|lead|architect|consultant|work|experience|role/i.test(l)
  ).slice(0, 5);

  const educationLines = lines.filter(l => 
    /bachelor|master|b\.s|b\.e|b\.tech|m\.s|m\.tech|phd|diploma|university|college|degree|institute/i.test(l)
  ).slice(0, 3);

  const certLines = lines.filter(l => 
    /certified|certification|certificate|aws certified|oracle|microsoft|coursera|udemy/i.test(l)
  ).slice(0, 3);

  return {
    name: name,
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    location: lines.find(l => /city|state|country|usa|india|uk|canada|remote/i.test(l)) || 'Not specified',
    summary: lines.slice(0, 4).join(' ').substring(0, 300),
    skills: [...new Set(foundSkills)],
    education: educationLines.length > 0 ? educationLines : ['Degree / Higher Education'],
    experience: experienceLines.length > 0 ? experienceLines : ['Relevant Work Experience'],
    projects: lines.filter(l => /project|built|developed|created|system|app/i.test(l)).slice(0, 4),
    certifications: certLines,
    technologies: [...new Set(foundSkills)],
    achievements: lines.filter(l => /awarded|achieved|increased|reduced|managed|led/i.test(l)).slice(0, 3),
    keywords: [...new Set([...foundSkills, 'Software Development', 'Problem Solving', 'Team Collaboration'])]
  };
};

export const parseResumeToJSON = async (rawText) => {
  const aiRawResponse = await generateGeminiContent(SYSTEM_PROMPTS.resumeParser, rawText);
  if (aiRawResponse) {
    const jsonResult = parseJsonResponse(aiRawResponse);
    if (jsonResult && (jsonResult.skills || jsonResult.name)) {
      return {
        name: jsonResult.name || 'Candidate Name',
        email: jsonResult.email || '',
        phone: jsonResult.phone || '',
        location: jsonResult.location || '',
        summary: jsonResult.summary || '',
        skills: Array.isArray(jsonResult.skills) ? jsonResult.skills : [],
        education: Array.isArray(jsonResult.education) ? jsonResult.education : [],
        experience: Array.isArray(jsonResult.experience) ? jsonResult.experience : [],
        projects: Array.isArray(jsonResult.projects) ? jsonResult.projects : [],
        certifications: Array.isArray(jsonResult.certifications) ? jsonResult.certifications : [],
        technologies: Array.isArray(jsonResult.technologies) ? jsonResult.technologies : [],
        achievements: Array.isArray(jsonResult.achievements) ? jsonResult.achievements : [],
        keywords: Array.isArray(jsonResult.keywords) ? jsonResult.keywords : []
      };
    }
  }

  return parseResumeTextFallback(rawText);
};
