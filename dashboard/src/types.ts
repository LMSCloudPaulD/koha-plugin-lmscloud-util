export type MetricType = "counter" | "time_series" | "top_n";
export type Bucket = "day" | "week" | "month";

export interface Scope {
  start: string;
  end: string;
  branchcode: string | null;
}

interface MetricBase {
  id: string;
  label: string;
  description: string;
}

export interface CounterMetric extends MetricBase {
  type: "counter";
  value: number;
}

export interface TimeSeriesPoint {
  bucket: string;
  value: number;
}

export interface TimeSeriesMetric extends MetricBase {
  type: "time_series";
  bucket: Bucket;
  series: TimeSeriesPoint[];
}

export interface TopNItem {
  label: string;
  value: number;
  /** Optional per-item color hint (CSS color string). When set, the bar
   * for this row uses this color instead of the dashboard accent. */
  color?: string | null;
}

export type TopNOrientation = "horizontal" | "vertical";

export interface TopNMetric extends MetricBase {
  type: "top_n";
  items: TopNItem[];
  /** Defaults to `"horizontal"` (bars run left→right, ranked-list style). */
  orientation?: TopNOrientation;
}

export type Metric = CounterMetric | TimeSeriesMetric | TopNMetric;

export interface ReportEnvelope {
  scope: Scope;
  metrics: Metric[];
}

export interface ReportFilters {
  start: string;
  end: string;
  branchcode: string;
}
