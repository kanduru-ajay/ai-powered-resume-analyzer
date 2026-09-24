import React from 'react';
import { X, Check, AlertCircle, Award, Briefcase, FileText } from 'lucide-react';
import ScoreGauge from './ScoreGauge';

const CandidateCompareModal = ({ isOpen, onClose, candidates = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-400" />
              Side-by-Side Candidate Comparison
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing {candidates.length} candidate(s) based on objective ATS metrics and skill matching
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Comparison Table Grid */}
        <div className="flex-1 p-6 overflow-x-auto overflow-y-auto">
          {candidates.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Please select at least 2 candidates to compare.
            </div>
          ) : (
            <div className={`grid gap-6 ${candidates.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {candidates.map((item, idx) => {
                const c = item.analysis || item;
                const resume = item.resume || c.resume;
                const candidateName = resume?.parsedData?.name || resume?.originalName || item.candidateName || `Candidate ${idx + 1}`;

                return (
                  <div 
                    key={c._id || idx}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5 relative"
                  >
                    {/* Rank Ribbon */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-950 text-brand-300 border border-brand-500/30">
                      Rank #{idx + 1}
                    </div>

                    {/* Header Details */}
                    <div>
                      <h3 className="text-base font-bold text-white">{candidateName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {resume?.parsedData?.email || 'Candidate Record'}
                      </p>
                    </div>

                    {/* ATS Score Gauge */}
                    <div className="py-2 bg-slate-900/80 rounded-xl border border-slate-800/60 flex justify-center">
                      <ScoreGauge score={c.atsScore} size="sm" />
                    </div>

                    {/* Key Percentage Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Skill Match</span>
                        <span className="text-sm font-bold text-emerald-400">{c.skillMatchPercentage}%</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Experience</span>
                        <span className="text-sm font-bold text-brand-400">{c.experienceMatchPercentage}%</span>
                      </div>
                    </div>

                    {/* Matched Skills */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Matched Skills ({(c.matchedSkills || []).length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {(c.matchedSkills || []).map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded text-[11px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Required Skills */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 text-rose-400" />
                        Missing Skills ({(c.missingSkills || []).length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {(c.missingSkills || []).length === 0 ? (
                          <span className="text-xs text-slate-500 italic">No required skills missing</span>
                        ) : (
                          (c.missingSkills || []).map(skill => (
                            <span key={skill} className="px-2 py-0.5 rounded text-[11px] bg-rose-950/60 text-rose-300 border border-rose-500/20">
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Top Strengths */}
                    <div className="text-xs space-y-1">
                      <h4 className="font-semibold text-slate-300">Top Strengths:</h4>
                      <ul className="space-y-1 text-slate-400 text-[11px]">
                        {(c.strengths || []).slice(0, 2).map((st, i) => (
                          <li key={i}>• {st}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};

export default CandidateCompareModal;
