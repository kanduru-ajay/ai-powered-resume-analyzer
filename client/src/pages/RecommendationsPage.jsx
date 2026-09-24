import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BookOpen, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Target } from 'lucide-react';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      // Get latest analysis or generate fallback recommendations
      const histRes = await API.get('/analysis/history');
      const history = histRes.data.data.history || [];

      if (history.length > 0 && history[0].recommendedLearning?.length > 0) {
        setRecommendations(history[0].recommendedLearning);
      } else {
        const recRes = await API.post('/recommendations', {
          missingSkills: ['Docker', 'AWS Cloud', 'System Design'],
          jobTitle: 'Software Engineer'
        });
        setRecommendations(recRes.data.data.recommendations || []);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-brand-400" />
              Tailored Course & Learning Roadmap
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Custom skill recommendations generated based on missing Job Description requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-950 text-brand-300 border border-brand-500/30">
                      {rec.priority || 'High'} Priority
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Level: {rec.level || 'Intermediate'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    {rec.skill}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-400 block mb-0.5 text-[11px]">Why it is required:</span>
                    {rec.whyRequired}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Suggested Learning Topics:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {(rec.topics || []).map((t, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 italic">
                    Focus on completing hands-on projects for this skill to improve your ATS score.
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default RecommendationsPage;
