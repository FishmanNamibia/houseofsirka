import { INDEXABLE } from "@/lib/demo";

const SITE = "https://houseofsirka.com";

export default function robots() {
  // A demo carrying invented reviews must not be crawlable. Turning demo data
  // on costs indexing, by design — the two states are mutually exclusive so
  // nobody has to remember the interaction at deploy time. See lib/demo.js.
  if (!INDEXABLE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The CMS is a private entry point and should never be indexed.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
