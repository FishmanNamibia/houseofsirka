/**
 * Catalog seed data and store normalisation.
 *
 * No browser APIs and no "use client" — this module is importable from server
 * components, which is what lets product pages be statically generated and
 * carry real metadata while localStorage still holds the mutable store.
 */

import { createSeedPromotions, normalizePromotions } from "@/lib/promotions";
import { slugify, stripNulls } from "@/lib/format";

export const STORAGE_KEY = "house-of-sirka-next-store";

/**
 * Bumped whenever the seeded demo copy changes.
 *
 * normalizeStore merges a saved store over the seed, so updated seed copy would
 * otherwise stay invisible to anyone holding an existing localStorage payload.
 *
 * The migration is per-key rather than wholesale: a field is refreshed only if
 * its saved value still matches the seed snapshot it was last synced against.
 * Anything edited in the admin panel differs from that snapshot and is left
 * alone, so new seed copy lands without discarding real content work.
 */
export const SEED_VERSION = 12;
export const CUSTOMER_KEY = "house-of-sirka-customer";

/** Product colour chips. Distinct from the theme palette — these describe garments. */
export const COLOR_SWATCHES = {
  Black: "#131313",
  Ivory: "#F5EFE4",
  Merlot: "#6B1730",
  Jade: "#0E6760",
  Ochre: "#A87F36",
  Rose: "#D79BA5",
  Navy: "#18233F",
  Stone: "#B7B0A7",
  Sand: "#C7B191",
};

