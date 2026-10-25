import React from 'react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';

interface DashboardHeaderProps {
  deliveryDate: string;
  onDateChange: (date: string) => void;
  cutoffTime: string;
  onCutoffChange: (time: string) => void;
  januaryDays: string[];
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  deliveryDate,
  onDateChange,
  cutoffTime,
  onCutoffChange,
  januaryDays,
  onPrevDay,
  onNextDay,
}) => {
  return (
    <>
      {/* Top Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  UK Day-Ahead Wind Forecast & Error Evaluation Desk
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">
                National wind forecasts and actuals from Elexon BMRS • Wholesale procurement decision support
              </p>
            </div>

            <div className="flex items-center gap-2 ml-8 md:ml-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                All times in UK time (GMT in January)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Top Controls Card */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Day Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Delivery Day
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={onPrevDay}
                disabled={deliveryDate === '2026-01-01'}
                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>

              <div className="relative flex-1">
                <select
                  value={deliveryDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3.5 py-2 pr-9 text-sm font-semibold text-slate-800 hover:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="whole_month" className="font-bold text-blue-700">
                    ★ Whole Month (All January 2026)
                  </option>
                  <optgroup label="January 2026 Delivery Days">
                    {januaryDays.map((d) => {
                      const dayNum = d.split('-')[2];
                      return (
                        <option key={d} value={d}>
                          {dayNum} January 2026
                        </option>
                      );
                    })}
                  </optgroup>
                </select>
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={onNextDay}
                disabled={deliveryDate === '2026-01-31'}
                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>

              <button
                onClick={() => onDateChange(deliveryDate === 'whole_month' ? '2026-01-14' : 'whole_month')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  deliveryDate === 'whole_month'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {deliveryDate === 'whole_month' ? 'Whole Month Active' : 'Whole Month Option'}
              </button>
            </div>
          </div>

          {/* Decision Cutoff Setting */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Decision Cutoff Setting (UK time on Day Before)
              </label>
              <span className="text-[11px] text-slate-500">
                Default: <strong>09:20 UK time</strong>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="time"
                value={cutoffTime}
                onChange={(e) => onCutoffChange(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => onCutoffChange('09:20')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                  cutoffTime === '09:20'
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                09:20 (Default Auction Cutoff)
              </button>
              <button
                onClick={() => onCutoffChange('11:00')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                  cutoffTime === '11:00'
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                11:00
              </button>
              <button
                onClick={() => onCutoffChange('07:30')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                  cutoffTime === '07:30'
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                07:30
              </button>
            </div>
          </div>
        </div>

        {/* Verification of Assumption */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>Verified Cutoff Assumption:</strong> In Great Britain, the primary wholesale day-ahead power auction (EPEX SPOT UK 60-min Day-Ahead Auction) closes order submission at <strong>09:20 UK time</strong> on Day D-1. The buyer must finalize procurement decisions based solely on forecasts published prior to this gate closure.
          </span>
        </div>
      </section>
    </>
  );
};

