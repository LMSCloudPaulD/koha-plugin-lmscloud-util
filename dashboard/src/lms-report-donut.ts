import { msg, updateWhenLocaleChanges } from "@lit/localize";
import {
  ArcElement,
  Chart,
  DoughnutController,
  Legend,
  Tooltip,
} from "chart.js";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { when } from "lit/directives/when.js";
import { cardSurface, tokens } from "./styles/tokens.js";
import type { TopNMetric } from "./types.js";

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

/**
 * Doughnut-chart rendering of a TopN metric. Reads `items[]` from the
 * envelope (label/value plus optional per-slice color) and Chart.js
 * handles the rest. Suited to share-of-total reads (e.g. purpose-of-use)
 * where relative slice size carries the signal and exact ranking is
 * secondary.
 */
@customElement("lms-report-donut")
export class LMSReportDonut extends LitElement {
  static override styles = [tokens, cardSurface];

  @property({ attribute: false })
  metric?: TopNMetric;

  private _canvasRef: Ref<HTMLCanvasElement> = createRef();
  private _chart: Chart<"doughnut"> | null = null;

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

    const accent = this._readToken("--lms-report-accent", "#408540");
    const labels = this.metric.items.map((it) => it.label);
    const data = this.metric.items.map((it) => it.value);
    const colors = this.metric.items.map(
      (it, idx) => it.color || palette(idx, accent),
    );

    if (this._chart) {
      this._chart.data.labels = labels;
      this._chart.data.datasets[0]!.data = data;
      this._chart.data.datasets[0]!.backgroundColor = colors;
      this._chart.update();
      return;
    }

    this._chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "55%",
        plugins: {
          legend: { position: "right", labels: { boxWidth: 12 } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = ctx.parsed as number;
                const total = (ctx.dataset.data as number[]).reduce(
                  (a, b) => a + b,
                  0,
                );
                const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${ctx.label}: ${value} (${pct}%)`;
              },
            },
          },
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

// Spread N slices around the hue wheel anchored at the accent hue so the
// donut stays visually coherent with the rest of the dashboard. Falls
// back to the accent for the first slice when only one item is present.
function palette(index: number, accent: string): string {
  const m = accent.match(/^#([0-9a-f]{6})$/i);
  if (!m) return accent;
  const r = parseInt(m[1]!.slice(0, 2), 16);
  const g = parseInt(m[1]!.slice(2, 4), 16);
  const b = parseInt(m[1]!.slice(4, 6), 16);
  const hsl = rgbToHsl(r, g, b);
  const hue = (hsl.h + index * 47) % 360;
  return hslToCss(hue, Math.max(0.4, hsl.s), Math.min(0.6, Math.max(0.4, hsl.l)));
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
  }
  return { h, s, l };
}

function hslToCss(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

declare global {
  interface HTMLElementTagNameMap {
    "lms-report-donut": LMSReportDonut;
  }
}
