import TelegramBot from 'node-telegram-bot-api';
import { extractTextFromFile, parseResumeToJSON } from '../resumeParser/parserService.js';
import { parseJobDescriptionToJSON } from '../jdAnalyzer/jdService.js';
import { analyzeResumeAndJD } from '../ats/atsEngine.js';
import { processChatMessage } from './chatService.js';

// In-memory Telegram session context mapping per Telegram Chat ID (isolated per user)
export const telegramSessions = new Map();

export const getTelegramSession = (chatId) => {
  const strId = String(chatId);
  if (!telegramSessions.has(strId)) {
    telegramSessions.set(strId, {
      resume: null,
      jd: null,
      analysis: null,
      awaitingJd: false,
      history: []
    });
  }
  return telegramSessions.get(strId);
};

export const initTelegramBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token.trim() === '' || token.includes('your_telegram_bot_token')) {
    console.log('ℹ️ TELEGRAM_BOT_TOKEN is not configured. Telegram bot service skipped.');
    return null;
  }

  try {
    const bot = new TelegramBot(token, { polling: true });

    console.log('🚀 Telegram Bot Service initialized successfully.');

    // 1. /start command
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      getTelegramSession(chatId); // initialize session

      bot.sendMessage(chatId,
        `👋 **Welcome to ResumeAI & Recruitment Assistant!**\n\n` +
        `I am your AI recruitment and career assistant. Here is how to use me:\n\n` +
        `1️⃣ **Upload your Resume** (Send a PDF or DOCX file)\n` +
        `2️⃣ **Send the Job Description** (Paste text or send a JD file)\n` +
        `3️⃣ **Get Your Detailed ATS Analysis & Course Roadmap!**\n\n` +
        `**Available Commands:**\n` +
        `• /analyze - Start a new resume & JD analysis flow\n` +
        `• /score - View your latest ATS score breakdown\n` +
        `• /skills - List matched skills\n` +
        `• /missing - View missing required & preferred skills\n` +
        `• /suggestions - Actionable resume improvement suggestions\n` +
        `• /courses - Recommended learning topics\n` +
        `• /interview - Generate tailored interview prep questions\n` +
        `• /clear - Clear your session data\n` +
        `• /help - Show this help menu\n\n` +
        `👇 **Please start by sending your Resume file (PDF or DOCX):**`,
        { parse_mode: 'Markdown' }
      );
    });

    // 2. /help command
    bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId,
        `💡 **ResumeAI Telegram Assistant Guide**\n\n` +
        `• **Resume Upload:** Send any PDF or DOCX document to parse your skills & work history.\n` +
        `• **Job Description:** Send the target JD text or document after uploading your resume.\n` +
        `• **ATS Calculation:** Automatically computes transparent score out of 100 based on exact weights.\n` +
        `• **Natural Language Chat:** Ask follow-up questions like:\n` +
        `  - *"Why did I get 84?"*\n` +
        `  - *"What skills am I missing?"*\n` +
        `  - *"How can I improve my score?"*\n` +
        `  - *"What should I learn first?"*\n` +
        `  - *"Generate 5 interview questions"*\n\n` +
        `Use /clear to reset your session and start fresh!`,
        { parse_mode: 'Markdown' }
      );
    });

    // 3. /clear command
    bot.onText(/\/clear/, (msg) => {
      const chatId = msg.chat.id;
      telegramSessions.delete(String(chatId));
      bot.sendMessage(chatId, "🧹 **Session cleared.** You can now send a new resume or job description.");
    });

    // 4. /analyze command
    bot.onText(/\/analyze/, (msg) => {
      const chatId = msg.chat.id;
      const session = getTelegramSession(chatId);
      if (!session.resume) {
        bot.sendMessage(chatId, "📄 Please send your Resume document (PDF or DOCX) first.");
      } else {
        session.awaitingJd = true;
        bot.sendMessage(chatId, "💼 Please paste the Job Description text (or send a JD document) to calculate your ATS match.");
      }
    });

    // Document Handler (PDF/DOCX Resume OR Job Description file)
    bot.on('document', async (msg) => {
      const chatId = msg.chat.id;
      const session = getTelegramSession(chatId);

      try {
        const fileId = msg.document.file_id;
        const fileName = msg.document.file_name || 'document.pdf';
        const mimeType = msg.document.mime_type || 'application/pdf';

        bot.sendMessage(chatId, `⏳ Downloading and processing document \`${fileName}\`...`, { parse_mode: 'Markdown' });

        const fileLink = await bot.getFileLink(fileId);
        const response = await fetch(fileLink);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const textContent = await extractTextFromFile(buffer, mimeType, fileName);

        // Case A: Awaiting Job Description Document
        if (session.resume && session.awaitingJd) {
          session.awaitingJd = false;
          bot.sendMessage(chatId, "⚙️ Parsing Job Description document and calculating ATS score...");

          const parsedJd = await parseJobDescriptionToJSON(textContent);
          session.jd = { rawText: textContent, parsedData: parsedJd };

          const analysisResult = await analyzeResumeAndJD(session.resume.parsedData, parsedJd);
          session.analysis = analysisResult;

          await sendFullAnalysisReport(bot, chatId, analysisResult);
          return;
        }

        // Case B: Uploading Resume Document
        const parsedResume = await parseResumeToJSON(textContent);
        session.resume = {
          filename: fileName,
          textContent,
          parsedData: parsedResume
        };
        session.awaitingJd = true;

        bot.sendMessage(chatId,
          `✅ **Resume Received & Parsed Successfully!**\n\n` +
          `• **Candidate Name:** ${parsedResume.name || 'Candidate'}\n` +
          `• **Email:** ${parsedResume.email || 'Not specified'}\n` +
          `• **Extracted Skills (${parsedResume.skills?.length || 0}):** ${(parsedResume.skills || []).slice(0, 8).join(', ')}\n\n` +
          `👉 **Now please paste the Job Description text (or send a JD document) below to calculate your ATS match score:**`,
          { parse_mode: 'Markdown' }
        );
      } catch (err) {
        bot.sendMessage(chatId, `❌ Document processing error: ${err.message}. Please send a valid PDF or DOCX file.`);
      }
    });

    // Message & Natural Language Handler
    bot.on('message', async (msg) => {
      // Ignore documents (handled above)
      if (msg.document) return;

      const chatId = msg.chat.id;
      const text = msg.text;
      if (!text) return;

      // Skip base setup commands handled by regex
      if (text.startsWith('/start') || text.startsWith('/help') || text.startsWith('/clear') || text.startsWith('/analyze')) return;

      const session = getTelegramSession(chatId);

      // 1. Slash Command Shortcuts
      let quickAction = null;
      if (text.startsWith('/score')) quickAction = 'Explain My ATS Score';
      else if (text.startsWith('/skills')) quickAction = 'Show Skill Match';
      else if (text.startsWith('/missing')) quickAction = 'Show Missing Skills';
      else if (text.startsWith('/suggestions')) quickAction = 'Improve My Resume';
      else if (text.startsWith('/courses')) quickAction = 'Recommend Courses';
      else if (text.startsWith('/interview')) quickAction = 'Prepare Interview Questions';

      // 2. Handle JD text submission if awaiting JD
      if (session.awaitingJd && !quickAction && text.length > 20) {
        session.awaitingJd = false;
        bot.sendMessage(chatId, "⚙️ **Analyzing your resume against the Job Description...**", { parse_mode: 'Markdown' });

        try {
          const parsedJd = await parseJobDescriptionToJSON(text);
          session.jd = { rawText: text, parsedData: parsedJd };

          const analysisResult = await analyzeResumeAndJD(session.resume.parsedData, parsedJd);
          session.analysis = analysisResult;

          await sendFullAnalysisReport(bot, chatId, analysisResult);
          return;
        } catch (err) {
          bot.sendMessage(chatId, `❌ Analysis error: ${err.message}`);
          return;
        }
      }

      // 3. Process natural language questions via shared chatService
      bot.sendChatAction(chatId, 'typing');
      try {
        const responseText = await processChatMessage({
          conversationId: `telegram_${chatId}`,
          userId: null,
          messageText: text,
          history: session.history,
          quickAction
        });

        session.history.push({ sender: 'user', text });
        session.history.push({ sender: 'assistant', text: responseText });
        if (session.history.length > 20) session.history = session.history.slice(-20);

        bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });
      } catch (err) {
        bot.sendMessage(chatId, `Sorry, error processing request: ${err.message}`);
      }
    });

    return bot;
  } catch (error) {
    console.error('Failed to start Telegram Bot:', error.message);
    return null;
  }
};

