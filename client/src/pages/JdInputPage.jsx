import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  Briefcase, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  FileText 
} from 'lucide-react';

const JdInputPage = () => {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [company, setCompany] = useState('Tech Organization');
  const [rawText, setRawText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [jds, setJds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [previewJd, setPreviewJd] = useState(null);

  useEffect(() => {
    fetchJobDescriptions();
  }, []);

  const fetchJobDescriptions = async () => {
    try {
      const res = await API.get('/jd');
      setJds(res.data.data.jobDescriptions || []);
    } catch (err) {
      console.error('Failed to fetch JDs:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim() && !jdFile) {
      setError('Please paste Job Description text or upload a document file.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('jobTitle', jobTitle);
      formData.append('company', company);
      if (rawText.trim()) formData.append('rawText', rawText);
      if (jdFile) formData.append('jdDocument', jdFile);

      await API.post('/jd/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Job Description parsed and extracted into structured JSON!');
      setRawText('');
      setJdFile(null);
      fetchJobDescriptions();
    } catch (err) {
      setError(err.message || 'Failed to parse Job Description.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo JD loader
  const handleLoadDemoJd = () => {
    setJobTitle('Senior Full Stack Engineer');
    setCompany('InnovateAI');
    setRawText(`Job Title: Senior Full Stack Engineer
Required Skills: React, Node.js, Express, TypeScript, SQL, Docker, AWS, REST API
Preferred Skills: GraphQL, Kubernetes, Redis
Experience: 4+ years of full stack web development experience
Education: Bachelor's degree in Computer Science or STEM field
Responsibilities:
- Build modern, high-performance web user interfaces with React and Tailwind CSS.
- Architect resilient backend APIs in Node.js and Express.
- Containerize services with Docker and deploy to AWS cloud infrastructure.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-brand-400" />
                  Job Description Analyzer
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Paste JD text or upload a document to extract required skills and experience criteria.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadDemoJd}
                className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Load Sample Job Description
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="bg-rose-950/70 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. InnovateAI Systems"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Paste Job Description Text</label>
              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the complete job description text here (skills, requirements, responsibilities)..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-sans"
              />
            </div>

            <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Or upload JD document:</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setJdFile(e.target.files[0] || null)}
                  className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-slate-800 file:text-brand-300 file:text-xs hover:file:bg-slate-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing & Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Parse Job Description</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* History of Saved JDs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Parsed Job Descriptions ({jds.length})</h3>

            {jds.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No Job Descriptions analyzed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Job Title</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Required Skills</th>
                      <th className="p-3">Experience Needed</th>
                      <th className="p-3 text-right">Preview JSON</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {jds.map((j) => (
                      <tr key={j._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          {j.parsedData?.jobTitle || j.jobTitle}
                        </td>
                        <td className="p-3 text-slate-400">{j.company}</td>
                        <td className="p-3 max-w-[260px] truncate text-slate-300">
                          {(j.parsedData?.requiredSkills || []).join(', ') || 'Skills extracted'}
                        </td>
                        <td className="p-3 text-brand-400">{j.parsedData?.experience || '2+ years'}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setPreviewJd(j)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                            title="Preview Extracted JD JSON"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Preview Modal */}
          {previewJd && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] p-6 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">
                    Extracted JD JSON: {previewJd.parsedData?.jobTitle || previewJd.jobTitle}
                  </h3>
                  <button onClick={() => setPreviewJd(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl text-xs text-brand-300 font-mono overflow-x-auto border border-slate-800">
                  {JSON.stringify(previewJd.parsedData, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default JdInputPage;
