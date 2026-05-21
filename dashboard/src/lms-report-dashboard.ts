import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { repeat } from "lit/directives/repeat.js";
import { applyDocumentLocale } from "./locale-init.js";
import "./lms-report-counter.js";
import "./lms-report-time-series.js";
import "./lms-report-top-n.js";
import { tokens } from "./styles/tokens.js";
import type { Metric, ReportEnvelope } from "./types.js";

type View =
  | { kind: "error"; message: string }
  | { kind: "loading" }
  | { kind: "data"; envelope: ReportEnvelope }
  | { kind: "empty" };

@customElement("lms-report-dashboard")
export class LMSReportDashboard extends LitElement {
  static override styles = [
    tokens,
    css`
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1rem;
        align-items: flex-end;
        margin-bottom: 1rem;
        padding: 0.5rem 0.75rem;
        background: var(--lms-report-filters-bg);
        border: 1px solid var(--lms-report-filters-border);
        border-radius: 5px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        font-size: 0.85rem;
      }
      .field label {
        font-weight: normal;
        color: var(--lms-report-fg);
      }
      .field input,
      .field select {
        font: inherit;
        padding: 0.35rem 0.55rem;
        border: 1px solid var(--lms-report-input-border);
        border-radius: var(--lms-report-input-radius);
        background: var(--lms-report-input-bg);
        color: inherit;
        min-width: 9rem;
        line-height: 1.42857143;
      }
      button.apply {
        font: inherit;
        line-height: 1.42857143;
        padding: 0.35rem 0.85rem;
        background: var(--lms-report-button-bg);
        color: var(--lms-report-button-fg);
        border: 1px solid var(--lms-report-button-border);
        border-radius: var(--lms-report-button-radius);
        font-weight: normal;
        cursor: pointer;
        margin-left: auto;
      }
      button.apply:hover {
        background: var(--lms-report-button-bg-hover);
      }
      button.apply:active,
      button.apply:focus {
        box-shadow: inset 0 0 0 1px #edb423;
        outline: none;
      }
      button.apply:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
      }
      .grid > .wide {
        grid-column: 1 / -1;
      }
      .status {
        padding: 1rem 1.25rem;
        border: 1px solid var(--lms-report-card-border);
        border-radius: var(--lms-report-card-radius);
        background: var(--lms-report-card-bg);
        text-align: center;
      }
      .status.error {
        background: var(--lms-report-error-bg);
        border-color: var(--lms-report-error-border);
        color: var(--lms-report-error-fg);
      }
    `,
  ];

  @property({ type: String })
  endpoint = "";

  /**
   * Optional URL returning the list of libraries available to the
   * current user. The component expects an array of objects shaped as
   * Koha's `/libraries` response (`library_id` + `name`). When set, the
   * Branch field renders as a populated `<select>` instead of a plain
   * text input.
   */
  @property({ type: String, attribute: "libraries-endpoint" })
  librariesEndpoint = "";

  @property({ type: String })
  start = "";

  @property({ type: String })
  end = "";

  @property({ type: String })
  branchcode = "";

  @state() private _envelope: ReportEnvelope | null = null;
  @state() private _loading = false;
  @state() private _error: string | null = null;

  @state() private _pendingStart = "";
  @state() private _pendingEnd = "";
  @state() private _pendingBranchcode = "";

  @state() private _libraries: Array<{ library_id: string; name: string }> = [];

