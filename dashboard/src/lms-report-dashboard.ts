import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { repeat } from "lit/directives/repeat.js";
import { applyDocumentLocale } from "./locale-init.js";
import "./lms-report-chip-picker.js";
import "./lms-report-counter.js";
import "./lms-report-donut.js";
import "./lms-report-filter-multiselect.js";
import "./lms-report-heatmap.js";
import "./lms-report-stacked-bar.js";
import "./lms-report-time-series.js";
import "./lms-report-top-n.js";
import { formField, tokens } from "./styles/tokens.js";
import {
  isFilterElement,
  type LMSReportFilterElement,
  type Metric,
  type ReportEnvelope,
} from "./types.js";

type View =
  | { kind: "error"; message: string }
  | { kind: "loading" }
  | { kind: "data"; envelope: ReportEnvelope }
  | { kind: "empty" };

interface Library {
  library_id: string;
  name: string;
}

interface Category {
  patron_category_id: string;
  name: string;
}

@customElement("lms-report-dashboard")
export class LMSReportDashboard extends LitElement {
  static override styles = [
    tokens,
    formField,
    css`
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1rem;
        align-items: flex-end;
        margin-bottom: 1rem;
        padding: 0.6rem 0.75rem;
        background: var(--lms-report-filters-bg);
        border: 1px solid var(--lms-report-filters-border);
        border-radius: 5px;
      }
      .filters .actions {
        display: flex;
        gap: 0.5rem;
        margin-left: auto;
      }
      .field input[type="number"] {
        min-width: 4rem;
        width: 4.5rem;
      }
      .field--row {
        flex-direction: row;
        align-items: center;
        gap: 0.4rem;
      }
      .weekday-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
      }
      .weekday-chips button {
        font: inherit;
        font-size: 0.8rem;
        box-sizing: border-box;
        height: var(--lms-report-control-height);
        padding: 0 0.7rem;
        border: 1px solid var(--lms-report-input-border);
        border-radius: 999px;
        background: var(--lms-report-input-bg);
        color: inherit;
        cursor: pointer;
        line-height: 1;
      }
      .weekday-chips button[aria-pressed="true"] {
        background: var(--lms-report-accent);
        border-color: var(--lms-report-accent);
        color: var(--lms-report-accent-fg);
      }
      .weekday-chips button:focus {
        outline: 2px solid var(--lms-report-accent-soft);
        outline-offset: 1px;
      }
      button.apply,
      button.reset {
        font: inherit;
        line-height: 1.42857143;
        box-sizing: border-box;
        height: var(--lms-report-control-height);
        padding: 0 0.85rem;
        border-radius: var(--lms-report-button-radius);
        font-weight: normal;
        cursor: pointer;
      }
      button.apply {
        background: var(--lms-report-button-bg);
        color: var(--lms-report-button-fg);
        border: 1px solid var(--lms-report-button-border);
      }
      button.apply:hover {
        background: var(--lms-report-button-bg-hover);
      }
      button.apply:active,
      button.apply:focus {
        box-shadow: inset 0 0 0 1px #edb423;
        outline: none;
      }
      button.apply:disabled,
      button.reset:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
      button.reset {
        background: transparent;
        color: var(--lms-report-fg);
        border: 1px solid var(--lms-report-input-border);
      }
      button.reset:hover {
        background: var(--lms-report-input-bg);
      }
      button.reset:focus {
        outline: 2px solid var(--lms-report-accent-soft);
        outline-offset: 1px;
      }
      .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: stretch;
      }
      .grid > * {
        min-width: 0;
      }
      .grid > .counter {
        flex: 1 1 14rem;
        max-width: 22rem;
      }
      .grid > .medium {
        flex: 1 1 26rem;
      }
      .grid > .wide {
        flex: 1 1 100%;
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
   * current user. Component expects Koha's `/libraries` shape
   * (`library_id` + `name`, with `branchcode`/`branchname` fallback).
   * When set, the Branches field renders as a multi-select.
   */
  @property({ type: String, attribute: "libraries-endpoint" })
  librariesEndpoint = "";

  /**
   * Optional URL returning the list of patron categories. Component
   * expects Koha's `/patron_categories` shape (`patron_category_id` +
   * `name`/`description`, with `categorycode` fallback). When set, the
   * Patron categories field renders as a multi-select.
   */
  @property({ type: String, attribute: "categories-endpoint" })
  categoriesEndpoint = "";

  @property({ type: String })
  start = "";

  @property({ type: String })
  end = "";

  @state() private _envelope: ReportEnvelope | null = null;
  @state() private _loading = false;
  @state() private _error: string | null = null;

  @state() private _pendingStart = "";
  @state() private _pendingEnd = "";
  @state() private _pendingBranchcodes: string[] = [];
  @state() private _pendingCategorycodes: string[] = [];
  @state() private _pendingWeekdays = new Set<number>();
  @state() private _pendingHourStart: number | null = null;
  @state() private _pendingHourEnd: number | null = null;

  @state() private _libraries: Library[] = [];
  @state() private _categories: Category[] = [];

  @query('slot[name="filters"]')
  private _filtersSlot?: HTMLSlotElement;

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
    void applyDocumentLocale();
    if (this.librariesEndpoint) void this._fetchLibraries();
    if (this.categoriesEndpoint) void this._fetchCategories();
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
        ${this._renderLibrariesField()} ${this._renderCategoriesField()}
        <slot name="filters"></slot>
        ${this._renderWeekdayField()} ${this._renderHourRangeField()}
        <div class="actions">
          <button class="reset" type="button" @click=${this._onReset}>
            ${msg("Reset")}
          </button>
          <button class="apply" type="submit" ?disabled=${this._loading}>
            ${this._loading ? msg("Loading…") : msg("Apply")}
          </button>
        </div>
      </form>
      ${this._renderBody()}
    `;
  }

