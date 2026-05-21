import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { formField, tokens } from "./styles/tokens.js";
import type { LMSReportFilterElement } from "./types.js";

/**
 * Generic endpoint-backed multi-select that plugs into <lms-report-dashboard>
 * via its `filters` slot. Fetches `[{ [valueKey]: ..., [labelKey]: ... }]`
 * from `endpoint` and renders a multi-select whose chosen values surface
 * under the URL param named `name`.
 *
 * Plugins use this to expose domain entities (rooms, events, equipment, …)
 * as report filters without forking the dashboard.
 */
@customElement("lms-report-filter-multiselect")
export class LMSReportFilterMultiselect
  extends LitElement
  implements LMSReportFilterElement
{
  static override styles = [
    tokens,
    formField,
    css`
      :host {
        display: contents;
      }
    `,
  ];

  /** URL search-param name. Repeated for each selected value. */
  @property({ type: String })
  name = "";

  @property({ type: String })
  label = "";

  @property({ type: String })
  endpoint = "";

  /** Property name in the endpoint payload that holds the option value. */
  @property({ type: String, attribute: "value-key" })
  valueKey = "";

  /** Property name in the endpoint payload that holds the option label. */
  @property({ type: String, attribute: "label-key" })
  labelKey = "name";

  /** Comma-separated initial selection. Optional. */
  @property({ type: String })
  selected = "";

  @state()
  private _options: Array<{ value: string; label: string }> = [];

  @state()
  private _pending: string[] = [];

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    this._pending = this.selected
      ? this.selected.split(",").filter((s) => s.length > 0)
      : [];
    if (this.endpoint) void this._fetchOptions();
  }

  get filterName(): string {
    return this.name;
  }

  filterValues(): string[] {
    return [...this._pending];
  }

  filterReset(): void {
    this._pending = [];
  }

  override render() {
    if (!this.name) return nothing;
    return html`
      <div class="field" part="field">
        <label for="select">${this.label || this.name}</label>
        <select
          id="select"
          multiple
          @change=${this._onChange}
          ?disabled=${this._options.length === 0}
        >
          ${map(
            this._options,
            (opt) => html`
              <option
                value=${opt.value}
                ?selected=${this._pending.includes(opt.value)}
              >
                ${opt.label}
              </option>
            `,
          )}
        </select>
        ${this._options.length === 0 && this.endpoint
          ? html`<small>${msg("Loading…")}</small>`
          : nothing}
      </div>
    `;
  }

  private _onChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this._pending = Array.from(select.selectedOptions, (o) => o.value);
    this.dispatchEvent(
      new CustomEvent("lms-filter-change", {
        detail: { name: this.name, values: this._pending },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private async _fetchOptions() {
    try {
      const response = await fetch(this.endpoint, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) return;
      const data = (await response.json()) as Array<Record<string, unknown>>;
      const valueKey = this.valueKey || this.name;
      this._options = data
        .map((row) => ({
          value: String(row[valueKey] ?? ""),
          label: String(row[this.labelKey] ?? row[valueKey] ?? ""),
        }))
        .filter((opt) => opt.value !== "")
        .sort((a, b) => a.label.localeCompare(b.label));
    } catch {
      // Endpoint unreachable — leave _options empty so the select stays
      // disabled. The dashboard treats an empty filter as "no narrowing".
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lms-report-filter-multiselect": LMSReportFilterMultiselect;
  }
}
