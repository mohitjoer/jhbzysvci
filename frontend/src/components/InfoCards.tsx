import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { DashboardSummary } from '../api';

interface InfoCardsProps {
  decisionTimeFormatted: string;
  publishTimeFormatted: string;
  summary: DashboardSummary;
  showActuals: boolean;
}

export const InfoCards: React.FC<InfoCardsProps> = ({
  decisionTimeFormatted,
  publishTimeFormatted,
  summary,
  showActuals,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
      {/* Decision Time Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          Decision Made On
        </span>
        <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{decisionTimeFormatted}</span>
        </div>
        <span className="text-[11px] text-slate-500 mt-0.5 block">
          Day-Ahead Cutoff
        </span>
      </div>

      {/* Latest Publish Used Card */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
        <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">
          Latest Forecast Used
        </span>
        <div className="text-sm font-bold text-blue-900 mt-1 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Published: {publishTimeFormatted}</span>
        </div>
        <span className="text-[11px] text-blue-700 mt-0.5 block">
          Newest before cutoff
        </span>
      </div>

      {/* Average Forecast Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          Average Forecast
        </span>
        <div className="text-xl font-bold text-slate-900 mt-1">
          {summary.avg_forecast_mw.toLocaleString()} <span className="text-xs font-medium text-slate-500">MW</span>
        </div>
        {showActuals && (
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
            Actual: {summary.avg_actual_mw.toLocaleString()} MW
          </span>
        )}
      </div>

      {/* Peak Forecast Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          Peak Forecast
        </span>
        <div className="text-xl font-bold text-slate-900 mt-1">
          {summary.peak_forecast_mw.toLocaleString()} <span className="text-xs font-medium text-slate-500">MW</span>
        </div>
        <span className="text-[11px] text-slate-500 mt-0.5 block">
          Daily Maximum
        </span>
      </div>

      {/* Lowest Forecast Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          Lowest Forecast
        </span>
        <div className="text-xl font-bold text-slate-900 mt-1">
          {summary.lowest_forecast_mw.toLocaleString()} <span className="text-xs font-medium text-slate-500">MW</span>
        </div>
        <span className="text-[11px] text-slate-500 mt-0.5 block">
          Daily Minimum
        </span>
      </div>
    </div>
  );
};

