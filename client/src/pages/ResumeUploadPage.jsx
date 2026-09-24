import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Loader2, 
  Sparkles, 
  FileCheck,
  Eye
} from 'lucide-react';

const ResumeUploadPage = () => {
  const [fileList, setFileList] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewResume, setPreviewResume] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await API.get('/resume');
      setResumes(res.data.data.resumes || []);
    } catch (err) {
      console.error('Failed to fetch resumes:', err.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError('');

    // Validation
    const validFiles = [];
    for (const f of selectedFiles) {
      const ext = f.name.split('.').pop().toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(ext)) {
        setError(`File ${f.name} format is not supported. Use PDF, DOC, or DOCX.`);
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setError(`File ${f.name} exceeds 10MB limit.`);
        return;
      }
      validFiles.push({
        file: f,
        filename: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
        status: 'Ready for processing'
      });
    }

    setFileList(validFiles);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      setError('Please select at least one PDF or DOCX file to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      if (fileList.length === 1) {
        formData.append('resume', fileList[0].file);
        await API.post('/resume/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Resume uploaded and structured JSON parsed successfully!');
      } else {
        fileList.forEach(item => {
          formData.append('resumes', item.file);
        });
        await API.post('/resume/bulk-upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage(`Successfully processed ${fileList.length} resumes!`);
      }

      setFileList([]);
      fetchResumes();
    } catch (err) {
      setError(err.message || 'Upload failed. File might be corrupted or empty.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume record?')) return;
    try {
      await API.delete(`/resume/${id}`);
      fetchResumes();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  };

  // Demo sample loader
  const handleLoadDemoResume = async () => {
    setUploading(true);
    setError('');
    try {
      const sampleText = `Alex Johnson
Email: alex.johnson@example.com | Phone: +1 (555) 234-5678 | San Francisco, CA
SUMMARY:
Senior Full Stack Developer with 5+ years of experience building web applications using React, Node.js, Express, TypeScript, SQL, and MongoDB.

SKILLS:
React, Node.js, Express, TypeScript, JavaScript, MongoDB, SQL, REST API, Git, HTML, CSS, Redux

EXPERIENCE:
Senior Software Engineer - TechCorp (2022-Present)
- Led frontend architecture migration to React and TypeScript.
- Built scalable Node.js REST APIs handling high volume user traffic.

EDUCATION:
B.S. in Computer Science - UC Berkeley (2019)`;

      const blob = new Blob([sampleText], { type: 'text/plain' });
      const demoFile = new File([blob], 'Alex_FullStack_Resume.pdf', { type: 'application/pdf' });

      const formData = new FormData();
      formData.append('resume', demoFile);

      await API.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Demo Resume loaded & parsed successfully!');
      fetchResumes();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
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
                  <FileText className="w-6 h-6 text-brand-400" />
                  Resume Management & Parsing
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Upload single or multiple PDF, DOC, and DOCX candidate resumes.
                </p>
              </div>

              <button
                onClick={handleLoadDemoResume}
                disabled={uploading}
                className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Load Sample Demo Resume
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
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

          {/* Upload Drop Zone */}
          <div className="bg-slate-900 border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-2xl p-8 text-center transition-all group">
            <input
              type="file"
              id="resumeInput"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="resumeInput" className="cursor-pointer space-y-3 block">
              <div className="w-16 h-16 rounded-2xl bg-brand-600/10 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/20 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Drop your resumes here, or <span className="text-brand-400 underline">browse</span>
              </h3>
              <p className="text-xs text-slate-400">
                Supports PDF, DOC, DOCX up to 10MB per file. Select multiple files for bulk analysis.
              </p>
            </label>
          </div>

          {/* Selected Files Ready for Processing */}
          {fileList.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white">Files Selected ({fileList.length})</h3>
              <div className="space-y-2">
                {fileList.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="font-semibold text-white">{f.filename}</p>
                        <span className="text-[11px] text-slate-400">{f.size} • {f.status}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">Ready</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setFileList([])}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/20 flex items-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Parsing & Extracting JSON...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Start Resume Extraction</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Parsed Resumes List Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Uploaded & Parsed Resumes ({resumes.length})</h3>

            {resumes.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No resumes uploaded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Candidate Name</th>
                      <th className="p-3">File Name</th>
                      <th className="p-3">Extracted Skills</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {resumes.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          {r.parsedData?.name || 'Candidate Name'}
                        </td>
                        <td className="p-3 text-slate-400">{r.originalName}</td>
                        <td className="p-3 max-w-[260px] truncate text-slate-300">
                          {(r.parsedData?.skills || []).join(', ') || 'No skills extracted'}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            Parsed & Structured
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => setPreviewResume(r)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                            title="Preview Extracted JSON"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded border border-slate-700"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Extracted Resume Preview Modal */}
          {previewResume && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] p-6 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">
                    Extracted Resume JSON: {previewResume.parsedData?.name || previewResume.originalName}
                  </h3>
                  <button onClick={() => setPreviewResume(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl text-xs text-brand-300 font-mono overflow-x-auto border border-slate-800">
                  {JSON.stringify(previewResume.parsedData, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
