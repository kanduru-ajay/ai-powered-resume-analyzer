import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScoreGauge from '../components/ScoreGauge';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Target, 
  Bot, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  BookOpen,
  FileText
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs font-semibold text-brand-300 shadow-md">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>AI-Powered Resume Analysis & Recruitment Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Optimize Resumes. <br />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Beat the ATS & Land More Interviews.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            ResumeAI parses resumes, compares them against target Job Descriptions, computes transparent ATS scores out of 100, identifies missing skills, and delivers personalized course recommendations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-brand-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Analyze Your Resume</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-brand-400" />
              <span>Try AI Assistant</span>
            </Link>
          </div>

          {/* Social Proof Highlights */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 border-t border-slate-800/80 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Deterministic & Transparent Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PDF, DOC & DOCX Parsing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recruiter Bulk Candidate Comparison</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Demo Preview */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Instant Objective ATS Score Breakdown
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              No guessing games. Real quantitative metrics combined with qualitative AI feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* ATS Score Card Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
              <ScoreGauge score={84} size="lg" label="Calculated ATS Score" />
              <div className="w-full grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-left">
                  <span className="text-slate-400 text-[11px]">Skill Match</span>
                  <p className="font-bold text-emerald-400 text-sm">86%</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-left">
                  <span className="text-slate-400 text-[11px]">Keywords</span>
                  <p className="font-bold text-brand-400 text-sm">81%</p>
                </div>
              </div>
            </div>

            {/* Matched vs Missing Skills Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-400" />
                Skill Gap & Keyword Alignment
              </h3>
              
              <div className="space-y-2">
                <p className="text-xs font-semibold text-emerald-400">✓ Matched Required Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['React.js', 'Node.js', 'TypeScript', 'SQL', 'Git'].map(s => (
                    <span key={s} className="px-2.5 py-1 rounded text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-xs font-semibold text-rose-400">✗ Missing Skills to Add:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Docker', 'AWS Cloud', 'Spring Boot'].map(s => (
                    <span key={s} className="px-2.5 py-1 rounded text-xs bg-rose-950/60 text-rose-300 border border-rose-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Integrated Chatbot Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-brand-400">
                <Bot className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Context-Aware AI Assistant</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-brand-600 text-white p-2.5 rounded-xl rounded-br-none ml-auto max-w-[85%]">
                  "Why did I get 84 out of 100?"
                </div>
                <div className="bg-slate-800 text-slate-200 p-2.5 rounded-xl rounded-bl-none border border-slate-700/60">
                  "Your main positive drivers were React and SQL skills. The largest remaining gap is production AWS and Docker experience."
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white">How ResumeAI Works</h2>
            <p className="text-slate-400 text-sm mt-2">3 simple steps to boost candidate matching and resume ATS score</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold text-base border border-brand-500/30">
                1
              </div>
              <h3 className="text-base font-bold text-white">Upload Resume (Single or Bulk)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload candidate resumes in PDF or DOCX formats. Our backend parser extracts structured skills, work history, and education into JSON format.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-base border border-indigo-500/30">
                2
              </div>
              <h3 className="text-base font-bold text-white">Input Job Description</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste job text or upload JD document. The analyzer isolates required skills, preferred qualifications, and critical keywords automatically.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-base border border-purple-500/30">
                3
              </div>
              <h3 className="text-base font-bold text-white">Get ATS Score & AI Recommendations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive transparent ATS score, course recommendations, interview prep questions, downloadable reports, and interactive AI chat assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter & Candidate Roles Grid */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Candidate Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              For Job Seekers & Candidates
            </div>
            <h3 className="text-xl font-bold text-white">Optimize Your Resume for Every Application</h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Calculate exact ATS score before submitting to recruiters</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Spot missing keywords and required tech stack skills</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Get tailored course and learning topic recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Practice role-specific technical and HR interview questions</span>
              </li>
            </ul>
          </div>

          {/* Recruiter Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 text-brand-300 text-xs font-semibold border border-brand-500/30">
              For Recruiters & Hiring Managers
            </div>
            <h3 className="text-xl font-bold text-white">Batch Analyze & Compare Candidate Pool</h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Bulk upload multiple resumes against 1 Job Description</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>View objective candidate rankings sorted by ATS Score</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Side-by-side candidate comparison matrix</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Download candidate recruitment reports</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Ready to Boost Your Hiring & Career Growth?</h2>
          <p className="text-sm text-slate-400">Join candidates and recruiters using ResumeAI for transparent resume evaluation.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-brand-600/30 transition-all transform hover:scale-105"
          >
            <span>Create Your Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
