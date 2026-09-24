import React from 'react';

const ScoreGauge = ({ score = 0, size = 'lg', label = 'ATS Score' }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-emerald-500';
  let strokeColor = '#10b981';
  let badgeText = 'Excellent Match';

  if (score < 50) {
    colorClass = 'text-rose-500';
    strokeColor = '#f43f5e';
    badgeText = 'Needs Improvement';
  } else if (score < 75) {
    colorClass = 'text-amber-500';
    strokeColor = '#f59e0b';
    badgeText = 'Good Match';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="text-slate-800"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            strokeWidth="10"
            stroke={strokeColor}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${colorClass}`}>
            {score}
          </span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-700 bg-slate-800 ${colorClass}`}>
          {badgeText}
        </span>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default ScoreGauge;
