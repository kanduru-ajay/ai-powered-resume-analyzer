import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const SkillBadge = ({ name, type = 'matched' }) => {
  if (type === 'matched') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        {name}
      </span>
    );
  }

  if (type === 'missing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-rose-950/60 border border-rose-500/30 text-rose-300">
        <X className="w-3.5 h-3.5 text-rose-400" />
        {name}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-amber-950/60 border border-amber-500/30 text-amber-300">
      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
      {name}
    </span>
  );
};

export default SkillBadge;
