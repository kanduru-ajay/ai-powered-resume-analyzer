import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScoreGauge from '../components/ScoreGauge';
import SkillBadge from '../components/SkillBadge';
import { useChat } from '../context/ChatContext';
import { 
  Download, 
  Bot, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Award, 
  BookOpen, 
  Sparkles, 
  ArrowLeft,
  FileText,
  Briefcase
} from 'lucide-react';

const AnalysisResultPage = () => {
  const { id } = useParams();
  const { openChat, setActiveAnalysis } = useChat();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysisDetail();
  }, [id]);

  const fetchAnalysisDetail = async () => {
    try {
      const res = await API.get(`/analysis/${id}`);
      const data = res.data.data.analysis;
      setAnalysis(data);
      setActiveAnalysis(data);
    } catch (err) {
      setError(err.message || 'Could not load analysis details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const res = await API.get(`/analysis/${id}/report`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ResumeAI_Report_${id}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Download report failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading ATS Analysis Results...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 p-8 max-w-xl mx-auto text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">Analysis Not Found</h2>
          <p className="text-xs text-slate-400">{error || 'The requested analysis record does not exist.'}</p>
          <Link to="/dashboard" className="inline-block px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const candidateName = analysis.resume?.parsedData?.name || analysis.resume?.originalName || 'Candidate';
  const jobTitle = analysis.jobDescription?.parsedData?.jobTitle || analysis.jobDescription?.jobTitle || 'Target Position';
  const company = analysis.jobDescription?.company || 'Target Organization';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="space-y-1">
              <Link to="/dashboard" className="text-xs text-brand-400 hover:underline flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-2xl font-extrabold text-white">{candidateName} vs {jobTitle}</h1>
              <p className="text-xs text-slate-400">
                Company: <span className="text-slate-200">{company}</span> • Analyzed: {new Date(analysis.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button
                onClick={() => {
                  setActiveAnalysis(analysis);
                  openChat();
                }}
                className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                Ask Assistant About Score
              </button>
            </div>
          </div>

          {/* Top Score Showcase & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ATS Score Gauge Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall ATS Score</h3>
              <ScoreGauge score={analysis.atsScore} size="lg" />
              <p className="text-xs text-slate-400 max-w-xs">
                Calculated deterministically using weighted criteria: Skills 30%, Exp 20%, Tech 15%, Keywords 15%, Responsibilities 10%, Education 10%.
              </p>
            </div>

            {/* Percentage Progress Breakdown */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-400" />
                Alignment Category Breakdown
              </h3>

              <div className="space-y-3.5 text-xs">
                
                {/* Skill Match */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-300">Skill Match ({analysis.skillMatchPercentage}%)</span>
                    <span className="text-emerald-400">{analysis.matchedSkills?.length} / {(analysis.matchedSkills?.length || 0) + (analysis.missingSkills?.length || 0)} Skills</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${analysis.skillMatchPercentage}%` }} />
                  </div>
                </div>

                {/* Keyword Match */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-300">Keyword Alignment ({analysis.keywordMatchPercentage}%)</span>
                    <span className="text-brand-400">{analysis.matchedKeywords?.length} Keywords Matched</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 transition-all duration-700" style={{ width: `${analysis.keywordMatchPercentage}%` }} />
                  </div>
                </div>

                {/* Experience Match */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-300">Experience Match ({analysis.experienceMatchPercentage}%)</span>
                    <span className="text-indigo-400">Target Work History</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${analysis.experienceMatchPercentage}%` }} />
                  </div>
                </div>

                {/* Technology Match */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-300">Technology Stack ({analysis.technologyMatchPercentage}%)</span>
                    <span className="text-purple-400">Tech Tools</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all duration-700" style={{ width: `${analysis.technologyMatchPercentage}%` }} />
                  </div>
                </div>

                {/* Education Match */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-300">Education & Certifications ({analysis.educationMatchPercentage}%)</span>
                    <span className="text-amber-400">Degree & Certs</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${analysis.educationMatchPercentage}%` }} />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Section A, B, C: Matched vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Matched Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Matched Skills ({(analysis.matchedSkills || []).length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(analysis.matchedSkills || []).map(skill => (
                  <SkillBadge key={skill} name={skill} type="matched" />
                ))}
              </div>
            </div>

            {/* Missing Required Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-400" />
                Missing Required Skills ({(analysis.missingSkills || []).length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(analysis.missingSkills || []).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No required skills missing!</p>
                ) : (
                  (analysis.missingSkills || []).map(skill => (
                    <SkillBadge key={skill} name={skill} type="missing" />
                  ))
                )}
              </div>
            </div>

            {/* Preferred Skills Missing */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Missing Preferred Skills ({(analysis.preferredSkillsMissing || []).length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(analysis.preferredSkillsMissing || []).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No preferred skills missing.</p>
                ) : (
                  (analysis.preferredSkillsMissing || []).map(skill => (
                    <SkillBadge key={skill} name={skill} type="preferred" />
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Section D, E: Keywords Match */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Keyword Alignment Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <p className="font-semibold text-emerald-400 mb-2">✓ Matched Job Keywords:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.matchedKeywords || []).map(kw => (
                    <span key={kw} className="px-2.5 py-1 rounded bg-slate-950 text-emerald-300 border border-slate-800">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-rose-400 mb-2">✗ Missing Keywords (Feature in Summary/Bullet Points):</p>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.missingKeywords || []).map(kw => (
                    <span key={kw} className="px-2.5 py-1 rounded bg-slate-950 text-rose-300 border border-slate-800">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section F, G: Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Key Candidate Strengths
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {(analysis.strengths || []).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                Identified Weaknesses & Risk Areas
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {(analysis.weaknesses || []).map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section H: Resume Improvement Suggestions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Actionable Resume Improvement Suggestions
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              {(analysis.suggestions || []).map((sugg, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{sugg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section I: Recommended Courses / Topics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" />
              Recommended Learning Roadmap (Course & Topic Recommendations)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(analysis.recommendedLearning || []).map((rec, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-brand-300 text-sm">{rec.skill}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-950 text-brand-300 border border-brand-500/30">
                      {rec.priority || 'High'} Priority
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{rec.whyRequired}</p>
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 block font-semibold mb-1">Topics to Learn:</span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {(rec.topics || []).map((t, idx) => (
                        <li key={idx}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section J: Qualitative AI Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Overall Qualitative Alignment Analysis</h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p><strong>Work Experience Evaluation:</strong> {analysis.experienceAnalysis}</p>
              <p className="pt-2 border-t border-slate-900"><strong>Education Evaluation:</strong> {analysis.educationAnalysis}</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AnalysisResultPage;
