/**
 * Pure formatting and data helpers.
 *
 * No browser APIs — safe to import from server components.
 */

export function money(value, currency = "N$", locale = "en-NA") {
  return `${currency}${Number(value || 0).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function productPrice(product) {
  return product.salePrice || product.price;
}

export function totalStock(product) {
  return (product.variants || []).reduce((sum, variant) => sum + Number(variant.stock || 0), 0);
}

export function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function stripNulls(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v != null) out[k] = v;
  }
  return out;
}

export function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

/** URL-safe slug: strips diacritics, lowercases, hyphenates. */
export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
