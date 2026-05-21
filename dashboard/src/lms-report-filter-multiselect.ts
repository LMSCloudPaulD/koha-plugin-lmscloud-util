import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./lms-report-chip-picker.js";
import type { ChipPickerOption } from "./lms-report-chip-picker.js";
import { formField, tokens } from "./styles/tokens.js";
import type { LMSReportFilterElement } from "./types.js";

/**
 * Generic endpoint-backed multi-select that plugs into <lms-report-dashboard>
 * via its `filters` slot. Fetches `[{ [valueKey]: ..., [labelKey]: ... }]`
 * from `endpoint` and renders an <lms-report-chip-picker> whose chosen
 * values surface under the URL param named `name`.
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

  @state()
  private _options: ChipPickerOption[] = [];

  @state()
  private _selected: string[] = [];

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.endpoint) void this._fetchOptions();
  }

  get filterName(): string {
    return this.name;
  }

  filterValues(): string[] {
    return [...this._selected];
  }

  filterReset(): void {
    this._selected = [];
  }

  override render() {
    return html`
      <div class="field" part="field">
        <label>${this.label || this.name}</label>
        <lms-report-chip-picker
          .label=${this.label || this.name}
          .options=${this._options}
          .selected=${this._selected}
          .placeholder=${this._options.length === 0 && this.endpoint
            ? msg("Loading…")
            : msg("Choose…")}
          @change=${(e: CustomEvent<{ selected: string[] }>) => {
            this._selected = e.detail.selected;
          }}
        ></lms-report-chip-picker>
      </div>
    `;
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
      // Endpoint unreachable — leave _options empty so the picker shows
      // its empty state. The dashboard treats an empty filter as "no
      // narrowing".
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lms-report-filter-multiselect": LMSReportFilterMultiselect;
  }
}