export const SEED_PRODUCTS = [
  {
    id: "p-liora",
    slug: "liora-satin-midi-dress",
    name: "Liora Satin Midi Dress",
    sku: "HOS-DRS-101",
    category: "Dresses",
    collection: "Evening Edit",
    price: 1490,
    salePrice: 1290,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Bias-cut satin that moves with you, on adjustable straps. Cut for Windhoek evening functions \u2014 warm enough at eight, still right at midnight.",
    tags: ["Featured", "Best seller"],
    rating: 4.8,
    createdAt: "2026-04-02",
    status: "Published",
    variants: [
      { id: "v-liora-s-merlot", size: "S", color: "Merlot", stock: 5 },
      { id: "v-liora-m-merlot", size: "M", color: "Merlot", stock: 2 },
      { id: "v-liora-l-black", size: "L", color: "Black", stock: 3 },
    ],
  },
  {
    id: "p-amara",
    slug: "amara-tailored-blazer",
    name: "Amara Tailored Blazer",
    sku: "HOS-OUT-204",
    category: "Outerwear",
    collection: "The Workroom",
    price: 1890,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "A structured shoulder and satin lining, cut with room for a light layer beneath. Made for offices that run cold and afternoons that do not.",
    tags: ["Featured", "Tailored"],
    rating: 4.7,
    createdAt: "2026-03-20",
    status: "Published",
    variants: [
      { id: "v-amara-s-black", size: "S", color: "Black", stock: 4 },
      { id: "v-amara-m-black", size: "M", color: "Black", stock: 6 },
      { id: "v-amara-l-ivory", size: "L", color: "Ivory", stock: 1 },
    ],
  },
  {
    id: "p-sira",
    slug: "sira-linen-co-ord-set",
    name: "Sira Linen Co-ord Set",
    sku: "HOS-SET-118",
    category: "Sets",
    collection: "Coast",
    price: 1190,
    salePrice: 990,
    image:
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Linen-blend shirt and easy trouser, cut loose for the coast. Made with Swakopmund wind and January heat in mind.",
    tags: ["New arrival"],
    rating: 4.6,
    createdAt: "2026-04-14",
    status: "Published",
    variants: [
      { id: "v-sira-xs-jade", size: "XS", color: "Jade", stock: 3 },
      { id: "v-sira-s-jade", size: "S", color: "Jade", stock: 5 },
      { id: "v-sira-m-sand", size: "M", color: "Sand", stock: 4 },
    ],
  },
  {
    id: "p-naledi",
    slug: "naledi-pleated-skirt",
    name: "Naledi Pleated Skirt",
    sku: "HOS-SKT-077",
    category: "Skirts",
    collection: "New Arrivals",
    price: 820,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "A fluid pleat on a clean waistband \u2014 easy from a Katutura morning to a Klein Windhoek lunch without a change.",
    tags: ["New arrival"],
    rating: 4.5,
    createdAt: "2026-04-18",
    status: "Published",
    variants: [
      { id: "v-naledi-s-rose", size: "S", color: "Rose", stock: 8 },
      { id: "v-naledi-m-navy", size: "M", color: "Navy", stock: 0 },
      { id: "v-naledi-l-navy", size: "L", color: "Navy", stock: 2 },
    ],
  },
  {
    id: "p-mira",
    slug: "mira-rib-knit-top",
    name: "Mira Rib Knit Top",
    sku: "HOS-TOP-042",
    category: "Tops",
    collection: "Essentials",
    price: 540,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Square neckline, close rib, honest weight. The piece that layers under everything else on this rail from May to August.",
    tags: ["Best seller"],
    rating: 4.9,
    createdAt: "2026-02-22",
    status: "Published",
    variants: [
      { id: "v-mira-xs-ivory", size: "XS", color: "Ivory", stock: 10 },
      { id: "v-mira-s-black", size: "S", color: "Black", stock: 12 },
      { id: "v-mira-m-jade", size: "M", color: "Jade", stock: 7 },
    ],
  },
  {
    id: "p-kalahari",
    slug: "kalahari-wrap-coat",
    name: "Kalahari Wrap Coat",
    sku: "HOS-OUT-301",
    category: "Outerwear",
    collection: "Highland Winter",
    price: 2680,
    salePrice: 2290,
    image:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "A generous collar and belted waist for Khomas Hochland winter mornings, when Windhoek drops to single figures before sunrise.",
    tags: ["Featured", "Low stock"],
    rating: 4.7,
    createdAt: "2026-04-16",
    status: "Published",
    variants: [
      { id: "v-kalahari-s-sand", size: "S", color: "Sand", stock: 1 },
      { id: "v-kalahari-m-stone", size: "M", color: "Stone", stock: 2 },
      { id: "v-kalahari-l-black", size: "L", color: "Black", stock: 0 },
    ],
  },
  {
    id: "p-omuti",
    slug: "omuti-cotton-camisole",
    name: "Omuti Cotton Camisole",
    sku: "HOS-INT-410",
    category: "Intimates",
    collection: "Everyday Intimates",
    price: 390,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Combed cotton camisole with adjustable straps and a bound neckline. Cut to sit flat under a shirt, breathable enough for a Windhoek February.",
    tags: ["New arrival"],
    rating: 4.7,
    createdAt: "2026-05-02",
    status: "Published",
    variants: [
      { id: "v-omuti-xs-ivory", size: "XS", color: "Ivory", stock: 9 },
      { id: "v-omuti-s-ivory", size: "S", color: "Ivory", stock: 12 },
      { id: "v-omuti-m-black", size: "M", color: "Black", stock: 10 },
      { id: "v-omuti-l-black", size: "L", color: "Black", stock: 6 },
    ],
  },
  {
    id: "p-ehungi",
    slug: "ehungi-soft-cup-bralette",
    name: "Ehungi Soft-Cup Bralette",
    sku: "HOS-INT-415",
    category: "Intimates",
    collection: "Everyday Intimates",
    price: 460,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Unlined soft-cup bralette in stretch jersey, wide underband, no wire. Made for wearing all day rather than counting the hours.",
    tags: ["Best seller"],
    rating: 4.6,
    createdAt: "2026-05-06",
    status: "Published",
    variants: [
      { id: "v-ehungi-xs-rose", size: "XS", color: "Rose", stock: 7 },
      { id: "v-ehungi-s-rose", size: "S", color: "Rose", stock: 11 },
      { id: "v-ehungi-m-ivory", size: "M", color: "Ivory", stock: 9 },
      { id: "v-ehungi-l-black", size: "L", color: "Black", stock: 5 },
    ],
  },
  {
    id: "p-ondjila",
    slug: "ondjila-slip-dress",
    name: "Ondjila Satin Slip",
    sku: "HOS-INT-422",
    category: "Intimates",
    collection: "Evening Edit",
    price: 690,
    salePrice: 590,
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Bias satin slip that works under a sheer dress or on its own after dark. Adjustable strap, French seams throughout.",
    tags: ["Featured"],
    rating: 4.8,
    createdAt: "2026-05-11",
    status: "Published",
    variants: [
      { id: "v-ondjila-s-merlot", size: "S", color: "Merlot", stock: 4 },
      { id: "v-ondjila-m-merlot", size: "M", color: "Merlot", stock: 6 },
      { id: "v-ondjila-l-navy", size: "L", color: "Navy", stock: 3 },
    ],
  },
  {
    id: "p-tulinawa",
    slug: "tulinawa-lounge-set",
    name: "Tulinawa Lounge Set",
    sku: "HOS-INT-430",
    category: "Intimates",
    collection: "Everyday Intimates",
    price: 880,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Brushed cotton shirt and short set with piped edges. The set you keep for the first cold week of May.",
    tags: ["New arrival"],
    rating: 4.5,
    createdAt: "2026-05-14",
    status: "Published",
    variants: [
      { id: "v-tulinawa-s-stone", size: "S", color: "Stone", stock: 5 },
      { id: "v-tulinawa-m-stone", size: "M", color: "Stone", stock: 7 },
      { id: "v-tulinawa-l-sand", size: "L", color: "Sand", stock: 4 },
    ],
  },
  {
    id: "p-etosha",
    slug: "etosha-linen-shirt-dress",
    name: "Etosha Linen Shirt Dress",
    sku: "HOS-DRS-118",
    category: "Dresses",
    collection: "Coast",
    price: 1180,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Collared linen shirt dress with a self belt and deep pockets. Loose enough for the drive to Swakop, sharp enough for lunch at the other end.",
    tags: ["New arrival"],
    rating: 4.6,
    createdAt: "2026-05-19",
    status: "Published",
    variants: [
      { id: "v-etosha-s-ivory", size: "S", color: "Ivory", stock: 6 },
      { id: "v-etosha-m-ivory", size: "M", color: "Ivory", stock: 8 },
      { id: "v-etosha-l-sand", size: "L", color: "Sand", stock: 5 },
      { id: "v-etosha-xl-sand", size: "XL", color: "Sand", stock: 3 },
    ],
  },
  {
    id: "p-mariental",
    slug: "mariental-wrap-dress",
    name: "Mariental Wrap Dress",
    sku: "HOS-DRS-124",
    category: "Dresses",
    collection: "The Workroom",
    price: 1390,
    salePrice: 1190,
    image:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "True wrap with a fixed inner tie, so it stays closed when you sit down. Ponte knit that holds its shape through a working day.",
    tags: ["Featured", "Best seller"],
    rating: 4.7,
    createdAt: "2026-05-23",
    status: "Published",
    variants: [
      { id: "v-mariental-xs-navy", size: "XS", color: "Navy", stock: 4 },
      { id: "v-mariental-s-navy", size: "S", color: "Navy", stock: 7 },
      { id: "v-mariental-m-merlot", size: "M", color: "Merlot", stock: 6 },
      { id: "v-mariental-l-merlot", size: "L", color: "Merlot", stock: 4 },
    ],
  },
  {
    id: "p-oshana",
    slug: "oshana-wide-leg-trouser",
    name: "Oshana Wide-Leg Trouser",
    sku: "HOS-TRS-201",
    category: "Trousers",
    collection: "The Workroom",
    price: 980,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "High-waisted wide leg with a clean front and a hidden hook closure. Hemmed to your height at the workroom, no charge.",
    tags: ["New arrival"],
    rating: 4.5,
    createdAt: "2026-05-27",
    status: "Published",
    variants: [
      { id: "v-oshana-xs-black", size: "XS", color: "Black", stock: 6 },
      { id: "v-oshana-s-black", size: "S", color: "Black", stock: 9 },
      { id: "v-oshana-m-stone", size: "M", color: "Stone", stock: 7 },
      { id: "v-oshana-l-stone", size: "L", color: "Stone", stock: 4 },
    ],
  },
  {
    id: "p-katutura",
    slug: "katutura-tapered-trouser",
    name: "Katutura Tapered Trouser",
    sku: "HOS-TRS-208",
    category: "Trousers",
    collection: "Essentials",
    price: 890,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Mid-rise taper in a stretch twill that survives a full week. Cut a little longer in the rise than most, because most are cut short.",
    tags: [],
    rating: 4.4,
    createdAt: "2026-06-01",
    status: "Published",
    variants: [
      { id: "v-katutura-s-navy", size: "S", color: "Navy", stock: 8 },
      { id: "v-katutura-m-navy", size: "M", color: "Navy", stock: 10 },
      { id: "v-katutura-l-black", size: "L", color: "Black", stock: 6 },
      { id: "v-katutura-xl-black", size: "XL", color: "Black", stock: 3 },
    ],
  },
  {
    id: "p-brandberg",
    slug: "brandberg-merino-cardigan",
    name: "Brandberg Merino Cardigan",
    sku: "HOS-KNT-305",
    category: "Knitwear",
    collection: "Highland Winter",
    price: 1450,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Fine merino cardigan with horn buttons and a ribbed hem. Light enough to carry, warm enough for a Khomas Hochland morning.",
    tags: ["Featured"],
    rating: 4.8,
    createdAt: "2026-06-05",
    status: "Published",
    variants: [
      { id: "v-brandberg-s-sand", size: "S", color: "Sand", stock: 4 },
      { id: "v-brandberg-m-sand", size: "M", color: "Sand", stock: 6 },
      { id: "v-brandberg-l-merlot", size: "L", color: "Merlot", stock: 3 },
    ],
  },
  {
    id: "p-swakop",
    slug: "swakop-cotton-knit",
    name: "Swakop Cotton Knit",
    sku: "HOS-KNT-312",
    category: "Knitwear",
    collection: "Coast",
    price: 760,
    salePrice: 650,
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1100&q=82",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1100&q=82",
    ],
    description:
      "Loose cotton knit with a dropped shoulder, for the hour after sunset when the coast turns cold without warning.",
    tags: ["Best seller"],
    rating: 4.5,
    createdAt: "2026-06-09",
    status: "Published",
    variants: [
      { id: "v-swakop-s-ivory", size: "S", color: "Ivory", stock: 7 },
      { id: "v-swakop-m-ivory", size: "M", color: "Ivory", stock: 9 },
      { id: "v-swakop-l-jade", size: "L", color: "Jade", stock: 5 },
    ],
  },
];

