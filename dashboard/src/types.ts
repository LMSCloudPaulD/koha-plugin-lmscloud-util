export type MetricType =
  | "counter"
  | "time_series"
  | "top_n"
  | "stacked_bar"
  | "heatmap";
export type Bucket = "day" | "week" | "month";

export interface Scope {
  start: string;
  end: string;
  branchcode: string[] | null;
  categorycodes: string[] | null;
  roomids: number[] | null;
  weekdays: number[] | null;
  hour_start: number | null;
  hour_end: number | null;
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
export type TopNDisplay = "bar" | "donut";

export interface TopNMetric extends MetricBase {
  type: "top_n";
  items: TopNItem[];
  /** Defaults to `"horizontal"` (bars run left→right, ranked-list style).
   *  Only consulted when `display` is `"bar"`. */
  orientation?: TopNOrientation;
  /** Defaults to `"bar"`. Use `"donut"` for share-of-total reads where
   *  proportional area matters more than exact ranking. */
  display?: TopNDisplay;
}

export interface StackedBarSeries {
  label: string;
  color?: string | null;
  values: number[];
}

export interface StackedBarMetric extends MetricBase {
  type: "stacked_bar";
  buckets: string[];
  series: StackedBarSeries[];
}

export interface HeatmapAxisEntry {
  label: string;
  color?: string | null;
}

export interface HeatmapMetric extends MetricBase {
  type: "heatmap";
  rows: HeatmapAxisEntry[];
  cols: HeatmapAxisEntry[];
  grid: number[][];
}

export type Metric =
  | CounterMetric
  | TimeSeriesMetric
  | TopNMetric
  | StackedBarMetric
  | HeatmapMetric;

export interface ReportEnvelope {
  scope: Scope;
  metrics: Metric[];
}

export interface ReportFilters {
  start: string;
  end: string;
  branchcodes: string[];
  categorycodes: string[];
  weekdays: number[];
  hourStart: number | null;
  hourEnd: number | null;
}

/**
 * Contract every slotted filter element under `<lms-report-dashboard>` must
 * satisfy. The dashboard calls `filterValues()` at fetch time and emits one
 * URL search-param entry per returned string under `filterName`.
 *
 * Plugin-specific filter widgets (e.g. a room multi-select or an event-type
 * picker) implement this interface so the dashboard can stay domain-agnostic
 * while still composing them into the request envelope.
 */
export interface LMSReportFilterElement extends HTMLElement {
  /** URL search-param name (singular; repeated for IN-list filters). */
  readonly filterName: string;
  /** Current selected values, encoded as strings. Empty array means "no filter". */
  filterValues(): string[];
  /** Optional: clear the widget's pending selection. */
  filterReset?(): void;
}

export function isFilterElement(
  el: Element,
): el is LMSReportFilterElement {
  return (
    "filterName" in el &&
    typeof (el as LMSReportFilterElement).filterName === "string" &&
    typeof (el as LMSReportFilterElement).filterValues === "function"
  );
}
