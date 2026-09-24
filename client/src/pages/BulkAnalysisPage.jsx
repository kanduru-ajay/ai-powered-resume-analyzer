import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CandidateCompareModal from '../components/CandidateCompareModal';
import { 
  Layers, 
  Briefcase, 
  FileText, 
  Check, 
  Loader2, 
  AlertCircle, 
  Award, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

const BulkAnalysisPage = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [jds, setJds] = useState([]);
  const [selectedResumeIds, setSelectedResumeIds] = useState([]);
  const [selectedJdId, setSelectedJdId] = useState('');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('atsScore'); // atsScore, skillMatch, experienceMatch, name

  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

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

      if (resList.length > 0) setSelectedResumeIds(resList.map(r => r._id));
      if (jdList.length > 0) setSelectedJdId(jdList[0]._id);
    } catch (err) {
      console.error('Failed to load bulk options:', err.message);
    }
  };

  const toggleSelectResume = (id) => {
    if (selectedResumeIds.includes(id)) {
      setSelectedResumeIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedResumeIds(prev => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedResumeIds.length === resumes.length) {
      setSelectedResumeIds([]);
    } else {
      setSelectedResumeIds(resumes.map(r => r._id));
    }
  };

  const handleRunBulkAnalysis = async (e) => {
    e.preventDefault();
    if (selectedResumeIds.length === 0 || !selectedJdId) {
      setError('Please select at least 1 resume and 1 Job Description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/analysis/bulk-analyze', {
        resumeIds: selectedResumeIds,
        jdId: selectedJdId
      });

      setResults(res.data.data);
    } catch (err) {
      setError(err.message || 'Bulk analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  // Sorting
  const sortedCandidates = (results?.candidates || []).slice().sort((a, b) => {
    if (sortBy === 'atsScore') return b.analysis.atsScore - a.analysis.atsScore;
    if (sortBy === 'skillMatch') return b.analysis.skillMatchPercentage - a.analysis.skillMatchPercentage;
    if (sortBy === 'experienceMatch') return b.analysis.experienceMatchPercentage - a.analysis.experienceMatchPercentage;
    if (sortBy === 'name') return a.candidateName.localeCompare(b.candidateName);
    return 0;
  });

  const toggleCompareSelect = (item) => {
    if (selectedForCompare.some(c => c.analysis._id === item.analysis._id)) {
      setSelectedForCompare(prev => prev.filter(c => c.analysis._id !== item.analysis._id));
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
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-brand-400" />
              Multiple Resume Bulk Analysis Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Recruiters: Analyze multiple candidate resumes simultaneously against a single target Job Description.
            </p>
          </div>

          {error && (
            <div className="bg-rose-950/70 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRunBulkAnalysis} className="space-y-6">
            
            {/* Target JD Selection */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-400" />
                Select Target Job Description
              </h3>

              {jds.length === 0 ? (
                <p className="text-xs text-slate-500">No Job Descriptions found. Add a JD first.</p>
              ) : (
                <select
                  value={selectedJdId}
                  onChange={(e) => setSelectedJdId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  {jds.map(j => (
                    <option key={j._id} value={j._id}>
                      {j.parsedData?.jobTitle || j.jobTitle} ({j.company})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Resumes Checkbox Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-400" />
                  Select Resumes to Batch Analyze ({selectedResumeIds.length} / {resumes.length})
                </h3>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-brand-400 hover:underline font-semibold"
                >
                  {selectedResumeIds.length === resumes.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {resumes.length === 0 ? (
                <p className="text-xs text-slate-500">No resumes uploaded. Please upload candidate resumes first.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-2">
                  {resumes.map(r => {
                    const isChecked = selectedResumeIds.includes(r._id);
                    return (
                      <label
                        key={r._id}
                        className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center gap-3 ${
                          isChecked
                            ? 'bg-brand-950/60 border-brand-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectResume(r._id)}
                          className="rounded border-slate-700 bg-slate-800 text-brand-500 focus:ring-0"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-white truncate">{r.parsedData?.name || r.originalName}</p>
                          <span className="text-[11px] text-slate-400">{r.originalName}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || selectedResumeIds.length === 0 || !selectedJdId}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Bulk Resumes...</span>
                </>
              ) : (
                <>
                  <Layers className="w-5 h-5" />
                  <span>Start Bulk Candidate Analysis</span>
                </>
              )}
            </button>
          </form>

          {/* Bulk Analysis Results Comparison Table */}
          {results && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Candidate Comparison Matrix ({results.totalCandidates} Candidates)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Job: {results.jobTitle}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none"
                    >
                      <option value="atsScore">ATS Score (Highest)</option>
                      <option value="skillMatch">Skill Match %</option>
                      <option value="experienceMatch">Experience Match %</option>
                      <option value="name">Candidate Name</option>
                    </select>
                  </div>

                  {selectedForCompare.length >= 2 && (
                    <button
                      onClick={() => setCompareModalOpen(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md"
                    >
                      Side-by-Side Compare ({selectedForCompare.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3 w-10">Compare</th>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">ATS Score</th>
                      <th className="p-3">Skill Match</th>
                      <th className="p-3">Experience Match</th>
                      <th className="p-3">Missing Skills</th>
                      <th className="p-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sortedCandidates.map((c, i) => {
                      const isCompareSelected = selectedForCompare.some(item => item.analysis._id === c.analysis._id);
                      return (
                        <tr key={c.analysis._id || i} className={`hover:bg-slate-800/40 transition-colors ${isCompareSelected ? 'bg-brand-950/40' : ''}`}>
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={isCompareSelected}
                              onChange={() => toggleCompareSelect(c)}
                              className="rounded border-slate-700 bg-slate-800 text-brand-500 focus:ring-0"
                            />
                          </td>
                          <td className="p-3 font-bold text-slate-400">#{i + 1}</td>
                          <td className="p-3 font-semibold text-white">{c.candidateName}</td>
                          <td className="p-3 font-bold text-emerald-400 text-sm">{c.analysis.atsScore} / 100</td>
                          <td className="p-3 font-semibold">{c.analysis.skillMatchPercentage}%</td>
                          <td className="p-3 font-semibold">{c.analysis.experienceMatchPercentage}%</td>
                          <td className="p-3 text-rose-300 max-w-[200px] truncate">
                            {(c.analysis.missingSkills || []).join(', ') || 'None!'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => navigate(`/analysis/${c.analysis._id}`)}
                              className="px-2.5 py-1 bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 rounded border border-brand-500/30 font-semibold text-[11px]"
                            >
                              View Full Report
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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

export default BulkAnalysisPage;
