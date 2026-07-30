import { DEMO_DATA } from "@/lib/demo";

/**
 * Demonstration reviews. Not real people. Shown only in demo mode.
 *
 * These exist so the shop can be presented to the buyer looking like a going
 * concern rather than a blank page — a product page with several reviews reads
 * completely differently from one with none, and that difference is the point of
 * a demo. Ratings sit at 4.3–4.8 rather than a perfect 5.0 because a flawless
 * score reads as fabricated, and each carries a fit verdict, which is the single
 * most useful review dimension for clothing.
 *
 * They are also thirty-two invented people who have never bought anything, so
 * they are gated: `reviewsFor` returns nothing unless NEXT_PUBLIC_DEMO_DATA is
 * set, and setting it forces the whole site to noindex and strips the
 * aggregateRating markup. Fake reviews and search visibility cannot both be
 * switched on. See lib/demo.js.
 *
 * Delete this file once the shop has real reviews. Nothing here should outlive
 * the first genuine customer.
 */

const FIT_VALUES = ["Runs small", "True to size", "Runs large"];

const SEEDS = {
  "p-liora": [
    ["Tuyeni", "Windhoek", 5, "True to size", "Wore it to a wedding at Heja and did not want to take it off. The satin sits properly, it does not cling."],
    ["Ndapewa", "Ongwediva", 4, "Runs small", "Beautiful drape. I normally take S and went up to M — glad I did."],
    ["Kauna", "Swakopmund", 5, "True to size", "The colour is exactly as photographed. Arrived in two days."],
    ["Lize", "Windhoek", 4, "True to size", "Lovely, though I had the hem taken up 4cm. They did it free which I did not expect."],
    ["Selma", "Otjiwarongo", 5, "True to size", "Third piece from them. The quality holds after washing."],
    ["Miriam", "Walvis Bay", 4, "True to size", "Straps needed a small adjustment for my shoulders, otherwise perfect."],
  ],
  "p-amara": [
    ["Hilma", "Windhoek", 5, "True to size", "Structured without being stiff. I wear it over everything."],
    ["Johanna", "Windhoek", 4, "Runs large", "Roomy through the shoulder — I sized down and it is right."],
    ["Rauna", "Rundu", 5, "True to size", "Lining makes it. Does not feel like a cheap blazer at all."],
    ["Anna-Marie", "Keetmanshoop", 4, "True to size", "Good for the office. A little warm at midday in summer."],
    ["Elize", "Windhoek", 5, "True to size", "Wore it every day for a month. Still holds its shape."],
  ],
  "p-sira": [
    ["Ndeshi", "Swakopmund", 5, "True to size", "Made for the coast. Cool in the wind and it does not crease badly."],
    ["Petrina", "Walvis Bay", 4, "Runs large", "Relaxed cut, I took the smaller size as suggested."],
    ["Loide", "Windhoek", 5, "True to size", "The linen softens beautifully after two washes."],
    ["Frieda", "Oshakati", 4, "True to size", "Trousers are a good length on me at 1.68m."],
    ["Tangeni", "Windhoek", 5, "True to size", "Bought it for a December trip and lived in it."],
  ],
  "p-naledi": [
    ["Maria", "Windhoek", 4, "True to size", "The pleat moves nicely. Waistband is comfortable."],
    ["Saara", "Ongwediva", 5, "True to size", "Went from work to dinner without thinking about it."],
    ["Lelanie", "Windhoek", 4, "Runs small", "Snug on the waist for me — take the next size if you are between."],
    ["Paulina", "Okahandja", 5, "True to size", "Good weight of fabric, it does not fly up in the wind."],
    ["Hileni", "Windhoek", 4, "True to size", "Simple and well made. I would buy another colour."],
  ],
  "p-mira": [
    ["Aina", "Windhoek", 5, "True to size", "The layering piece I reach for. Rib holds its shape."],
    ["Verona", "Swakopmund", 5, "True to size", "Bought two. Neckline sits properly, does not gape."],
    ["Tuli", "Windhoek", 4, "Runs small", "Close fitting as described. Size up if you want ease."],
    ["Rebekka", "Rundu", 5, "True to size", "Excellent under the blazer from the same shop."],
    ["Justina", "Windhoek", 4, "True to size", "Good value. Washed well so far."],
    ["Sylvia", "Windhoek", 5, "True to size", "Soft and it has not pilled."],
  ],
  "p-kalahari": [
    ["Magdalena", "Windhoek", 5, "True to size", "Warm enough for those cold Windhoek mornings in July."],
    ["Erica", "Otjiwarongo", 4, "Runs large", "Generous cut. I took a size down and it belts nicely."],
    ["Ottilie", "Windhoek", 5, "True to size", "The collar is the best part. Feels like a proper coat."],
    ["Wilhelmina", "Keetmanshoop", 4, "True to size", "Heavier than expected, which I like."],
    ["Nangula", "Windhoek", 5, "True to size", "Worth it. I wore it all winter."],
  ],
};

function toReview(productId, [author, town, rating, fit, body], index) {
  return {
    id: `${productId}-r${index + 1}`,
    author,
    town,
    rating,
    fit,
    body,
    // Fixed dates: a build must not depend on the clock.
    createdAt: `2026-0${(index % 5) + 1}-1${index % 9}`,
  };
}

export function reviewsFor(product) {
  // Real reviews always win, and are the only ones a live shop ever shows.
  if (Array.isArray(product?.reviews) && product.reviews.length) return product.reviews;
  if (!DEMO_DATA) return [];
  return (SEEDS[product?.id] || []).map((r, i) => toReview(product.id, r, i));
}

export function reviewSummary(reviews) {
  if (!reviews.length) return { count: 0, average: 0, histogram: [], fit: [] };

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const histogram = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const fit = FIT_VALUES.map((label) => ({
    label,
    count: reviews.filter((r) => r.fit === label).length,
  }));

  return {
    count: reviews.length,
    average: Math.round((total / reviews.length) * 10) / 10,
    histogram,
    fit,
  };
}
