# `<lms-report-dashboard>`

Shared Lit web component that renders the LMSCloud Reporting harness envelope (counters, time-series, top-N) emitted by `Koha::Plugin::Com::LMSCloud::*::Util::Reporting::Dashboard`.

## Build

```bash
cd dashboard
pnpm install
pnpm run build      # runs lit-localize build + vite build
```

The Vite library build emits a single self-contained ESM bundle at `../dist/lms-report-dashboard.js` with Lit, Chart.js, and every translated locale module statically inlined. Commit the bundle so consumers can pull it through the submodule without running a JS build themselves.

## Use

In a Koha plugin View template:

```html
<script type="module" src="[% PLUGIN_PATH %]/dist/lms-report-dashboard.js"></script>

<lms-report-dashboard
  endpoint="/api/v1/contrib/roomreservations/report"
  branchcode="[% logged_in_user.branchcode %]"
></lms-report-dashboard>
```

The component fetches once on mount with the current `start` / `end` / `branchcode`, then re-fetches when the user clicks **Apply** after editing the filter form.

## Properties

| Property     | Type     | Default                | Description                                      |
| ------------ | -------- | ---------------------- | ------------------------------------------------ |
| `endpoint`   | `string` | `""` (required)        | Report endpoint URL. Will be called via `fetch`. |
| `start`      | `string` | First of current month | ISO `YYYY-MM-DD`.                                |
| `end`        | `string` | Today                  | ISO `YYYY-MM-DD`.                                |
| `branchcode` | `string` | `""`                   | Empty = all branches.                            |

## Localization

The component uses `@lit/localize` and ships translations for **`de`** and **`de-DE`** out of the box. The active locale is picked from `document.documentElement.lang` on first connect — Koha sets this from the user's interface language, so no extra wiring is needed.

To add a locale:

1. Add the tag to `targetLocales` in `lit-localize.json`.
2. `pnpm run i18n:extract` — produces a new XLIFF in `xliff/`.
3. Translate the `<target>` elements.
4. Add a static import + map entry in `src/locale-init.ts` (so the bundler inlines it).
5. `pnpm run build`.

All user-visible strings are defined inside `msg(...)` calls in the component sources — search for `msg(` to see the full set.

## Theming

All styling is driven by CSS custom properties defined once in `src/styles/tokens.ts`. Override any of them on `<lms-report-dashboard>` or any ancestor:

- `--lms-report-accent` — primary chart / button color (default `#0a58ca`)
- `--lms-report-accent-fg` — text on accent (default `#ffffff`)
- `--lms-report-fg` — body text (default `#222222`)
- `--lms-report-muted` — secondary text (default `#555555`)
- `--lms-report-card-bg` — card background (default `#ffffff`)
- `--lms-report-card-border` — card border (default `#d6d6d6`)
- `--lms-report-card-radius` — card border-radius (default `0.5rem`)
- `--lms-report-card-padding` — card inner padding (default `1.25rem`)
- `--lms-report-filters-bg` — filter bar background (default `#f3f4f6`)
- `--lms-report-input-bg` / `--lms-report-input-border` / `--lms-report-input-radius`
- `--lms-report-chart-height` — chart canvas height (default `16rem`)
- `--lms-report-counter-size` — counter value font size (default `2.5rem`)
- `--lms-report-counter-fg` — counter value color (defaults to accent)
- `--lms-report-error-bg` / `--lms-report-error-border` / `--lms-report-error-fg`

## Events

- `lms-report-loaded` — fired after a successful fetch. `event.detail` is the full envelope.