  private _abort: AbortController | null = null;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.start) this.start = firstOfCurrentMonth();
    if (!this.end) this.end = today();
    this._pendingStart = this.start;
    this._pendingEnd = this.end;
    this._pendingBranchcode = this.branchcode;
    void applyDocumentLocale();
    if (this.librariesEndpoint) void this._fetchLibraries();
    if (this.endpoint) void this._fetchReport();
  }

  override disconnectedCallback() {
    this._abort?.abort();
    super.disconnectedCallback();
  }

  override render() {
    return html`
      <form class="filters" @submit=${this._onSubmit}>
        <div class="field">
          <label for="start">${msg("Start")}</label>
          <input
            id="start"
            type="date"
            .value=${this._pendingStart}
            @input=${(e: Event) =>
              (this._pendingStart = (e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div class="field">
          <label for="end">${msg("End")}</label>
          <input
            id="end"
            type="date"
            .value=${this._pendingEnd}
            @input=${(e: Event) =>
              (this._pendingEnd = (e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div class="field">
          <label for="branchcode">${msg("Branch")}</label>
          ${this._libraries.length > 0
            ? html`
                <select
                  id="branchcode"
                  .value=${this._pendingBranchcode}
                  @change=${(e: Event) =>
                    (this._pendingBranchcode = (
                      e.target as HTMLSelectElement
                    ).value)}
                >
                  <option value="">${msg("All branches")}</option>
                  ${map(
                    this._libraries,
                    (lib) =>
                      html`<option
                        value=${lib.library_id}
                        ?selected=${lib.library_id === this._pendingBranchcode}
                      >
                        ${lib.name}
                      </option>`,
                  )}
                </select>
              `
            : html`
                <input
                  id="branchcode"
                  type="text"
                  placeholder=${msg("All branches")}
                  .value=${this._pendingBranchcode}
                  @input=${(e: Event) =>
                    (this._pendingBranchcode = (
                      e.target as HTMLInputElement
                    ).value)}
                />
              `}
        </div>
        <button class="apply" type="submit" ?disabled=${this._loading}>
          ${this._loading ? msg("Loading…") : msg("Apply")}
        </button>
      </form>
      ${this._renderBody()}
    `;
  }

  private _renderBody() {
    const view = this._view();
    switch (view.kind) {
      case "error":
        return html`<div class="status error" role="alert">
          ${view.message}
        </div>`;
      case "loading":
        return html`<div class="status">${msg("Loading report…")}</div>`;
      case "data":
        return html`
          <div class="grid">
            ${repeat(
              view.envelope.metrics,
              (m) => m.id,
              (m) => this._renderMetric(m),
            )}
          </div>
        `;
      case "empty":
        return nothing;
    }
  }

  private _view(): View {
    if (this._error) return { kind: "error", message: this._error };
    if (this._loading && !this._envelope) return { kind: "loading" };
    if (this._envelope) return { kind: "data", envelope: this._envelope };
    return { kind: "empty" };
  }

  private _renderMetric(metric: Metric) {
    switch (metric.type) {
      case "counter":
        return html`<lms-report-counter
          .metric=${metric}
        ></lms-report-counter>`;
      case "time_series":
        return html`<div class="wide">
          <lms-report-time-series
            .metric=${metric}
          ></lms-report-time-series>
        </div>`;
      case "top_n":
        return html`<div class="wide">
          <lms-report-top-n .metric=${metric}></lms-report-top-n>
        </div>`;
    }
  }

  private _onSubmit(event: Event) {
    event.preventDefault();
    this.start = this._pendingStart;
    this.end = this._pendingEnd;
    this.branchcode = this._pendingBranchcode;
    void this._fetchReport();
  }

  private async _fetchLibraries() {
    try {
      const response = await fetch(this.librariesEndpoint, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) return;
      const data = (await response.json()) as Array<{
        library_id?: string;
        branchcode?: string;
        name?: string;
        branchname?: string;
      }>;
      this._libraries = data
        .map((lib) => ({
          library_id: lib.library_id ?? lib.branchcode ?? "",
          name: lib.name ?? lib.branchname ?? lib.library_id ?? "",
        }))
        .filter((lib) => lib.library_id !== "")
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch {
      // Falling back to a free-text input is acceptable; ignore.
    }
  }

  private async _fetchReport() {
    if (!this.endpoint) {
      this._error = msg("No endpoint configured.");
      return;
    }

    this._abort?.abort();
    const controller = new AbortController();
    this._abort = controller;

    const url = new URL(this.endpoint, window.location.origin);
    url.searchParams.set("start", this.start);
    url.searchParams.set("end", this.end);
    if (this.branchcode) {
      url.searchParams.set("branchcode", this.branchcode);
    } else {
      url.searchParams.delete("branchcode");
    }

    this._loading = true;
    this._error = null;

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = (await response.json()) as ReportEnvelope;
      this._envelope = data;
      this.dispatchEvent(
        new CustomEvent("lms-report-loaded", {
          detail: data,
          bubbles: true,
          composed: true,
        }),
      );
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      this._error =
        (err as Error).message || msg("Failed to load report.");
    } finally {
      if (this._abort === controller) this._abort = null;
      this._loading = false;
    }
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function firstOfCurrentMonth(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

declare global {
  interface HTMLElementTagNameMap {
    "lms-report-dashboard": LMSReportDashboard;
  }
}
