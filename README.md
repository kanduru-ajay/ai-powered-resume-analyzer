# ResumeAI – AI Resume Analyzer & Recruitment Assistant

> **Complete production-ready full-stack AI platform** for candidate resume analysis, transparent ATS scoring, job description parsing, course recommendations, bulk candidate evaluation, and multi-channel AI recruitment assistance (Web & Telegram).

---

## 🚀 Key Features

1. **Deterministic & Transparent ATS Scoring (0-100)**:
   - Configurable weighted algorithm based on documented metrics (Skills 30%, Experience 20%, Keywords 15%, Technology 15%, Responsibilities 10%, Education 10%).
   - Eliminates random AI scoring hallucinations.

2. **Resume Parsing (PDF, DOC, DOCX)**:
   - Structured JSON extraction (Name, Email, Phone, Skills, Education, Work History, Certifications, Technologies, Keywords).
   - Robust pattern-based fallback parser guarantees 100% reliable extraction without external API dependencies.

3. **Job Description Analyzer**:
   - Parses raw JD text or uploaded documents into structured criteria (Required vs Preferred skills, Experience level, Responsibilities, Technologies, Keywords).

4. **Multi-Resume Bulk Analysis (Recruiter Hub)**:
   - Recruiter feature allowing batch uploading of $N$ candidate resumes against 1 target Job Description.
   - Candidate ranking table with sorting by ATS score, Skill match, and Experience.
   - Side-by-side candidate comparison matrix modal.

5. **Integrated AI Assistant (Web & Telegram)**:
   - Context-aware chatbot connected to active user session, resume, JD, and ATS analysis.
   - Responds to natural language questions (*"Why did I get 84?"*, *"What skills am I missing?"*).
   - Quick Action buttons (*Explain ATS Score*, *Show Missing Skills*, *Improve Resume*, *Recommend Courses*, *Prepare Interview Questions*).

6. **External Telegram Bot Adapter**:
   - Platform-independent architecture using shared backend services (`chatService.js`, `atsEngine.js`, `parserService.js`).
   - Telegram user can upload PDF/DOCX resumes directly to Telegram, send a Job Description text, and receive immediate ATS report.

7. **Course & Learning Recommendations**:
   - Tailored learning roadmaps with skill level, why required, subtopics, and priority.

8. **AI Interview Preparation**:
   - Generates role-specific Technical, HR, Project, and Skill-gap questions with sample answer guidance and key points.

---

## 🛠 Tech Stack

- **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide React Icons, Recharts, Axios, React Router v6.
- **Backend**: Node.js (ES Modules), Express.js, JWT Authentication, bcryptjs, Multer file processing, pdf-parse, mammoth.
- **Database**: MongoDB & Mongoose (with seamless local memory fallback store for out-of-the-box operation).
- **AI Integration**: Google Gemini API (`@google/generative-ai` model `gemini-1.5-flash`).
- **Telegram Channel**: `node-telegram-bot-api` adapter.

---

## 📂 Project Structure

```
resume-ai/
├── client/                     # Frontend React Vite Application
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Sidebar, ScoreGauge, SkillBadge, ChatbotWidget, CandidateCompareModal)
│   │   ├── context/            # AuthContext, ChatContext
│   │   ├── pages/              # LandingPage, CandidateDashboard, RecruiterDashboard, ResumeUploadPage, JdInputPage, AnalyzePage, AnalysisResultPage, BulkAnalysisPage, CandidatesPage, RecommendationsPage, InterviewPrepPage, HistoryPage, ProfilePage
│   │   ├── services/           # Axios API client
│   │   ├── App.jsx             # React Router Setup
│   │   ├── main.jsx            # DOM Entry Point
│   │   └── index.css           # Tailwind CSS directives & custom utility classes
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Express API Server
│   ├── config/                 # Database connection & ATS scoring weights
│   ├── controllers/            # Auth, Resume, JD, Analysis, Chat, Recommendations, Interview controllers
│   ├── middleware/             # JWT Auth, Multer File Upload, Error Handler
│   ├── models/                 # User, Resume, JobDescription, Analysis, ChatConversation, ChatMessage, Recommendation, InterviewSession
│   ├── routes/                 # Express REST API routes
│   ├── services/
│   │   ├── ai/                 # Gemini API integration & prompts
│   │   ├── ats/                # Deterministic ATS Scoring Engine
│   │   ├── chatbot/            # chatService.js, contextService.js, telegramService.js
│   │   ├── jdAnalyzer/         # JD parsing service
│   │   ├── recommendations/    # Course recommendation engine
│   │   └── resumeParser/       # PDF/DOCX text extraction & parsing
│   ├── utils/                  # Demo data & report generator
│   ├── server.js               # Main Express entry point
│   ├── .env.example
│   └── package.json
│
├── .env.example
└── README.md
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/resumeai
JWT_SECRET=resumeai_jwt_secret_key_2026_super_secure
GEMINI_API_KEY=your_gemini_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
NODE_ENV=development
```

