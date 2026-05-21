import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { when } from "lit/directives/when.js";
import { cardSurface, tokens } from "./styles/tokens.js";
import type { HeatmapMetric } from "./types.js";

/**
 * Lightweight HTML-table heatmap. Each cell is shaded on a sequential
 * scale (card background -> accent) proportional to value / max, and the
 * raw count is printed inside so staff can read specific values.
 * Text color flips to white once the cell is dark enough (relative
 * luminance < 0.55) to keep contrast acceptable.
 */
@customElement("lms-report-heatmap")
export class LMSReportHeatmap extends LitElement {
  static override styles = [
    tokens,
    cardSurface,
    css`
      .heatmap-wrap {
        overflow-x: auto;
      }
      table {
        border-collapse: collapse;
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }
      th,
      td {
        padding: 0.35rem 0.55rem;
        text-align: center;
        border: 1px solid var(--lms-report-card-border);
        min-width: 3.5rem;
        white-space: nowrap;
      }
      th.row {
        text-align: left;
        font-weight: 600;
        background: var(--lms-report-filters-bg);
      }
      thead th {
        background: var(--lms-report-filters-bg);
        font-weight: 600;
      }
      thead th .swatch {
        display: inline-block;
        width: 0.65rem;
        height: 0.65rem;
        border-radius: 2px;
        margin-right: 0.3rem;
        vertical-align: -1px;
      }
    `,
  ];

  @property({ attribute: false })
  metric?: HeatmapMetric;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
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
          metric.rows.length > 0 && metric.cols.length > 0,
          () => this._renderTable(metric),
          () =>
            html`<div class="empty">
              ${msg("No data in the selected range.")}
            </div>`,
        )}
      `,
      () => nothing,
    );
  }

  private _renderTable(metric: HeatmapMetric) {
    const max = metric.grid.reduce(
      (m, row) => row.reduce((mm, v) => (v > mm ? v : mm), m),
      0,
    );
    const accent = this._readToken("--lms-report-accent", "#408540");
    const cardBg = this._readToken("--lms-report-card-bg", "#ffffff");
    const accentRgb = hexToRgb(accent) ?? { r: 64, g: 133, b: 64 };
    const baseRgb = hexToRgb(cardBg) ?? { r: 255, g: 255, b: 255 };

    return html`
      <div class="heatmap-wrap">
        <table>
          <thead>
            <tr>
              <th></th>
              ${map(
                metric.cols,
                (c) => html`
                  <th>
                    ${c.color
                      ? html`<span
                          class="swatch"
                          style="background:${c.color}"
                        ></span>`
                      : nothing}${c.label}
                  </th>
                `,
              )}
            </tr>
          </thead>
          <tbody>
            ${map(
              metric.rows,
              (row, rowIdx) => html`
                <tr>
                  <th class="row">${row.label}</th>
                  ${map(metric.cols, (_col, colIdx) => {
                    const value = metric.grid[rowIdx]?.[colIdx] ?? 0;
                    const t = max > 0 ? value / max : 0;
                    const { bg, fg } = cellColors(baseRgb, accentRgb, t);
                    return html`
                      <td style="background:${bg};color:${fg}">${value}</td>
                    `;
                  })}
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  private _readToken(name: string, fallback: string): string {
    const value = getComputedStyle(this).getPropertyValue(name).trim();
    return value.length > 0 ? value : fallback;
  }
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(color: string): Rgb | null {
  const m = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let hex = m[1]!;
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function relativeLuminance({ r, g, b }: Rgb) {
  const linear = (channel: number) => {
    const v = channel / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function cellColors(base: Rgb, accent: Rgb, t: number) {
  const bg: Rgb = {
    r: lerp(base.r, accent.r, t),
    g: lerp(base.g, accent.g, t),
    b: lerp(base.b, accent.b, t),
  };
  const fg = relativeLuminance(bg) < 0.55 ? "#ffffff" : "#000000";
  return { bg: `rgb(${bg.r}, ${bg.g}, ${bg.b})`, fg };
}

declare global {
  interface HTMLElementTagNameMap {
    "lms-report-heatmap": LMSReportHeatmap;
  }
}