export const initialStore = {
  seedVersion: SEED_VERSION,
  products: SEED_PRODUCTS,
  orders: [],
  customers: [],
  promotions: createSeedPromotions(),
  inventoryLogs: [],
  wishlist: [],
  cart: [],
  couponCode: "",
  role: "Super Admin",
  settings: {
    storeName: "House of Sirka",
    storeEmail: "hello@houseofsirka.local",
    storePhone: "+264 81 000 0000",
    storeAddress: "Independence Avenue, Windhoek, Namibia",
    currency: "N$",
    locale: "en-NA",
    taxRate: 15,
    deliveryFee: 95,
    freeDeliveryThreshold: 1500,
    deliveryAreas: "Windhoek, Okahandja, Swakopmund, Walvis Bay, Otjiwarongo, Oshakati, Ongwediva, Rundu, Keetmanshoop",
    deliveryOptions: "Windhoek delivery\nCoastal delivery (Swakopmund, Walvis Bay)\nNationwide courier\nCollect from our Windhoek workroom",
    defaultCity: "Windhoek",
    orderPrefix: "HOS",
    orderStatuses: "Pending Payment\nProcessing\nPacked\nShipped\nDelivered\nCancelled\nRefunded",
    lowStockThreshold: 2,
    paymentMethods: "EFT bank transfer\nFNB eWallet\nPayPulse / BlueVoucher (Standard Bank)\nEasyWallet (Bank Windhoek)\nSend Money (Nedbank)\nFNB Pay2Cell\nPay on delivery",
    proofRequiredMethods: "EFT bank transfer\nFNB eWallet\nPayPulse / BlueVoucher (Standard Bank)\nEasyWallet (Bank Windhoek)\nSend Money (Nedbank)\nFNB Pay2Cell",
    autoConfirmMethods: "",
    bankName: "First National Bank Namibia",
    bankAccountName: "House of Sirka",
    bankAccountNumber: "",
    bankBranchCode: "",
    bankReference: "Use your order number (for example HOS-1001) as the payment reference",
    ewalletProvider: "FNB eWallet",
    ewalletNumber: "+264 81 000 0000",
    ewalletInstructions: "Send to the number above from your FNB app, then upload the confirmation SMS or screenshot at checkout.",
    whatsappNumber: "+264810000000",
    whatsappMessage: "Hi House of Sirka, I'd like to enquire about my order.",
    supportEmail: "support@houseofsirka.local",
    notificationEmail: "orders@houseofsirka.local",
    instagramUrl: "https://instagram.com/houseofsirka",
    facebookUrl: "https://facebook.com/houseofsirka",
    tiktokUrl: "https://tiktok.com/@houseofsirka",
    whatsappChannelUrl: "",
    // email service
    emailProvider: "none",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    smtpEncryption: "tls",
    emailApiKey: "",
    emailFromAddress: "",
    emailFromName: "House of Sirka",
    emailReplyTo: "",
    sendOrderConfirmation: true,
    sendShippingUpdates: true,
    // online payment gateway
    paymentGateway: "manual",
    gatewayMode: "sandbox",
    gatewayPublicKey: "pk_test_51Demo00000000000000000000000000000000000000000000",
    gatewaySecretKey: "sk_test_51Demo00000000000000000000000000000000000000000000",
    gatewayWebhookSecret: "whsec_demo000000000000000000000000000000",
    gatewayMerchantId: "",
    gatewayExtraConfig: '{"currency": "NAD", "note": "Redirect/hosted-page only. No card details are collected or stored by this system."}',
    maintenanceMode: false,
  },
  content: {
    announcement: "Free delivery in Windhoek over N$1,500",
    heroTitle: "House of Sirka",
    heroBadge: "Cut and fitted in Windhoek",
    heroSubtitle:
      "A Windhoek workroom cutting dresses, tailoring and intimate collections for Namibian bodies, Namibian light and Namibian occasions \u2014 held in depth across sizes, not spread thin across styles.",
    heroImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=84",
    heroCtaPrimary: "Shop the rail",
    heroCtaSecondary: "View collections",
    fittingNoteTitle: "Fitting note",
    fittingNoteText: "Every piece can be fitted at the workroom. The first alteration is on us \u2014 hems, waists, straps.",
    heroSecondaryImage:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=82",
    heroSecondaryLabel: "Evening edit",
    heroSecondaryBadge: "Sunny classic",
    campaignTitle: "Made for the Namibian year",
    campaignCopy:
      "Cotton and linen for the November heat, wool and wrap coats for the Khomas Hochland winter, and occasion pieces for weddings from Windhoek to Ongwediva.",
    catalogEyebrow: "The rail",
    catalogTitle: "Pieces with presence",
    catalogCopy:
      "A small, considered rail. Every piece lists real garment measurements in centimetres, so you can decide before it reaches your door.",
    collectionsEyebrow: "Collections",
    collection1Title: "Evening Edit",
    collection1Category: "Dresses",
    collection1Image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=82",
    collection2Title: "The Workroom",
    collection2Category: "Outerwear",
    collection2Image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=82",
    collection3Title: "Coast",
    collection3Category: "Sets",
    collection3Image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82",
    collection4Title: "Intimates",
    collection4Category: "Intimates",
    collection4Image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=82",
    accountEyebrow: "Customer",
    accountTitle: "Account and order tracking",
    accountCopy:
      "Log in with the email you used at checkout to follow your order, confirm an eWallet or EFT payment, and keep your wishlist.",
    footerTagline: "A Windhoek workroom. Classical silhouettes, honest measurements, and one complimentary alteration on every piece we sell.",
  },
};

