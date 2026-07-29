/**
 * Overrides for strings the packaged dashboard ships.
 *
 * Custom translations are merged into the same `translation` namespace the
 * dashboard uses, so supplying an existing key replaces it. That is how the
 * login screen stops saying "Welcome to Medusa" — through the translation
 * layer, rather than by overwriting text with CSS `content`, which would be
 * invisible to screen readers and to anyone selecting the text.
 *
 * Written inline rather than imported from JSON: the pattern in this folder's
 * README uses `import ... with { type: "json" }`, which this project's
 * TypeScript module setting rejects outright.
 *
 * The keys are the dashboard's own, so they are tied to the pinned Medusa
 * version. If an upgrade renames them the copy quietly reverts to Medusa's —
 * visible on the login page, which is the first thing anyone checks after an
 * upgrade anyway.
 */
/*
  Only the login screen is overridden.

  Reset-password was tried and taken back out. `resetPassword.title` feeds the
  browser tab while the visible heading comes from a separate key, so overriding
  it left the tab and the page disagreeing about what the page was called — and
  Medusa's own wording there says nothing about Medusa, so there was nothing to
  fix in the first place.
*/
const en = {
  login: {
    title: "House of Sirka",
    hint: "Sign in to the workroom",
  },
}

export default {
  en: {
    translation: en,
  },
}
