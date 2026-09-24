import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScoreGauge from '../components/ScoreGauge';
import { useChat } from '../context/ChatContext';
import { 
  FileText, 
  Briefcase, 
  Zap, 
  Bot, 
  Upload, 
  Layers, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen,
  ArrowRight,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const CandidateDashboard = () => {
  const { openChat, setActiveAnalysis } = useChat();
  const [history, setHistory] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [jds, setJds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [histRes, resRes, jdRes] = await Promise.all([
        API.get('/analysis/history'),
        API.get('/resume'),
        API.get('/jd')
      ]);

      setHistory(histRes.data.data.history || []);
      setResumes(resRes.data.data.resumes || []);
      setJds(jdRes.data.data.jobDescriptions || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Compute Metrics
  const totalAnalyzed = history.length;
  const avgScore = totalAnalyzed > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.atsScore, 0) / totalAnalyzed)
    : 0;
  const bestScore = totalAnalyzed > 0 
    ? Math.max(...history.map(h => h.atsScore))
    : 0;
  
  const totalMissingSkills = history.length > 0
    ? [...new Set(history.flatMap(h => h.missingSkills || []))].length
    : 0;

  // Recharts score distribution data
  const scoreData = history.slice(0, 6).map((item, i) => ({
    name: item.jobDescription?.parsedData?.jobTitle?.substring(0, 12) || `Analysis ${i + 1}`,
    score: item.atsScore,
    skillMatch: item.skillMatchPercentage
  }));

  const latestAnalysis = history[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Candidate Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">
                Track ATS performance, manage resumes, and analyze job compatibility.
              </p>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/upload"
                className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Resume
              </Link>
              <Link
                to="/jd"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                Upload JD
              </Link>
              <Link
                to="/analyze"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Analyze Resume
              </Link>
              <button
                onClick={openChat}
                className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                Open AI Assistant
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Resumes Analyzed</p>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{totalAnalyzed}</h3>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Average ATS Score</p>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{avgScore} <span className="text-xs font-normal text-slate-500">/ 100</span></h3>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Best ATS Score</p>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{bestScore} <span className="text-xs font-normal text-slate-500">/ 100</span></h3>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Missing Skills Count</p>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{totalMissingSkills}</h3>
              </div>
            </div>
          </div>

          {/* Charts & Latest Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ATS Score Chart */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-brand-400" />
                  Recent ATS Analysis Scores
                </h3>
                <span className="text-xs text-slate-400">Score history timeline</span>
              </div>

              {scoreData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-600 mb-2" />
                  <p>No analysis history yet.</p>
                  <Link to="/analyze" className="mt-2 text-brand-400 font-semibold hover:underline">
                    Run your first ATS analysis
                  </Link>
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {scoreData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.score >= 75 ? '#10b981' : entry.score >= 50 ? '#f59e0b' : '#f43f5e'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Latest Analysis Gauge Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Latest Analysis Status</h3>
                {latestAnalysis ? (
                  <div className="space-y-4">
                    <ScoreGauge score={latestAnalysis.atsScore} size="md" label="Latest ATS Score" />

                    <div className="text-xs space-y-2 border-t border-slate-800 pt-3">
                      <div className="flex justify-between text-slate-300">
                        <span>Matched Skills:</span>
                        <span className="font-bold text-emerald-400">{(latestAnalysis.matchedSkills || []).length}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Missing Required:</span>
                        <span className="font-bold text-rose-400">{(latestAnalysis.missingSkills || []).length}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveAnalysis(latestAnalysis);
                        openChat();
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Bot className="w-4 h-4 text-brand-400" />
                      Ask AI About This Result
                    </button>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No recent analysis available.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Recent History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Recent Analyses</h3>
              <Link to="/history" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                View All History <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No analysis records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Job Title</th>
                      <th className="p-3">ATS Score</th>
                      <th className="p-3">Skill Match</th>
                      <th className="p-3">Missing Skills</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {history.slice(0, 5).map((item) => (
                      <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          {item.jobDescription?.parsedData?.jobTitle || item.jobDescription?.jobTitle || 'Target Role'}
                        </td>
                        <td className="p-3 font-bold text-emerald-400">{item.atsScore}/100</td>
                        <td className="p-3">{item.skillMatchPercentage}%</td>
                        <td className="p-3 text-rose-300 max-w-[200px] truncate">
                          {(item.missingSkills || []).join(', ') || 'None'}
                        </td>
                        <td className="p-3 text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            to={`/analysis/${item._id}`}
                            className="px-2.5 py-1 bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 rounded border border-brand-500/30 text-[11px] font-semibold"
                          >
                            View Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;