/** Stable URL key for a product. Falls back to the name for admin-created items. */
export function productSlug(product) {
  return product?.slug || slugify(product?.name);
}

/*
  SEED_CATEGORIES, SEED_COLLECTIONS and getSeedProduct were exported here.
  Every caller now goes through lib/medusa/catalog.js, which answers the same
  questions from the backend and falls back to SEED_PRODUCTS when it cannot.
  Removed rather than left in place: two ways to ask the same question is how
  the storefront and the admin drifted apart in the first place.
*/

/**
 * Merges a persisted store over the seed defaults.
 *
 * Product-level additions are backfilled so payloads saved by older builds — and
 * products created in the admin panel — gain new optional fields automatically.
 * Existing keys are never renamed or dropped: app/admin/page.jsx reads them directly.
 */

/**
 * Values this project has shipped as seed defaults in the past.
 *
 * Stores saved before `contentSnapshot` existed have nothing to compare
 * against, and treating "no snapshot" as "everything was edited" made the
 * migration a no-op for precisely the payloads that needed it. Matching a saved
 * value against any historical seed answers the real question — was this ever
 * touched by a human? — without a snapshot being present.
 *
 * Append to these when changing seed copy; never edit an existing entry.
 */
const LEGACY_SEED_VALUES = {
  paymentMethods: [
    "Online card payment\nEWallet transfer\nEFT bank transfer\nPay upon delivery",
    "PayToday\nFNB eWallet\nEFT bank transfer\nCard payment\nPay on delivery",
    "PayToday\nCard payment\nEFT bank transfer\nFNB eWallet\nPayPulse / BlueVoucher (Standard Bank)\nEasyWallet (Bank Windhoek)\nSend Money (Nedbank)\nFNB Pay2Cell\nPay on delivery",
    "PayToday\nEFT bank transfer\nFNB eWallet\nPayPulse / BlueVoucher (Standard Bank)\nEasyWallet (Bank Windhoek)\nSend Money (Nedbank)\nFNB Pay2Cell\nPay on delivery",
  ],
  proofRequiredMethods: [
    "EWallet transfer\nEFT bank transfer",
    "PayToday\nFNB eWallet\nEFT bank transfer",
  ],
  autoConfirmMethods: ["Online card payment", "Card payment", "Card payment\nPayToday", "PayToday"],
  deliveryOptions: [
    "Windhoek delivery\nCourier delivery\nPickup arrangement",
    "Windhoek delivery\nCoastal delivery (Swakopmund, Walvis Bay)\nNationwide courier\nCollect from our Windhoek workroom",
  ],
  deliveryAreas: [
    "Windhoek, Swakopmund, Walvis Bay",
    "Windhoek, Okahandja, Swakopmund, Walvis Bay, Otjiwarongo, Oshakati, Ongwediva, Rundu, Keetmanshoop",
  ],
  storeAddress: ["Windhoek, Namibia"],
  instagramUrl: [""],
  facebookUrl: [""],
  tiktokUrl: [""],
  paymentGateway: ["stripe", "network-international", "paytoday"],
  ewalletProvider: ["FNB EWallet"],
  ewalletInstructions: [
    "Send to the number above and upload proof of payment.",
    "Send to the number above from your FNB app, then upload the confirmation SMS or screenshot at checkout.",
  ],
  bankReference: ["Use your order number as reference"],
  gatewayExtraConfig: ['{"paymentMethodTypes": ["card"], "currency": "nad"}'],

  announcement: [
    "A cheerful workroom edit: free Windhoek delivery over N$1,500",
    "Free delivery in Windhoek over N$1,500 \u00b7 eWallet, EFT and PayToday accepted",
  ],
  heroBadge: ["Classical boutique, bright mood"],
  heroSubtitle: [
    "A graceful online boutique for dresses, tailoring, and soft statement pieces with an old-world heart and a bright modern pulse.",
  ],
  heroCtaPrimary: ["Shop the salon"],
  fittingNoteText: ["Soft dresses, fine tailoring, and occasion pieces arranged for calm browsing."],
  campaignTitle: ["The Garden Salon"],
  campaignCopy: [
    "Classical silhouettes, sunlit color, and pieces arranged like a private fitting room rather than a warehouse shelf.",
  ],
  catalogEyebrow: ["Boutique rail"],
  catalogCopy: [
    "A brighter product room with enough structure for shopping and enough warmth to feel personal.",
  ],
  accountCopy: [
    "Log in with your email to view your orders, track payment status, and manage your wishlist.",
  ],
  footerTagline: ["Classical silhouettes, cheerful color, and a gentler way to shop online."],
  collection3Title: ["Resort Sets"],
  collection4Title: ["Essentials"],
  collection4Category: ["Tops"],
  collection2Title: ["Workroom"],
};

