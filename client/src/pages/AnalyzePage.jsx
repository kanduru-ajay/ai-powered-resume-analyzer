import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useChat } from '../context/ChatContext';
import { 
  Zap, 
  FileText, 
  Briefcase, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  Plus
} from 'lucide-react';

const AnalyzePage = () => {
  const navigate = useNavigate();
  const { setActiveAnalysis } = useChat();

  const [resumes, setResumes] = useState([]);
  const [jds, setJds] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedJdId, setSelectedJdId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [resRes, jdRes] = await Promise.all([
        API.get('/resume'),
        API.get('/jd')
      ]);

      const resList = resRes.data.data.resumes || [];
      const jdList = jdRes.data.data.jobDescriptions || [];

      setResumes(resList);
      setJds(jdList);

      if (resList.length > 0) setSelectedResumeId(resList[0]._id);
      if (jdList.length > 0) setSelectedJdId(jdList[0]._id);
    } catch (err) {
      console.error('Failed to load selection options:', err.message);
    }
  };

  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!selectedResumeId || !selectedJdId) {
      setError('Please select both a Resume and a Job Description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/analysis/single', {
        resumeId: selectedResumeId,
        jdId: selectedJdId
      });

      const analysis = res.data.data.analysis;
      setActiveAnalysis(analysis);

      navigate(`/analysis/${analysis._id}`);
    } catch (err) {
      setError(err.message || 'Analysis calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto space-y-8 overflow-x-hidden">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              ATS Scoring & Resume Analysis Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select an uploaded resume and a Job Description to compute exact ATS match metrics.
            </p>
          </div>

          {error && (
            <div className="bg-rose-950/70 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStartAnalysis} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Select Resume Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-400" />
                    1. Select Resume
                  </h3>
                  <Link to="/upload" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Upload New
                  </Link>
                </div>

                {resumes.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No resumes found. Please upload a resume first.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resumes.map((r) => (
                      <label
                        key={r._id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all text-xs ${
                          selectedResumeId === r._id
                            ? 'bg-brand-950/60 border-brand-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="resumeRadio"
                            value={r._id}
                            checked={selectedResumeId === r._id}
                            onChange={() => setSelectedResumeId(r._id)}
                            className="text-brand-500 focus:ring-0"
                          />
                          <div>
                            <p className="font-semibold">{r.parsedData?.name || r.originalName}</p>
                            <span className="text-[11px] text-slate-400">
                              {(r.parsedData?.skills || []).slice(0, 4).join(', ') || 'Extracted Skills'}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Select Job Description Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-400" />
                    2. Select Job Description
                  </h3>
                  <Link to="/jd" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add New JD
                  </Link>
                </div>

                {jds.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No Job Descriptions found. Please add a JD first.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {jds.map((j) => (
                      <label
                        key={j._id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all text-xs ${
                          selectedJdId === j._id
                            ? 'bg-brand-950/60 border-brand-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="jdRadio"
                            value={j._id}
                            checked={selectedJdId === j._id}
                            onChange={() => setSelectedJdId(j._id)}
                            className="text-brand-500 focus:ring-0"
                          />
                          <div>
                            <p className="font-semibold">{j.parsedData?.jobTitle || j.jobTitle}</p>
                            <span className="text-[11px] text-slate-400">
                              Company: {j.company} • Exp: {j.parsedData?.experience || '2+ yrs'}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Launch Analysis Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading || !selectedResumeId || !selectedJdId}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Calculating ATS Score & Skill Gaps...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Run Full ATS Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </main>
      </div>
    </div>
  );
};

export default AnalyzePage;
