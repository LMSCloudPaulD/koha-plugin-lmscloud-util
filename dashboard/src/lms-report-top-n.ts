import { msg, updateWhenLocaleChanges } from "@lit/localize";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
} from "chart.js";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { when } from "lit/directives/when.js";
import { cardSurface, tokens } from "./styles/tokens.js";
import type { TopNMetric } from "./types.js";

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip);

@customElement("lms-report-top-n")
export class LMSReportTopN extends LitElement {
  static override styles = [tokens, cardSurface];

  @property({ attribute: false })
  metric?: TopNMetric;

  private _canvasRef: Ref<HTMLCanvasElement> = createRef();
  private _chart: Chart<"bar"> | null = null;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  override updated() {
    if (!this.metric) return;
    const canvas = this._canvasRef.value;
    if (!canvas || this.metric.items.length === 0) {
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
          metric.items.length > 0,
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

    const labels = this.metric.items.map((i) => i.label);
    const data = this.metric.items.map((i) => i.value);
    const accent = this._readToken("--lms-report-accent", "#0a58ca");
    const backgroundColor = this.metric.items.map(
      (i) => i.color || accent,
    );
    const vertical = this.metric.orientation === "vertical";

    if (this._chart) {
      this._chart.data.labels = labels;
      this._chart.data.datasets[0]!.data = data;
      this._chart.data.datasets[0]!.backgroundColor = backgroundColor;
      this._chart.update();
      return;
    }

    this._chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: this.metric.label,
            data,
            backgroundColor,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: vertical ? "x" : "y",
        plugins: { legend: { display: false } },
        scales: vertical
          ? {
              x: { ticks: { autoSkip: false } },
              y: { beginAtZero: true, ticks: { precision: 0 } },
            }
          : {
              x: { beginAtZero: true, ticks: { precision: 0 } },
              y: { ticks: { autoSkip: false } },
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
    "lms-report-top-n": LMSReportTopN;
  }
}
