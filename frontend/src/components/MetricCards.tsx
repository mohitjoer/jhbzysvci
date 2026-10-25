import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardMetrics } from '../api';

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  return (
    <div className="space-y-4">
      {/* Section 2 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
              2
            </span>
            Section 2: How wrong are the forecasts?
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 ml-8">
            Requirement 2: Evaluate the accuracy of renewable generation forecasts quantitatively so decisions can consider quantified error.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 ml-8 sm:ml-0 self-start sm:self-auto">
          Periods evaluated: <strong>{metrics.count}</strong>
        </div>
      </div>

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* MAE */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              MAE
            </span>
            <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              Average Miss
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {metrics.mae.toLocaleString()} <span className="text-xs font-medium text-slate-500">MW</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Mean absolute error
          </span>
        </div>

        {/* Bias */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Bias
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                metrics.bias > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {metrics.bias_direction}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-1">
            {metrics.bias > 0 ? (
              <TrendingUp className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <TrendingDown className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <span>
              {metrics.bias > 0 ? `+${metrics.bias.toLocaleString()}` : metrics.bias.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">MW</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {metrics.bias > 0 ? 'Over-forecasts wind' : 'Under-forecasts wind'}
          </span>
        </div>

        {/* RMSE */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              RMSE
            </span>
            <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              Penalises Big Misses
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {metrics.rmse.toLocaleString()} <span className="text-xs font-medium text-slate-500">MW</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Root mean square error
          </span>
        </div>

        {/* P90 Error */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
              P90 Error
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
              90% Safety Margin
            </span>
          </div>
          <div className="text-2xl font-extrabold text-amber-950 mt-2">
            {metrics.p90_error.toLocaleString()} <span className="text-xs font-medium text-amber-700">MW</span>
          </div>
          <span className="text-[11px] text-amber-800 mt-1 block">
            Safety margin number
          </span>
        </div>

        {/* P95 Error */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
              P95 Error
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
              95% Safety Margin
            </span>
          </div>
          <div className="text-2xl font-extrabold text-amber-950 mt-2">
            {metrics.p95_error.toLocaleString()} <span className="text-xs font-medium text-amber-700">MW</span>
          </div>
          <span className="text-[11px] text-amber-800 mt-1 block">
            High-protection bound
          </span>
        </div>
      </div>
    </div>
  );
};

