import Medusa from "@medusajs/js-sdk";

/**
 * The Store API client.
 *
 * Reads from NEXT_PUBLIC_* so the same configuration serves both the server
 * components that prerender the catalogue and, later, the browser code that
 * drives the cart. The publishable key is not a secret — it scopes requests to
 * one sales channel and is designed to ship in client bundles.
 */
export const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9001";

export const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export const medusa = new Medusa({
  baseUrl: MEDUSA_URL,
  publishableKey: PUBLISHABLE_KEY,
});

/**
 * The shop sells in Namibian dollars to Namibia, so the region is not a user
 * choice and there is no country switcher to drive it. It is still resolved
 * from the backend rather than hardcoded: region ids are generated per
 * database, so a hardcoded one would break the moment anyone seeds a fresh
 * environment — staging, a colleague's laptop, or production on first deploy.
 */
const REGION_COUNTRY = process.env.NEXT_PUBLIC_MEDUSA_COUNTRY || "na";

let regionPromise = null;

export function getRegion() {
  if (!regionPromise) {
    regionPromise = medusa.store.region
      .list({ fields: "id,name,currency_code,countries.iso_2" })
      .then(({ regions }) => {
        const match = regions.find((region) =>
          (region.countries || []).some((c) => c.iso_2 === REGION_COUNTRY),
        );
        // Falling back to the first region keeps a misconfigured environment
        // rendering prices rather than blank product cards.
        return match || regions[0] || null;
      })
      .catch(() => {
        // Do not cache a failure: the backend may simply have been starting up.
        regionPromise = null;
        return null;
      });
  }
  return regionPromise;
}
