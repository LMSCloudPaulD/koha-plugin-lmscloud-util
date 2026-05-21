import { msg, updateWhenLocaleChanges } from "@lit/localize";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { when } from "lit/directives/when.js";
import { cardSurface, tokens } from "./styles/tokens.js";
import type { StackedBarMetric } from "./types.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
);

@customElement("lms-report-stacked-bar")
export class LMSReportStackedBar extends LitElement {
  static override styles = [tokens, cardSurface];

  @property({ attribute: false })
  metric?: StackedBarMetric;

  private _canvasRef: Ref<HTMLCanvasElement> = createRef();
  private _chart: Chart<"bar"> | null = null;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  override updated() {
    if (!this.metric) return;
    const canvas = this._canvasRef.value;
    if (!canvas || this.metric.buckets.length === 0) {
      this._destroyChart();
      return;
    }
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
          metric.buckets.length > 0 && metric.series.length > 0,
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

    const accent = this._readToken("--lms-report-accent", "#408540");
    const datasets = this.metric.series.map((s) => ({
      label: s.label,
      data: s.values,
      backgroundColor: s.color || accent,
    }));

    if (this._chart) {
      this._chart.data.labels = this.metric.buckets;
      this._chart.data.datasets = datasets;
      this._chart.update();
      return;
    }

    this._chart = new Chart(canvas, {
      type: "bar",
      data: { labels: this.metric.buckets, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12 } },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: { stacked: true, ticks: { maxRotation: 0, autoSkipPadding: 8 } },
          y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
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

declare global {
  interface HTMLElementTagNameMap {
    "lms-report-stacked-bar": LMSReportStackedBar;
  }
}