  private _renderLibrariesField() {
    if (this._libraries.length === 0) return nothing;
    return html`
      <div class="field">
        <label>${msg("Branches")}</label>
        <lms-report-chip-picker
          .label=${msg("Branches")}
          .options=${this._libraries.map((lib) => ({
            value: lib.library_id,
            label: lib.name,
          }))}
          .selected=${this._pendingBranchcodes}
          @change=${(e: CustomEvent<{ selected: string[] }>) => {
            this._pendingBranchcodes = e.detail.selected;
          }}
        ></lms-report-chip-picker>
      </div>
    `;
  }

  private _renderCategoriesField() {
    if (this._categories.length === 0) return nothing;
    return html`
      <div class="field">
        <label>${msg("Patron categories")}</label>
        <lms-report-chip-picker
          .label=${msg("Patron categories")}
          .options=${this._categories.map((cat) => ({
            value: cat.patron_category_id,
            label: cat.name,
          }))}
          .selected=${this._pendingCategorycodes}
          @change=${(e: CustomEvent<{ selected: string[] }>) => {
            this._pendingCategorycodes = e.detail.selected;
          }}
        ></lms-report-chip-picker>
      </div>
    `;
  }

  private _renderWeekdayField() {
    const labels = [
      msg("Mon"),
      msg("Tue"),
      msg("Wed"),
      msg("Thu"),
      msg("Fri"),
      msg("Sat"),
      msg("Sun"),
    ];
    return html`
      <div class="field">
        <label>${msg("Weekdays")}</label>
        <div class="weekday-chips" role="group" aria-label=${msg("Weekdays")}>
          ${map(
            labels,
            (lbl, idx) => html`
              <button
                type="button"
                aria-pressed=${this._pendingWeekdays.has(idx) ? "true" : "false"}
                @click=${() => this._toggleWeekday(idx)}
              >
                ${lbl}
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }

