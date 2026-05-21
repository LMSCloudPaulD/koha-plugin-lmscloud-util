import { updateWhenLocaleChanges } from "@lit/localize";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { cardSurface, tokens } from "./styles/tokens.js";
import type { CounterMetric } from "./types.js";

@customElement("lms-report-counter")
export class LMSReportCounter extends LitElement {
  static override styles = [
    tokens,
    cardSurface,
    css`
      .value {
        font-size: var(--lms-report-counter-size);
        font-weight: 600;
        line-height: 1.1;
        color: var(--lms-report-counter-fg);
      }
      .label {
        margin-top: 0.5rem;
      }
      .description {
        margin: 0.25rem 0 0;
      }
    `,
  ];

  @property({ attribute: false })
  metric?: CounterMetric;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  override render() {
    return when(
      this.metric,
      (metric) => html`
        <div class="value" aria-label=${metric.label}>
          ${this._formatValue(metric.value)}
        </div>
        <div class="label">${metric.label}</div>
        ${when(
          metric.description,
          () => html`<div class="description">${metric.description}</div>`,
        )}
      `,
      () => nothing,
    );
  }

  private _formatValue(value: number): string {
    try {
      return new Intl.NumberFormat(this._locale()).format(value);
    } catch {
      return String(value);
    }
  }

  private _locale(): string {
    return document.documentElement.lang || navigator.language || "en";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lms-report-counter": LMSReportCounter;
  }
}