// Helper function to send complete structured analysis response in Telegram
const sendFullAnalysisReport = async (bot, chatId, analysis) => {
  const reportMsg = 
    `📊 **Resume Analysis Complete**\n\n` +
    `🎯 **ATS Score: ${analysis.atsScore} / 100**\n\n` +
    `• **Skill Match:** ${analysis.skillMatchPercentage}%\n` +
    `• **Keyword Match:** ${analysis.keywordMatchPercentage}%\n` +
    `• **Experience Match:** ${analysis.experienceMatchPercentage}%\n` +
    `• **Technology Match:** ${analysis.technologyMatchPercentage}%\n` +
    `• **Education Match:** ${analysis.educationMatchPercentage}%\n\n` +
    `✓ **Matched Skills:**\n${(analysis.matchedSkills || []).map(s => `  • ${s}`).join('\n') || '  • None'}\n\n` +
    `✗ **Missing Required Skills:**\n${(analysis.missingSkills || []).map(s => `  • ${s}`).join('\n') || '  • None!'}\n\n` +
    `✗ **Missing Keywords:**\n${(analysis.missingKeywords || []).map(k => `  • ${k}`).join('\n') || '  • None'}\n\n` +
    `💪 **Strengths:**\n${(analysis.strengths || []).map(s => `  + ${s}`).join('\n')}\n\n` +
    `⚠️ **Weaknesses:**\n${(analysis.weaknesses || []).map(w => `  - ${w}`).join('\n')}\n\n` +
    `💡 **Resume Improvement Suggestions:**\n${(analysis.suggestions || []).map((s, i) => `  ${i + 1}. ${s}`).join('\n')}\n\n` +
    `📚 **Recommended Learning / Courses:**\n${(analysis.recommendedLearning || []).map((r, i) => `  ${i + 1}. *${r.skill}* (${r.priority || 'High'} Priority)\n     Topic: ${(r.topics || []).slice(0, 2).join(', ')}`).join('\n')}\n\n` +
    `💬 *Ask me follow-up questions like "Why did I get ${analysis.atsScore}?", "What skills am I missing?", or "/interview" for interview preparation!*`;

  await bot.sendMessage(chatId, reportMsg, { parse_mode: 'Markdown' });
};
