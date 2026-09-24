import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { History, FileText, ArrowRight } from 'lucide-react';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/analysis/history');
      setHistory(res.data.data.history || []);
    } catch (err) {
      console.error('Failed to load history:', err.message);
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
              <History className="w-6 h-6 text-brand-400" />
              Analysis History & Past Scores
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Complete history of all calculated ATS scores and qualitative resume evaluations.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No analysis history recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Target Role</th>
                      <th className="p-3">Candidate Resume</th>
                      <th className="p-3">ATS Score</th>
                      <th className="p-3">Skill Match</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {history.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          {item.jobDescription?.parsedData?.jobTitle || item.jobDescription?.jobTitle}
                        </td>
                        <td className="p-3 text-slate-400">{item.resume?.originalName || 'Resume'}</td>
                        <td className="p-3 font-bold text-emerald-400 text-sm">{item.atsScore} / 100</td>
                        <td className="p-3">{item.skillMatchPercentage}%</td>
                        <td className="p-3 text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
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

export default HistoryPage;
