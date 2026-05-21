import { css } from "lit";

/**
 * Single source of truth for the design tokens consumed by every
 * lms-report-* component. Imported into each component's `static styles`
 * so the same `--lms-report-*` custom properties exist on every shadow
 * root and stay overridable from the light DOM.
 *
 * Adjust a token here and every metric view picks it up — never duplicate
 * a `:host { … }` token block in a component file.
 */
export const tokens = css`
  :host {
    /* Chart / counter accent — Koha intranet brand green. */
    --lms-report-accent: #408540;
    --lms-report-accent-fg: #ffffff;
    --lms-report-accent-soft: #6faf44;

    /* Koha primary action color (intranet btn-primary). */
    --lms-report-button-bg: #ffc32b;
    --lms-report-button-bg-hover: #ffd15e;
    --lms-report-button-border: #ffc32b;
    --lms-report-button-fg: #000000;
    --lms-report-button-radius: 4px;

    --lms-report-fg: #000000;
    --lms-report-muted: #555555;
    --lms-report-font: -apple-system, "Segoe UI", Roboto,
      "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif;

    --lms-report-card-bg: #ffffff;
    --lms-report-card-fg: var(--lms-report-fg);
    --lms-report-card-border: #d6d6d6;
    --lms-report-card-radius: 0.5rem;
    --lms-report-card-padding: 1.25rem;

    --lms-report-filters-bg: #f4f8f9;
    --lms-report-filters-border: #b9d8d9;
    --lms-report-input-bg: #ffffff;
    --lms-report-input-border: #bcbcbc;
    --lms-report-input-radius: 4px;

    --lms-report-chart-height: 16rem;

    --lms-report-counter-size: 2.5rem;
    --lms-report-counter-fg: var(--lms-report-accent);

    --lms-report-error-bg: #fdecea;
    --lms-report-error-border: #f5a8a0;
    --lms-report-error-fg: #842029;

    color: var(--lms-report-fg);
    font-family: var(--lms-report-font);
  }
`;

/**
 * Card surface + common label/description/empty rules shared by every
 * metric view (counter / time-series / top-n). Reading the design tokens
 * defined above — never hard-code colors, radii, or spacing here.
 */
export const cardSurface = css`
  :host {
    display: block;
    padding: var(--lms-report-card-padding);
    background: var(--lms-report-card-bg);
    border: 1px solid var(--lms-report-card-border);
    border-radius: var(--lms-report-card-radius);
    color: var(--lms-report-card-fg);
  }

  .label {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
  }

  .description {
    margin: 0 0 0.75rem;
    font-size: 0.85rem;
    color: var(--lms-report-muted);
  }

  .empty {
    padding: 1.5rem 0;
    text-align: center;
    color: var(--lms-report-muted);
    font-size: 0.9rem;
  }

  .chart-wrap {
    position: relative;
    height: var(--lms-report-chart-height);
  }
`;

/**
 * Toolbar field styling shared by the dashboard's built-in filters and any
 * slotted custom filter elements (e.g. lms-report-filter-multiselect). Keeps
 * inputs visually consistent across shadow roots without duplicating rules.
 */
export const formField = css`
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
  .field select[multiple] {
    min-height: 5.5rem;
  }
`;
