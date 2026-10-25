import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { BufferRecommendation } from '../api';

interface BufferRecommendationBoxProps {
  recommendation: BufferRecommendation;
}

export const BufferRecommendationBox: React.FC<BufferRecommendationBoxProps> = ({
  recommendation,
}) => {
  return (
    <div className="bg-amber-50/80 border-2 border-amber-400 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 text-white rounded-md shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Buffer Recommendation Box • Actionable Procurement Advice
            </span>
          </div>

          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            "{recommendation.advice_text}"
          </p>

          <p className="text-xs text-slate-600 leading-relaxed">
            {recommendation.rationale}
          </p>
        </div>

        <div className="shrink-0 bg-white border border-amber-300 rounded-lg p-3 text-center shadow-xs">
          <span className="text-[10px] font-bold text-amber-800 uppercase block">
            Recommended Reserve Buffer
          </span>
          <span className="text-2xl font-black text-amber-950">
            +{recommendation.recommended_mw.toLocaleString()} MW
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            90% coverage safety margin
          </span>
        </div>
      </div>
    </div>
  );
};

