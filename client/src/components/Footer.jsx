import React from 'react';
import { Sparkles, Shield, Cpu, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white">Resume<span className="text-brand-500">AI</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered recruitment and career assistant. Modern ATS score analysis, skill gap discovery, and candidate comparison.
          </p>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Core Features</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#features" className="hover:text-white transition-colors">ATS Scoring Engine</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Resume & JD Parsing</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Multiple Resume Analysis</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Course Recommendations</a></li>
          </ul>
        </div>

        {/* Integration */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">AI Channels</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-300">Web App Assistant</span></li>
            <li><span className="text-slate-300">Telegram Bot Integration</span></li>
            <li><span className="text-slate-500">Discord & Slack Adapters (Coming Soon)</span></li>
          </ul>
        </div>

        {/* System info */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Technology & Security</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-brand-400" />
              <span>Google Gemini AI Integration</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>JWT Authentication & Encryption</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} ResumeAI Inc. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built for Candidates & Recruiters with precision ATS matching.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
