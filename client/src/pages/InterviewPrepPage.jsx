import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Loader2, Award, Check } from 'lucide-react';

const InterviewPrepPage = () => {
  const [questions, setQuestions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewQuestions();
  }, []);

  const fetchInterviewQuestions = async () => {
    try {
      const res = await API.post('/interview/questions', {});
      setQuestions(res.data.data.questions || []);
    } catch (err) {
      console.error('Failed to load interview questions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (i) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto space-y-8 overflow-x-hidden">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-brand-400" />
                AI Interview Preparation Generator
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Technical, HR, Project, and Skill-Gap interview questions generated specifically from your resume and target JD.
              </p>
            </div>

            <button
              onClick={fetchInterviewQuestions}
              disabled={loading}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-lg flex items-center gap-1.5 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Regenerate Questions</span>
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all">
                  <div
                    onClick={() => toggleExpand(i)}
                    className="p-5 cursor-pointer flex items-start justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-950 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                        {q.category || 'General'} Question
                      </span>
                      <h3 className="text-sm font-bold text-white pt-1">
                        Q{i + 1}: {q.question}
                      </h3>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-white shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800 bg-slate-950/60 space-y-3 text-xs">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Sample Answer Guidance:
                        </h4>
                        <p className="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                          {q.sampleAnswer}
                        </p>
                      </div>

                      {q.keyPoints && q.keyPoints.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-400 mb-1">Key Points to Mention:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {q.keyPoints.map((kp, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                                • {kp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
};

export default InterviewPrepPage;
