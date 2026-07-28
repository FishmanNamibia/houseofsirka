/**
 * Garment measurements and fit notes.
 *
 * 83–87% of apparel sites fail to give shoppers enough sizing information,
 * which makes this the highest-value content on a clothing product page — and
 * the cheapest way to cut the returns that come from guessing.
 *
 * Measurements are of the garment laid flat, in centimetres. Body measurements
 * live on /size-guide; the two are different things and shoppers conflate them,
 * so both are labelled explicitly wherever they appear.
 */

const BY_CATEGORY = {
  Dresses: {
    columns: ["Bust", "Waist", "Length"],
    rows: {
      XS: [84, 66, 118],
      S: [88, 70, 119],
      M: [93, 75, 120],
      L: [99, 81, 122],
      XL: [105, 87, 123],
    },
    fit: "True to size, cut close through the bust.",
    fabric: "Satin, with a slight give on the bias.",
    stretch: "Slight",
    model: "Our model is 1.74m and wears a size S.",
  },
  Outerwear: {
    columns: ["Chest", "Waist", "Sleeve"],
    rows: {
      XS: [92, 78, 59],
      S: [96, 82, 60],
      M: [101, 87, 61],
      L: [107, 93, 62],
      XL: [113, 99, 63],
    },
    fit: "Cut with room for a light layer beneath. True to size.",
    fabric: "Wool blend with a satin lining.",
    stretch: "None",
    model: "Our model is 1.78m and wears a size M.",
  },
  Sets: {
    columns: ["Bust", "Waist", "Inseam"],
    rows: {
      XS: [90, 68, 72],
      S: [94, 72, 73],
      M: [99, 77, 74],
      L: [105, 83, 75],
      XL: [111, 89, 76],
    },
    fit: "Relaxed. Size down if you prefer a closer line.",
    fabric: "Linen blend — breathable, softens with wear.",
    stretch: "None",
    model: "Our model is 1.72m and wears a size S.",
  },
  Skirts: {
    columns: ["Waist", "Hip", "Length"],
    rows: {
      XS: [64, 90, 76],
      S: [68, 94, 77],
      M: [73, 99, 78],
      L: [79, 105, 79],
      XL: [85, 111, 80],
    },
    fit: "Sits at the natural waist. True to size.",
    fabric: "Fluid woven pleat.",
    stretch: "Slight at the waistband",
    model: "Our model is 1.74m and wears a size S.",
  },
  Tops: {
    columns: ["Bust", "Waist", "Length"],
    rows: {
      XS: [78, 70, 56],
      S: [82, 74, 57],
      M: [87, 79, 58],
      L: [93, 85, 59],
      XL: [99, 91, 60],
    },
    fit: "Close rib knit. Settles to the body after a wear.",
    fabric: "Cotton-rich rib.",
    stretch: "Generous",
    model: "Our model is 1.70m and wears a size XS.",
  },
};

const FALLBACK = BY_CATEGORY.Tops;

/** Merges any per-product override over the category default. */
export function sizingFor(product) {
  const base = BY_CATEGORY[product?.category] || FALLBACK;
  return product?.sizeGuide ? { ...base, ...product.sizeGuide } : base;
}

/** Sizes this product is actually cut in, in a sensible order. */
export function sizesFor(product, sizing) {
  const order = ["XS", "S", "M", "L", "XL"];
  const stocked = new Set((product?.variants || []).map((v) => v.size));
  const known = order.filter((s) => sizing.rows[s]);
  const inStock = known.filter((s) => stocked.has(s));
  return inStock.length ? inStock : known;
}
