import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  getDecisionDashboard,
  DecisionDashboardResponse,
} from '../api';
import { DashboardHeader } from './DashboardHeader';
import { InfoCards } from './InfoCards';
import { ForecastChart } from './ForecastChart';
import { MetricCards } from './MetricCards';
import { BufferRecommendationBox } from './BufferRecommendationBox';
import { ErrorCharts } from './ErrorCharts';
import { DetailsTable } from './DetailsTable';
import { AssumptionsFooter } from './AssumptionsFooter';

export const MainDashboard: React.FC = () => {
  // Controls state
  const [deliveryDate, setDeliveryDate] = useState<string>('2026-01-14');
  const [cutoffTime, setCutoffTime] = useState<string>('09:20');
  const [showActuals, setShowActuals] = useState<boolean>(true);

  // Data fetching state
  const [data, setData] = useState<DecisionDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Days in January 2026
  const januaryDays = Array.from({ length: 31 }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    return `2026-01-${day}`;
  });

  // Fetch data on date or cutoff change
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await getDecisionDashboard(deliveryDate, cutoffTime);
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const e = err as Error;
          setError(e.message || 'Failed to connect to the forecast API. Please check backend connection.');
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [deliveryDate, cutoffTime]);

  const handlePrevDay = () => {
    if (deliveryDate === 'whole_month') {
      setDeliveryDate('2026-01-31');
      return;
    }
    const idx = januaryDays.indexOf(deliveryDate);
    if (idx > 0) setDeliveryDate(januaryDays[idx - 1]);
  };

  const handleNextDay = () => {
    if (deliveryDate === 'whole_month') {
      setDeliveryDate('2026-01-01');
      return;
    }
    const idx = januaryDays.indexOf(deliveryDate);
    if (idx < januaryDays.length - 1) setDeliveryDate(januaryDays[idx + 1]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* 1. Title and Controls */}
      <DashboardHeader
        deliveryDate={deliveryDate}
        onDateChange={setDeliveryDate}
        cutoffTime={cutoffTime}
        onCutoffChange={setCutoffTime}
        januaryDays={januaryDays}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
            <p className="text-slate-700 font-semibold text-sm">Loading renewable generation forecasts...</p>
            <p className="text-xs text-slate-400 mt-1">Fetching latest published Elexon WINDFOR and FUELHH streams</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 shadow-xs flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900">Failed to load forecast data</h3>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => setDeliveryDate('2026-01-14')}
                className="mt-3 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Reset to 14 January 2026
              </button>
            </div>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Section 1: "What forecast do I have when I decide?" */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* 2. Info cards (which forecast was used, daily summary) */}
              <InfoCards
                decisionTimeFormatted={data.decision_time_formatted}
                publishTimeFormatted={data.publish_time_formatted}
                summary={data.summary}
                showActuals={showActuals}
              />

              {/* 3. Forecast vs actual chart */}
              <ForecastChart
                chartData={data.chart_data}
                mode={data.mode}
                deliveryDate={data.delivery_date}
                showActuals={showActuals}
                onToggleActuals={setShowActuals}
                dataGaps={data.data_gaps}
              />
            </section>

            {/* Section 2: "How wrong are the forecasts?" */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* 4. Metric cards */}
              <MetricCards metrics={data.metrics} />

              {/* 5. Buffer recommendation box */}
              <BufferRecommendationBox recommendation={data.buffer_recommendation} />

              {/* 6. Error charts (over time, histogram, scatter) */}
              <ErrorCharts
                chartData={data.chart_data}
                histogram={data.error_histogram}
                scatterData={data.scatter_data}
              />

              {/* 7. Details table */}
              <DetailsTable chartData={data.chart_data} />
            </section>

            {/* 8. Small "Assumptions and data notes" footer */}
            <AssumptionsFooter />
          </>
        )}
      </main>
    </div>
  );
};
