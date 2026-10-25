import React from 'react';
import { HelpCircle } from 'lucide-react';

export const AssumptionsFooter: React.FC = () => {
  return (
    <footer className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs text-slate-600 space-y-2.5">
      <div className="flex items-center gap-1.5 text-slate-900 font-bold">
        <HelpCircle className="w-4 h-4 text-slate-500" />
        <span>Assumptions and Data Notes</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
        <div>
          <strong className="block text-slate-800 font-semibold">Decision Cutoff Time:</strong>
          <p className="text-slate-500 mt-0.5">
            Default 09:20 UK time on the day before delivery. Matches the EPEX SPOT UK Day-Ahead wholesale market auction gate closure. Only forecasts published prior to cutoff are eligible for decision-making.
          </p>
        </div>

        <div>
          <strong className="block text-slate-800 font-semibold">Timezone:</strong>
          <p className="text-slate-500 mt-0.5">
            All times in UK time (GMT / UTC in January). All 48 half-hour settlement periods follow UK standard clock time.
          </p>
        </div>

        <div>
          <strong className="block text-slate-800 font-semibold">Data Source:</strong>
          <p className="text-slate-500 mt-0.5">
            Actual generation sourced from Elexon BMRS <code>FUELHH</code> stream (fuelType: WIND). Forecasts sourced from Elexon BMRS <code>WINDFOR</code> stream. No external or non-Elexon data used.
          </p>
        </div>

        <div>
          <strong className="block text-slate-800 font-semibold">Data Gaps & Resolution:</strong>
          <p className="text-slate-500 mt-0.5">
            Hourly WINDFOR forecasts mapped to two half-hour settlement periods. All slots in January 2026 are fully accounted for without gaps.
          </p>
        </div>
      </div>
    </footer>
  );
};

