// API client and type definitions for Elexon WindIQ Day-Ahead Decision Dashboard

export interface DashboardSummary {
  avg_forecast_mw: number;
  peak_forecast_mw: number;
  lowest_forecast_mw: number;
  avg_actual_mw: number;
  peak_actual_mw: number;
  lowest_actual_mw: number;
}

export interface DashboardMetrics {
  mae: number;
  bias: number;
  bias_direction: 'Over-forecast' | 'Under-forecast' | 'Neutral';
  rmse: number;
  p90_error: number;
  p95_error: number;
  count: number;
}

export interface BufferRecommendation {
  recommended_mw: number;
  p90_buffer_mw: number;
  p95_buffer_mw: number;
  advice_text: string;
  advice_text_95: string;
  rationale: string;
}

export interface DashboardChartPoint {
  settlement_period: number;
  time_label: string;
  hour: number;
  forecast_mw: number | null;
  actual_mw: number | null;
  error_mw: number | null;
  publish_time: string | null;
  has_gap: boolean;
}

export interface DataGapsInfo {
  has_gaps: boolean;
  missing_forecast_slots: string[];
  missing_actual_slots: string[];
  message: string;
}

export interface ErrorHistogramBin {
  bin_label: string;
  range_min: number;
  range_max: number;
  count: number;
  percentage: number;
}

export interface ScatterPoint {
  forecast: number;
  actual: number;
  time_label: string;
}

export interface HorizonItem {
  publish_slot: string;
  label: string;
  mae: number;
  bias: number;
  sample_count: number;
}

export interface TimeOfDayItem {
  period_name: string;
  mae: number;
  bias: number;
  count: number;
}

export interface DailyTrendItem {
  date: string;
  date_label: string;
  avg_forecast_mw: number;
  avg_actual_mw: number;
  mae: number;
  bias: number;
}

export interface DecisionDashboardResponse {
  mode: 'day' | 'month';
  delivery_date: string;
  decision_date: string;
  cutoff_time: string;
  decision_time_formatted: string;
  latest_publish_time: string | null;
  publish_time_formatted: string;
  timezone: string;
  summary: DashboardSummary;
  metrics: DashboardMetrics;
  buffer_recommendation: BufferRecommendation;
  chart_data: DashboardChartPoint[];
  daily_trends?: DailyTrendItem[];
  data_gaps: DataGapsInfo;
  error_histogram: ErrorHistogramBin[];
  scatter_data: ScatterPoint[];
  horizon_analysis: HorizonItem[];
  time_of_day_analysis: TimeOfDayItem[];
}

function getBackendUrl(path: string): string {
  return path;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (netErr) {
    if (url.startsWith('/api')) {
      const hostname = window.location.hostname || 'localhost';
      const fallbackUrl = `http://${hostname}:8000${url}`;
      response = await fetch(fallbackUrl, options);
    } else {
      throw netErr;
    }
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('text/html') && url.startsWith('/api')) {
    const hostname = window.location.hostname || 'localhost';
    const directUrl = `http://${hostname}:8000${url}`;
    const directResp = await fetch(directUrl, options);
    if (!directResp.ok) {
      const errTxt = await directResp.text();
      throw new Error(`API error (${directResp.status}): ${errTxt || directResp.statusText}`);
    }
    return directResp.json();
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
  }

  return response.json();
}

export async function checkHealth(): Promise<{ status: string; service: string; version: string }> {
  return fetchJson<{ status: string; service: string; version: string }>(getBackendUrl('/api/health'));
}

export async function getDecisionDashboard(
  deliveryDate: string = '2026-01-14',
  cutoffTime: string = '09:20'
): Promise<DecisionDashboardResponse> {
  const params = new URLSearchParams({ delivery_date: deliveryDate, cutoff_time: cutoffTime });
  return fetchJson<DecisionDashboardResponse>(getBackendUrl(`/api/decision-dashboard?${params.toString()}`));
}
