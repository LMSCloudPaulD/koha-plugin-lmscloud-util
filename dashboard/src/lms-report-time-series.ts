import { msg, updateWhenLocaleChanges } from "@lit/localize";
import {
  CategoryScale,
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { when } from "lit/directives/when.js";
import { cardSurface, tokens } from "./styles/tokens.js";
import type { TimeSeriesMetric } from "./types.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
);

@customElement("lms-report-time-series")
export class LMSReportTimeSeries extends LitElement {
  static override styles = [tokens, cardSurface];

  @property({ attribute: false })
  metric?: TimeSeriesMetric;

  private _canvasRef: Ref<HTMLCanvasElement> = createRef();
  private _chart: Chart<"line"> | null = null;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  override updated() {
    if (!this.metric) return;
    const canvas = this._canvasRef.value;
    if (!canvas || this.metric.series.length === 0) {
      this._destroyChart();
      return;
    }
    // Lit may re-mount the canvas element across renders; if the chart
    // instance is bound to a stale (detached) canvas, recreate it.
    if (this._chart && this._chart.canvas !== canvas) {
      this._destroyChart();
    }
    this._renderChart();
  }

  override disconnectedCallback() {
    this._destroyChart();
    super.disconnectedCallback();
  }

  override render() {
    return when(
      this.metric,
      (metric) => html`
        <div class="label">${metric.label}</div>
        ${when(
          metric.description,
          () => html`<div class="description">${metric.description}</div>`,
        )}
        ${when(
          metric.series.length > 0,
          () => html`
            <div class="chart-wrap">
              <canvas ${ref(this._canvasRef)}></canvas>
            </div>
          `,
          () =>
            html`<div class="empty">
              ${msg("No data in the selected range.")}
            </div>`,
        )}
      `,
      () => nothing,
    );
  }

  private _renderChart() {
    const canvas = this._canvasRef.value;
    if (!canvas || !this.metric) return;

    const labels = this.metric.series.map((p) => p.bucket);
    const data = this.metric.series.map((p) => p.value);
    const accent = this._readToken("--lms-report-accent", "#0a58ca");

    if (this._chart) {
      this._chart.data.labels = labels;
      this._chart.data.datasets[0]!.data = data;
      this._chart.update();
      return;
    }

    this._chart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: this.metric.label,
            data,
            borderColor: accent,
            backgroundColor: withAlpha(accent, 0.15),
            fill: true,
            tension: 0.25,
            pointRadius: 2,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
          x: { ticks: { maxRotation: 0, autoSkipPadding: 12 } },
        },
      },
    });
  }

  private _destroyChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  private _readToken(name: string, fallback: string): string {
    const value = getComputedStyle(this).getPropertyValue(name).trim();
    return value.length > 0 ? value : fallback;
  }
}

function withAlpha(color: string, alpha: number): string {
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (!hex) return color;
  const r = parseInt(hex[1]!.slice(0, 2), 16);
  const g = parseInt(hex[1]!.slice(2, 4), 16);
  const b = parseInt(hex[1]!.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

declare global {
  interface HTMLElementTagNameMap {
    "lms-report-time-series": LMSReportTimeSeries;
  }
}
