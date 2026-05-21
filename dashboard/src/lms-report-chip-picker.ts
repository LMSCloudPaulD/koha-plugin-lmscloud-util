import { msg, str, updateWhenLocaleChanges } from "@lit/localize";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { formField, tokens } from "./styles/tokens.js";

export interface ChipPickerOption {
  value: string;
  label: string;
}

/**
 * Compact multi-select primitive used by the dashboard's built-in
 * library/category filters and by `<lms-report-filter-multiselect>`.
 *
 * Closed state is a single-line trigger styled like the dashboard's
 * other inputs, with the current selection summarised inline. Selected
 * items appear below the trigger as removable chips. Clicking the
 * trigger opens a checkbox panel with an inline Clear action.
 *
 * Stateless w.r.t. fetching: callers pass `options` and listen for
 * `change` events that carry the new `selected` array. Use the wrapper
 * `<lms-report-filter-multiselect>` if you want endpoint-driven options
 * and the slotted filter contract on top.
 */
@customElement("lms-report-chip-picker")
export class LMSReportChipPicker extends LitElement {
  static override styles = [
    tokens,
    formField,
    css`
      :host {
        display: block;
        position: relative;
      }
      .trigger {
        font: inherit;
        text-align: left;
        padding: 0.35rem 0.55rem;
        border: 1px solid var(--lms-report-input-border);
        border-radius: var(--lms-report-input-radius);
        background: var(--lms-report-input-bg);
        color: inherit;
        min-width: 12rem;
        line-height: 1.42857143;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .trigger:focus,
      .trigger:focus-visible {
        outline: 2px solid var(--lms-report-accent-soft);
        outline-offset: 1px;
      }
      .trigger[aria-expanded="true"] {
        border-color: var(--lms-report-accent);
      }
      .trigger .caret {
        font-size: 0.7em;
        color: var(--lms-report-muted);
      }
      .trigger .placeholder {
        color: var(--lms-report-muted);
      }
      .panel {
        position: absolute;
        z-index: 20;
        top: calc(100% + 0.2rem);
        left: 0;
        min-width: 100%;
        max-width: 24rem;
        max-height: 16rem;
        overflow-y: auto;
        padding: 0.4rem 0;
        background: var(--lms-report-card-bg);
        border: 1px solid var(--lms-report-card-border);
        border-radius: var(--lms-report-card-radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .panel-option {
        display: flex;
        gap: 0.4rem;
        padding: 0.35rem 0.7rem;
        cursor: pointer;
        align-items: center;
      }
      .panel-option:hover {
        background: var(--lms-report-filters-bg);
      }
      .panel-option input {
        cursor: pointer;
      }
      .panel-empty {
        padding: 0.5rem 0.7rem;
        color: var(--lms-report-muted);
        font-size: 0.85rem;
      }
      .panel-clear {
        display: block;
        width: 100%;
        text-align: left;
        padding: 0.4rem 0.7rem;
        border: none;
        border-top: 1px solid var(--lms-report-card-border);
        background: transparent;
        color: var(--lms-report-accent);
        cursor: pointer;
        font: inherit;
        font-size: 0.85rem;
      }
      .panel-clear:hover {
        background: var(--lms-report-filters-bg);
      }
      .panel-clear:disabled {
        color: var(--lms-report-muted);
        cursor: not-allowed;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        margin-top: 0.3rem;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.1rem 0.2rem 0.1rem 0.5rem;
        background: var(--lms-report-accent);
        color: var(--lms-report-accent-fg);
        border-radius: 999px;
        font-size: 0.78rem;
        line-height: 1.2;
      }
      .chip button {
        background: transparent;
        color: inherit;
        border: none;
        font: inherit;
        font-size: 1em;
        line-height: 1;
        padding: 0 0.25rem;
        border-radius: 999px;
        cursor: pointer;
      }
      .chip button:hover,
      .chip button:focus {
        background: rgba(255, 255, 255, 0.2);
        outline: none;
      }
    `,
  ];

  @property({ type: String })
  label = "";

  @property({ attribute: false })
  options: ChipPickerOption[] = [];

  @property({ attribute: false })
  selected: string[] = [];

  /** Placeholder shown in the trigger when nothing is selected. */
  @property({ type: String })
  placeholder = "";

  @state() private _open = false;

  private _onDocClick = (event: MouseEvent) => {
    if (!this._open) return;
    const path = event.composedPath();
    if (!path.includes(this)) this._open = false;
  };

  private _onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this._open) {
      this._open = false;
      const trigger = this.renderRoot.querySelector<HTMLButtonElement>(".trigger");
      trigger?.focus();
    }
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._onDocClick, true);
    this.addEventListener("keydown", this._onKey);
  }

  override disconnectedCallback() {
    document.removeEventListener("click", this._onDocClick, true);
    this.removeEventListener("keydown", this._onKey);
    super.disconnectedCallback();
  }

  override render() {
    const placeholder = this.placeholder || msg("Choose…");
    const summary =
      this.selected.length === 0
        ? html`<span class="placeholder">${placeholder}</span>`
        : html`<span>${msg(str`${this.selected.length} selected`)}</span>`;

    return html`
      <button
        class="trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded=${this._open ? "true" : "false"}
        aria-label=${this.label || placeholder}
        @click=${this._toggle}
      >
        ${summary}
        <span class="caret" aria-hidden="true">▾</span>
      </button>
      ${this._open ? this._renderPanel() : nothing}
      ${this.selected.length > 0 ? this._renderChips() : nothing}
    `;
  }

  private _renderPanel() {
    if (this.options.length === 0) {
      return html`<div class="panel" role="listbox">
        <div class="panel-empty">${msg("No options available.")}</div>
      </div>`;
    }
    return html`
      <div class="panel" role="listbox">
        ${map(this.options, (opt) => {
          const checked = this.selected.includes(opt.value);
          return html`
            <label class="panel-option">
              <input
                type="checkbox"
                .checked=${checked}
                @change=${(e: Event) =>
                  this._toggleOption(opt.value, (e.target as HTMLInputElement).checked)}
              />
              <span>${opt.label}</span>
            </label>
          `;
        })}
        <button
          class="panel-clear"
          type="button"
          ?disabled=${this.selected.length === 0}
          @click=${this._clear}
        >
          ${msg("Clear selection")}
        </button>
      </div>
    `;
  }

  private _renderChips() {
    return html`
      <div class="chips">
        ${map(this.selected, (value) => {
          const opt = this.options.find((o) => o.value === value);
          const label = opt ? opt.label : value;
          return html`
            <span class="chip">
              ${label}
              <button
                type="button"
                aria-label=${msg(str`Remove ${label}`)}
                @click=${() => this._toggleOption(value, false)}
              >
                ×
              </button>
            </span>
          `;
        })}
      </div>
    `;
  }

  private _toggle() {
    this._open = !this._open;
  }

  private _toggleOption(value: string, checked: boolean) {
    const next = checked
      ? this.selected.includes(value)
        ? this.selected
        : [...this.selected, value]
      : this.selected.filter((v) => v !== value);
    this._emit(next);
  }

  private _clear() {
    if (this.selected.length === 0) return;
    this._emit([]);
  }

  private _emit(next: string[]) {
    this.selected = next;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { selected: [...next] },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lms-report-chip-picker": LMSReportChipPicker;
  }
}
