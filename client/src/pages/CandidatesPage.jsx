import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CandidateCompareModal from '../components/CandidateCompareModal';
import { Users, Search, Award, FileText, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidatesPage = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await API.get('/analysis/history');
      setHistory(res.data.data.history || []);
    } catch (err) {
      console.error('Failed to fetch candidates:', err.message);
    }
  };

  const filtered = history.filter(item => {
    const candidateName = item.resume?.parsedData?.name || item.resume?.originalName || '';
    const jobTitle = item.jobDescription?.parsedData?.jobTitle || item.jobDescription?.jobTitle || '';
    return candidateName.toLowerCase().includes(search.toLowerCase()) || jobTitle.toLowerCase().includes(search.toLowerCase());
  });

  const toggleSelect = (item) => {
    if (selectedForCompare.some(c => c._id === item._id)) {
      setSelectedForCompare(prev => prev.filter(c => c._id !== item._id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can select up to 3 candidates for comparison.');
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
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-brand-400" />
                Candidate Directory & Talent Pool
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                View all analyzed candidate profiles, scores, and side-by-side comparison matrices.
              </p>
            </div>

            {selectedForCompare.length >= 2 && (
              <button
                onClick={() => setCompareModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
              >
                <Award className="w-4 h-4" />
                Compare Selected ({selectedForCompare.length})
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidates by name, target role, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            {filtered.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No candidate records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3 w-10">Select</th>
                      <th className="p-3">Candidate Name</th>
                      <th className="p-3">Target Position</th>
                      <th className="p-3">ATS Score</th>
                      <th className="p-3">Skill Match</th>
                      <th className="p-3">Missing Skills</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filtered.map(item => {
                      const isSelected = selectedForCompare.some(c => c._id === item._id);
                      const name = item.resume?.parsedData?.name || item.resume?.originalName || 'Candidate';
                      return (
                        <tr key={item._id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-brand-950/40' : ''}`}>
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(item)}
                              className="rounded border-slate-700 bg-slate-800 text-brand-500 focus:ring-0"
                            />
                          </td>
                          <td className="p-3 font-semibold text-white">{name}</td>
                          <td className="p-3 text-slate-300">{item.jobDescription?.parsedData?.jobTitle || item.jobDescription?.jobTitle}</td>
                          <td className="p-3 font-bold text-emerald-400 text-sm">{item.atsScore} / 100</td>
                          <td className="p-3">{item.skillMatchPercentage}%</td>
                          <td className="p-3 text-rose-300 max-w-[200px] truncate">
                            {(item.missingSkills || []).join(', ') || 'None'}
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

export default CandidatesPage;