---

## ⚡ Quick Start & Installation

### 1. Install Dependencies

**Backend Setup:**
```bash
cd server
npm install
```

**Frontend Setup:**
```bash
cd client
npm install
```

### 2. Running Backend Server

From `server/` directory:
```bash
npm run dev
# Server will start on http://localhost:5000
```

### 3. Running Frontend Application

From `client/` directory:
```bash
npm run dev
# Frontend will start on http://localhost:3000
```

---

## 📊 How ATS Scoring Works

The ATS calculation uses a transparent, deterministic weighted scoring formula:

$$\text{ATS Score} = w_1 \cdot \text{SkillMatch} + w_2 \cdot \text{ExpMatch} + w_3 \cdot \text{KwMatch} + w_4 \cdot \text{TechMatch} + w_5 \cdot \text{RespMatch} + w_6 \cdot \text{EduMatch}$$

Default weights configured in `server/config/weights.js`:
- **Skills Match**: 30%
- **Experience Match**: 20%
- **Keyword Alignment**: 15%
- **Technology Stack**: 15%
- **Responsibilities Alignment**: 10%
- **Education / Certifications**: 10%

---

## 🤖 Telegram Bot Integration Setup Guide

1. Open Telegram and search for **@BotFather**.
2. Send `/newbot` and follow instructions to create a bot (e.g. `ResumeAI_Assistant_Bot`).
3. Copy the HTTP API token provided by BotFather.
4. Add the token to `server/.env`:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
   ```
5. Restart backend server (`npm run dev`). You will see:
   `🚀 Telegram Bot Service initialized successfully.`
6. Open your bot in Telegram and send `/start`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user (Candidate / Recruiter) |
| `POST` | `/api/auth/login` | Login user & return JWT token |
| `GET` | `/api/auth/me` | Fetch active user profile |
| `POST` | `/api/resume/upload` | Upload single resume (PDF/DOCX) |
| `POST` | `/api/resume/bulk-upload` | Upload multiple resumes for recruiter batch |
| `GET` | `/api/resume` | List user uploaded resumes |
| `POST` | `/api/jd/analyze` | Parse Job Description text or document |
| `POST` | `/api/analysis/single` | Run ATS analysis (1 Resume vs 1 JD) |
| `POST` | `/api/analysis/bulk-analyze` | Run bulk analysis ($N$ Resumes vs 1 JD) |
| `POST` | `/api/analysis/compare` | Compare candidate analyses side-by-side |
| `GET` | `/api/analysis/:id/report` | Download printable report TXT file |
| `POST` | `/api/chat/message` | Send message / quick action to AI assistant |
| `POST` | `/api/interview/questions` | Generate tailored interview questions |

---

## 🛡 Security & Error Handling

- Passwords hashed using `bcryptjs` with salt rounds = 10.
- API endpoints protected via JWT middleware.
- Input file validation restricts uploads to valid PDF/DOC/DOCX up to 10MB.
- API keys strictly isolated in server `.env`.

---

## 🧪 Testing

1. Use **Quick Demo Login** on the login page (`Candidate Demo` or `Recruiter Demo`) to test instantly with pre-loaded demo data.
2. Click **Load Sample Demo Resume** on the Resumes page.
3. Click **Load Sample Job Description** on the Job Description page.
4. Run ATS analysis and open the **AI Assistant** to ask context-aware questions.