/**
 * Appends seed products the saved store has never seen.
 *
 * Matching is by id, so a product the shop owner edited or archived keeps its
 * saved state; only genuinely new ones are added.
 */
function mergeSeedProducts(savedProducts, seedIsStale) {
  if (!Array.isArray(savedProducts) || !savedProducts.length) {
    return initialStore.products;
  }
  if (!seedIsStale) return savedProducts;

  const savedIds = new Set(savedProducts.map((p) => p.id));
  const additions = SEED_PRODUCTS.filter((p) => !savedIds.has(p.id));
  return additions.length ? [...savedProducts, ...additions] : savedProducts;
}

/**
 * Per-key merge: the seed wins only where the saved value was never edited.
 *
 * A value counts as untouched if it still equals the snapshot this payload was
 * last reconciled against, or any value we have shipped as a seed default
 * before. Everything else is treated as real content work and preserved.
 */
function reconcileSeeded(savedBlock, snapshot, seedBlock) {
  const saved = stripNulls(savedBlock);
  const out = { ...seedBlock };

  for (const [key, savedValue] of Object.entries(saved)) {
    const matchesSnapshot = snapshot && savedValue === snapshot[key];
    const matchesLegacySeed = (LEGACY_SEED_VALUES[key] || []).includes(savedValue);
    const matchesCurrentSeed = savedValue === seedBlock[key];

    const untouched = matchesSnapshot || matchesLegacySeed || matchesCurrentSeed;
    if (!untouched) out[key] = savedValue;
  }
  return out;
}

