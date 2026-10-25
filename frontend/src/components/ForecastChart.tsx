import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DashboardChartPoint, DataGapsInfo } from '../api';

interface ForecastChartProps {
  chartData: DashboardChartPoint[];
  mode: 'day' | 'month';
  deliveryDate: string;
  showActuals: boolean;
  onToggleActuals: (show: boolean) => void;
  dataGaps: DataGapsInfo;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  chartData,
  mode,
  deliveryDate,
  showActuals,
  onToggleActuals,
  dataGaps,
}) => {
  return (
    <div className="space-y-4">
      {/* Section 1 Header & Line 2 Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              1
            </span>
            Section 1: What forecast do I have when I decide?
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 ml-8">
            Requirement 1: Understand the latest renewable generation forecasts available when making day-ahead wholesale purchase decisions.
          </p>
        </div>

        {/* Optional Toggle for Line 2 (Actual Wind Generation) */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors ml-8 sm:ml-0 self-start sm:self-auto">
          <input
            type="checkbox"
            checked={showActuals}
            onChange={(e) => onToggleActuals(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
          />
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            Show Actual Wind Generation (Line 2 Toggle)
          </span>
        </label>
      </div>

      {/* Data Gap Warnings: Clear note instead of hiding */}
      {dataGaps.has_gaps ? (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Data Gap Warning:</strong> {dataGaps.message}
            {dataGaps.missing_forecast_slots.length > 0 && (
              <span className="block mt-0.5 text-amber-800">
                Affected forecast half-hours: {dataGaps.missing_forecast_slots.join(', ')}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="px-3.5 py-2 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              <strong>Data Quality:</strong> {dataGaps.message} National-level Elexon WINDFOR and FUELHH streams.
            </span>
          </div>
          <span className="font-semibold text-emerald-700">All 48 Settlement Periods Present</span>
        </div>
      )}

      {/* Main Line Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {mode === 'month'
              ? 'January 2026 Average Generation Profile (48 Half-Hour Settlement Periods)'
              : `Generation Profile: ${deliveryDate} (48 Half-Hour Settlement Periods)`}
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-blue-700">
              <span className="w-3.5 h-0.5 bg-blue-600 inline-block"></span>
              Line 1: Forecast available at decision time
            </span>
            {showActuals && (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <span className="w-3.5 h-0.5 bg-emerald-600 inline-block"></span>
                Line 2: Actual wind generation
              </span>
            )}
          </div>
        </div>

        <div className="h-80 w-full bg-slate-50/50 rounded-xl p-3 border border-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 25, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="time_label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval={3}
                tickLine={{ stroke: '#cbd5e1' }}
                label={{ value: '48 Half-Hour Slots (UK Time / GMT)', position: 'insideBottom', offset: -12, style: { fontSize: 11, fill: '#64748b' } }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k MW`}
                tickLine={{ stroke: '#cbd5e1' }}
                axisLine={false}
                label={{ value: 'Wind Power (MW)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
                formatter={(val: unknown, name: unknown) => {
                  const v = typeof val === 'number' ? val : 0;
                  const n = String(name || '');
                  if (n === 'forecast_mw') return [`${Math.round(v).toLocaleString()} MW`, 'Forecast Available'];
                  if (n === 'actual_mw') return [`${Math.round(v).toLocaleString()} MW`, 'Actual Generation'];
                  return [v, n];
                }}
                labelFormatter={(label) => `Slot Time: ${label} UK Time`}
              />
              <Line
                type="monotone"
                dataKey="forecast_mw"
                name="forecast_mw"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#2563eb' }}
              />
              {showActuals && (
                <Line
                  type="monotone"
                  dataKey="actual_mw"
                  name="actual_mw"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#059669' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

