import { GoogleGenerativeAI } from '@google/generative-ai';

// Clean JSON response helper
export const parseJsonResponse = (text) => {
  try {
    if (!text) return null;
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean);
  } catch (error) {
    console.error('Failed to parse Gemini JSON response:', error.message);
    return null;
  }
};

export const generateGeminiContent = async (systemInstruction, userPrompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    console.warn('GEMINI_API_KEY is not set. Utilizing rule-based AI processing fallback.');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return null;
  }
};

export const generateGeminiChat = async (history, message, contextInfo = '') => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  const systemPrompt = `You are "ResumeAI Assistant", a world-class career development and recruitment AI.
You help candidates analyze resumes, improve ATS scores, understand job descriptions, and prepare for interviews.
You help recruiters evaluate candidates fairly based on objective resume-to-JD metrics.

CURRENT USER CONTEXT:
${contextInfo}

RULES:
- Answer questions accurately using ONLY the provided context when available.
- If information is missing from the resume/JD/analysis, state clearly that it is not available.
- Provide clear, professional, concise, and structured guidance.
- Do NOT make up information or hallucinate facts about the candidate.`;

  if (!apiKey || apiKey.trim() === '') {
    return null; // Will trigger rule-based chat fallback
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });

    // Format chat history for Gemini
    const formattedHistory = (history || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Chat Error:', error.message);
    return null;
  }
};
