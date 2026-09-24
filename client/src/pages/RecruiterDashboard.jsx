import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScoreGauge from '../components/ScoreGauge';
import CandidateCompareModal from '../components/CandidateCompareModal';
import { 
  Users, 
  Award, 
  Layers, 
  Briefcase, 
  BarChart2, 
  TrendingUp, 
  Upload, 
  Plus,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  X
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

const RecruiterDashboard = () => {
  const [history, setHistory] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [jds, setJds] = useState([]);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
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
      console.error('Failed to load recruiter dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalCandidates = resumes.length || history.length;
  const avgScore = history.length > 0 
    ? Math.round(history.reduce((a, b) => a + b.atsScore, 0) / history.length) 
    : 0;
  const highestScore = history.length > 0 
    ? Math.max(...history.map(h => h.atsScore)) 
    : 0;

  // Compute common missing skills frequency
  const missingMap = {};
  history.forEach(h => {
    (h.missingSkills || []).forEach(sk => {
      missingMap[sk] = (missingMap[sk] || 0) + 1;
    });
  });

  const missingChartData = Object.keys(missingMap).map(sk => ({
    skill: sk,
    count: missingMap[sk]
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const toggleSelectCandidate = (item) => {
    if (selectedForCompare.some(c => c._id === item._id)) {
      setSelectedForCompare(prev => prev.filter(c => c._id !== item._id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can select up to 3 candidates for side-by-side comparison.');
        return;
      }
      setSelectedForCompare(prev => [...prev, item]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase tracking-wider mb-2">
                Recruiter & Admin Portal
              </div>
              <h1 className="text-2xl font-extrabold text-white">Candidate Evaluation Hub</h1>
              <p className="text-xs text-slate-400 mt-1">
                Batch candidate analysis, ranking based on ATS scores, and skill gap discovery.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/bulk"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-brand-600/20 flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                Bulk Resume Analysis
              </Link>
              <Link
                to="/upload"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-brand-400" />
                Upload Resumes
              </Link>
              {selectedForCompare.length >= 2 && (
                <button
                  onClick={() => setCompareModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all animate-bounce"
                >
                  <Award className="w-3.5 h-3.5" />
                  Compare Selected ({selectedForCompare.length})
                </button>
              )}
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Candidates</p>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{totalCandidates}</h3>
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
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Highest Match Score</p>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{highestScore} <span className="text-xs font-normal text-slate-500">/ 100</span></h3>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Common Skill Gaps</p>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{missingChartData.length}</h3>
              </div>
            </div>
          </div>

          {/* Missing Skills Frequency Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-rose-400" />
              Top Missing Skills Frequency across Candidates
            </h3>

            {missingChartData.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No skill gap frequency data available yet.
              </div>
            ) : (
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={missingChartData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="skill" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="#f43f5e" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Candidates Table with Selection for Comparison */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white">Candidate Rankings & ATS Scores</h3>
                <p className="text-xs text-slate-400">Select checkboxes to compare candidates side-by-side</p>
              </div>

              {selectedForCompare.length > 0 && (
                <button
                  onClick={() => setCompareModalOpen(true)}
                  disabled={selectedForCompare.length < 2}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                >
                  Compare ({selectedForCompare.length})
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No candidate analyses generated yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3 w-10">Select</th>
                      <th className="p-3">Candidate Name</th>
                      <th className="p-3">Target Role</th>
                      <th className="p-3">ATS Score</th>
                      <th className="p-3">Skill Match</th>
                      <th className="p-3">Experience</th>
                      <th className="p-3">Missing Skills</th>
                      <th className="p-3 text-right">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {history.map((item) => {
                      const isSelected = selectedForCompare.some(c => c._id === item._id);
                      const candidateName = item.resume?.parsedData?.name || item.resume?.originalName || 'Candidate';

                      return (
                        <tr key={item._id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-brand-950/40' : ''}`}>
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectCandidate(item)}
                              className="rounded border-slate-700 bg-slate-800 text-brand-500 focus:ring-0"
                            />
                          </td>
                          <td className="p-3 font-semibold text-white">{candidateName}</td>
                          <td className="p-3">{item.jobDescription?.parsedData?.jobTitle || item.jobDescription?.jobTitle}</td>
                          <td className="p-3 font-bold text-emerald-400">{item.atsScore}/100</td>
                          <td className="p-3">{item.skillMatchPercentage}%</td>
                          <td className="p-3">{item.experienceMatchPercentage}%</td>
                          <td className="p-3 text-rose-300 max-w-[180px] truncate">
                            {(item.missingSkills || []).join(', ') || 'None'}
                          </td>
                          <td className="p-3 text-right">
                            <Link
                              to={`/analysis/${item._id}`}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-semibold"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      <CandidateCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        candidates={selectedForCompare}
      />
    </div>
  );
};

export default RecruiterDashboard;
