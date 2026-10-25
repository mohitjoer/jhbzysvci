import React, { useState } from 'react';
import { DashboardChartPoint } from '../api';

interface DetailsTableProps {
  chartData: DashboardChartPoint[];
}

export const DetailsTable: React.FC<DetailsTableProps> = ({ chartData }) => {
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tableExpanded, setTableExpanded] = useState<boolean>(false);

  const displayedData = tableExpanded ? chartData : chartData.slice(0, 10);
  const filteredData = displayedData.filter((p) =>
    tableSearch ? p.time_label.includes(tableSearch) : true
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Details Table: Slot Time, Forecast MW, Publish Time Used, Actual MW, Error
          </h3>
          <p className="text-[11px] text-slate-500">
            Useful for checking the logic and for people who like numbers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter slot time (e.g. 10:00)..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => setTableExpanded(!tableExpanded)}
            className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            {tableExpanded ? 'Collapse Table' : 'Show All 48 Slots'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold">
            <tr>
              <th className="px-3 py-2 text-left">Slot Time</th>
              <th className="px-3 py-2 text-left">Settlement Period</th>
              <th className="px-3 py-2 text-right">Forecast MW</th>
              <th className="px-3 py-2 text-left">Publish Time Used</th>
              <th className="px-3 py-2 text-right">Actual MW</th>
              <th className="px-3 py-2 text-right">Error (Forecast - Actual)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredData.map((p) => {
              const err = p.error_mw;
              const isOver = err !== null && err > 0;
              return (
                <tr key={p.settlement_period} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3 py-2 font-semibold text-slate-800">{p.time_label}</td>
                  <td className="px-3 py-2 text-slate-500">SP {p.settlement_period}</td>
                  <td className="px-3 py-2 text-right font-semibold text-blue-700">
                    {p.forecast_mw !== null ? `${p.forecast_mw.toLocaleString()} MW` : 'No forecast'}
                  </td>
                  <td className="px-3 py-2 text-slate-500 font-mono text-[11px]">
                    {p.publish_time ? p.publish_time.replace('T', ' ').replace(':00Z', ' UTC') : 'N/A'}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-emerald-700">
                    {p.actual_mw !== null ? `${p.actual_mw.toLocaleString()} MW` : 'No actual'}
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {err !== null ? (
                      <span className={isOver ? 'text-amber-700 font-semibold' : 'text-blue-700 font-semibold'}>
                        {err > 0 ? `+${err.toLocaleString()}` : err.toLocaleString()} MW
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!tableExpanded && chartData.length > 10 && (
          <div className="p-2 text-center bg-slate-50 border-t border-slate-100">
            <button
              onClick={() => setTableExpanded(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Showing first 10 slots. Click here to expand all 48 slots.
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

