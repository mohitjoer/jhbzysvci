import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import {
  DashboardChartPoint,
  ErrorHistogramBin,
  ScatterPoint,
} from '../api';

interface ErrorChartsProps {
  chartData: DashboardChartPoint[];
  histogram: ErrorHistogramBin[];
  scatterData: ScatterPoint[];
}

export const ErrorCharts: React.FC<ErrorChartsProps> = ({
  chartData,
  histogram,
  scatterData,
}) => {
  const [activeView, setActiveView] = useState<'overTime' | 'histogram' | 'scatter'>('overTime');

  return (
    <div className="space-y-3.5">
      {/* View Switcher Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Error Visuals:</span>
          <button
            onClick={() => setActiveView('overTime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              activeView === 'overTime'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Error Over Time Chart
          </button>
          <button
            onClick={() => setActiveView('histogram')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              activeView === 'histogram'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Error Distribution Chart (Histogram)
          </button>
          <button
            onClick={() => setActiveView('scatter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              activeView === 'scatter'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Forecast vs Actual Scatter Plot (Optional)
          </button>
        </div>

        <span className="text-[11px] text-slate-500">
          Error = Forecast minus Actual (MW)
        </span>
      </div>

      {/* 1. Error Over Time Chart */}
      {activeView === 'overTime' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800">
              Error Over Time: (Forecast minus Actual for each slot, with zero line)
            </h4>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 font-medium text-amber-700">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>
                Positive Error (&gt;0 MW: Over-forecast / Shortfall risk)
              </span>
              <span className="flex items-center gap-1 font-medium text-blue-700">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span>
                Negative Error (&lt;0 MW: Under-forecast)
              </span>
            </div>
          </div>

          <div className="h-72 w-full bg-slate-50/50 rounded-xl p-3 border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 25, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="time_label"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={3}
                  tickLine={{ stroke: '#cbd5e1' }}
                  label={{ value: 'Slot Time (UK Time)', position: 'insideBottom', offset: -12, style: { fontSize: 11, fill: '#64748b' } }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(1)}k MW`}
                  tickLine={{ stroke: '#cbd5e1' }}
                  axisLine={false}
                  label={{ value: 'Error (MW)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
                />
                <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                  }}
                  formatter={(val: unknown) => {
                    const v = typeof val === 'number' ? val : 0;
                    return [`${Math.round(v).toLocaleString()} MW`, 'Forecast Error (FC - Act)'];
                  }}
                  labelFormatter={(label) => `Time Slot: ${label}`}
                />
                <Bar
                  dataKey="error_mw"
                  fill="#d97706"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 2. Error Distribution Chart (Histogram) */}
      {activeView === 'histogram' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800">
              Error Distribution Chart (Histogram): How often small and large errors happen
            </h4>
            <span className="text-[11px] text-slate-500">
              Shows frequency across error ranges
            </span>
          </div>

          <div className="h-72 w-full bg-slate-50/50 rounded-xl p-3 border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogram} margin={{ top: 10, right: 25, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="bin_label"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  label={{ value: 'Error Range (MW)', position: 'insideBottom', offset: -12, style: { fontSize: 11, fill: '#64748b' } }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  axisLine={false}
                  label={{ value: 'Frequency (Slots)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                  }}
                  formatter={(val: unknown) => {
                    const v = typeof val === 'number' ? val : 0;
                    return [`${v} settlement periods`, 'Frequency'];
                  }}
                  labelFormatter={(label) => `Range: ${label}`}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Forecast vs Actual Scatter Plot */}
      {activeView === 'scatter' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800">
              Forecast vs Actual Scatter Plot (Points close to the diagonal line mean good forecasts)
            </h4>
            <span className="text-[11px] text-slate-500">
              Diagonal reference = 100% accurate forecast
            </span>
          </div>

          <div className="h-72 w-full bg-slate-50/50 rounded-xl p-3 border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 25, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="forecast"
                  name="Forecast"
                  unit=" MW"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  label={{ value: 'Forecasted Wind (MW)', position: 'insideBottom', offset: -10, style: { fontSize: 11, fill: '#64748b' } }}
                />
                <YAxis
                  type="number"
                  dataKey="actual"
                  name="Actual"
                  unit=" MW"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  label={{ value: 'Actual Wind (MW)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Scatter name="Settlement Periods" data={scatterData} fill="#2563eb" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