export function normalizeStore(store) {
  const contentIsStale = (store.seedVersion || 0) < SEED_VERSION;

  return {
    ...initialStore,
    ...store,
    seedVersion: SEED_VERSION,
    // Products added to the seed after this payload was saved would otherwise
    // never appear — the saved array simply shadows them. This is the same
    // failure that hid updated copy and retired payment methods, so it is
    // handled here rather than patched per field: new seed products are
    // appended, existing ones are left exactly as saved because they may carry
    // admin edits.
    products: mergeSeedProducts(store.products, contentIsStale).map((product) => {
      const seed = SEED_PRODUCTS.find((p) => p.id === product.id);
      const saved = Array.isArray(product.images) ? product.images : [];

      // A saved payload from before galleries existed holds at most the single
      // hero image. Take the seeded gallery in that case; anything richer is
      // the shop owner's own upload and is left alone.
      const images =
        saved.length > 1
          ? saved
          : seed?.images?.length
            ? seed.images
            : saved.length
              ? saved
              : product.image
                ? [product.image]
                : [];

      return {
        ...product,
        slug: product.slug || slugify(product.name),
        images,
        reviews: Array.isArray(product.reviews) ? product.reviews : [],
        sizeGuide: product.sizeGuide || null,
      };
    }),
    customers: store.customers || [],
    promotions: normalizePromotions(store.promotions),
    // Settings carry the payment methods and delivery areas, so they need the
    // same migration as content — otherwise a saved payload keeps showing
    // retired payment rails forever.
    settings: contentIsStale
      ? reconcileSeeded(store.settings, store.settingsSnapshot, initialStore.settings)
      : {
          ...initialStore.settings,
          ...stripNulls(store.settings),
        },
    content: contentIsStale
      ? reconcileSeeded(store.content, store.contentSnapshot, initialStore.content)
      : {
          ...initialStore.content,
          ...stripNulls(store.content),
        },
    // Recorded so the next migration can tell edited fields from untouched ones.
    contentSnapshot: initialStore.content,
    settingsSnapshot: initialStore.settings,
  };
}
