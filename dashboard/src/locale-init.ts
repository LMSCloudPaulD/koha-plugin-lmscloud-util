import { configureLocalization } from "@lit/localize";
import * as deTemplates from "./generated/locales/de.js";
import * as deDETemplates from "./generated/locales/de-DE.js";
import { sourceLocale, targetLocales } from "./generated/locale-codes.js";

/**
 * Map of locale → template module, populated by static imports so the bundler
 * inlines every locale into the single output bundle. Adding a new target
 * locale means: extend `targetLocales` in lit-localize.json, regenerate, and
 * add a static import + map entry here. The literal `import` calls keep
 * `inlineDynamicImports: true` happy in `vite.config.ts`.
 *
 * Generated template modules return `string | StrResult` per entry (StrResult
 * for templates that use `str\`…\`` substitutions); typing the map loosely as
 * the inferred module type keeps lit-localize's runtime happy.
 */
const localeTemplates: Record<string, typeof deTemplates> = {
  de: deTemplates,
  "de-DE": deDETemplates,
};

/**
 * Configure @lit/localize once at module load. Lit calls `loadLocale` whenever
 * `setLocale()` is invoked with a new tag; we hand it back the already-bundled
 * module synchronously (wrapped in a resolved promise).
 */
export const { getLocale, setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale: string) => {
    const mod = localeTemplates[locale];
    if (!mod) {
      return Promise.reject(new Error(`Unknown locale: ${locale}`));
    }
    return Promise.resolve(mod);
  },
});

/**
 * Pick the best matching active locale from `document.documentElement.lang`.
 * Koha sets this from the user's chosen interface language (e.g. "en", "de",
 * "de-DE"). We try the exact tag first, then the base language, otherwise
 * fall back to the source locale.
 */
export async function applyDocumentLocale(): Promise<void> {
  const requested = (document.documentElement.lang || "").trim();
  if (!requested) return;

  const candidates = [requested, requested.split("-")[0]!].filter(
    (tag, i, arr) => tag && arr.indexOf(tag) === i,
  );

  for (const tag of candidates) {
    if (tag === sourceLocale) return;
    if ((targetLocales as readonly string[]).includes(tag)) {
      await setLocale(tag);
      return;
    }
  }
}