  private _renderHourRangeField() {
    return html`
      <div class="field">
        <label for="hour-start">${msg("Hours")}</label>
        <div class="field--row">
          <input
            id="hour-start"
            type="number"
            min="0"
            max="23"
            placeholder="0"
            .value=${this._pendingHourStart === null
              ? ""
              : String(this._pendingHourStart)}
            @input=${(e: Event) => {
              const v = (e.target as HTMLInputElement).value;
              this._pendingHourStart = v === "" ? null : Number(v);
            }}
          />
          <span aria-hidden="true">–</span>
          <input
            id="hour-end"
            type="number"
            min="0"
            max="23"
            placeholder="23"
            .value=${this._pendingHourEnd === null
              ? ""
              : String(this._pendingHourEnd)}
            @input=${(e: Event) => {
              const v = (e.target as HTMLInputElement).value;
              this._pendingHourEnd = v === "" ? null : Number(v);
            }}
          />
        </div>
      </div>
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
        return html`<div class="counter">
          <lms-report-counter .metric=${metric}></lms-report-counter>
        </div>`;
      case "time_series":
        return html`<div class="wide">
          <lms-report-time-series
            .metric=${metric}
          ></lms-report-time-series>
        </div>`;
      case "top_n": {
        if (metric.display === "donut") {
          return html`<div class="medium">
            <lms-report-donut .metric=${metric}></lms-report-donut>
          </div>`;
        }
        // Vertical histograms need the full width for their X-axis labels
        // to breathe; ranked horizontal lists pack two-up.
        const wide = metric.orientation === "vertical";
        return html`<div class=${wide ? "wide" : "medium"}>
          <lms-report-top-n .metric=${metric}></lms-report-top-n>
        </div>`;
      }
      case "stacked_bar":
        return html`<div class="wide">
          <lms-report-stacked-bar .metric=${metric}></lms-report-stacked-bar>
        </div>`;
      case "heatmap":
        return html`<div class="wide">
          <lms-report-heatmap .metric=${metric}></lms-report-heatmap>
        </div>`;
    }
  }

  private _toggleWeekday(idx: number) {
    const next = new Set(this._pendingWeekdays);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    this._pendingWeekdays = next;
  }

  private _onSubmit(event: Event) {
    event.preventDefault();
    this.start = this._pendingStart;
    this.end = this._pendingEnd;
    void this._fetchReport();
  }

  private _onReset() {
    this._pendingBranchcodes = [];
    this._pendingCategorycodes = [];
    this._pendingWeekdays = new Set();
    this._pendingHourStart = null;
    this._pendingHourEnd = null;
    for (const filter of this._slottedFilters()) {
      filter.filterReset?.();
    }
    void this._fetchReport();
  }

  private _slottedFilters(): LMSReportFilterElement[] {
    const slot = this._filtersSlot;
    if (!slot) return [];
    return slot
      .assignedElements({ flatten: true })
      .filter((el): el is LMSReportFilterElement => isFilterElement(el));
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
      // Falling back to no branch filter is acceptable; ignore.
    }
  }

  private async _fetchCategories() {
    try {
      const response = await fetch(this.categoriesEndpoint, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) return;
      const data = (await response.json()) as Array<{
        patron_category_id?: string;
        categorycode?: string;
        name?: string;
        description?: string;
      }>;
      this._categories = data
        .map((cat) => ({
          patron_category_id:
            cat.patron_category_id ?? cat.categorycode ?? "",
          name: cat.description ?? cat.name ?? cat.patron_category_id ?? "",
        }))
        .filter((cat) => cat.patron_category_id !== "")
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch {
      // Falling back to no category filter is acceptable; ignore.
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
    for (const code of this._pendingBranchcodes) {
      url.searchParams.append("branchcode", code);
    }
    for (const code of this._pendingCategorycodes) {
      url.searchParams.append("categorycode", code);
    }
    for (const idx of [...this._pendingWeekdays].sort((a, b) => a - b)) {
      url.searchParams.append("weekday", String(idx));
    }
    if (this._pendingHourStart !== null && this._pendingHourEnd !== null) {
      url.searchParams.set("hour_start", String(this._pendingHourStart));
      url.searchParams.set("hour_end", String(this._pendingHourEnd));
    }
    for (const filter of this._slottedFilters()) {
      for (const value of filter.filterValues()) {
        url.searchParams.append(filter.filterName, value);
      }
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
      this._error = (err as Error).message || msg("Failed to load report.");
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
