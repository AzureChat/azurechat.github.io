// Small shared helpers. No framework — just a few pure functions.

/** Escape text before interpolating it into an HTML string. */
export function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

/** Format an ISO date (e.g. "2026-06-07") for display, locale-aware. */
export function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.valueOf()) ? "" : dateFormatter.format(date);
}

/** Normalise a slug so it's safe in both URLs and view-transition-name idents. */
export function slugSafe(slug) {
  return String(slug)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
