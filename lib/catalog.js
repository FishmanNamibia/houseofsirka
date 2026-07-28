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
export const SEED_VERSION = 3;
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
    collection: "Workroom",
    price: 1890,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1100&q=82",
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
    deliveryOptions: "Windhoek delivery\nCoastal delivery (Swakopmund, Walvis Bay)\nNationwide courier\nCollect from the Windhoek atelier",
    defaultCity: "Windhoek",
    orderPrefix: "HOS",
    orderStatuses: "Pending Payment\nProcessing\nPacked\nShipped\nDelivered\nCancelled\nRefunded",
    lowStockThreshold: 2,
    paymentMethods: "PayToday\nCard payment\nEFT bank transfer\nFNB eWallet\nPayPulse / BlueVoucher (Standard Bank)\nEasyWallet (Bank Windhoek)\nSend Money (Nedbank)\nFNB Pay2Cell\nPay on delivery",
    proofRequiredMethods: "EFT bank transfer\nFNB eWallet\nPayPulse / BlueVoucher (Standard Bank)\nEasyWallet (Bank Windhoek)\nSend Money (Nedbank)\nFNB Pay2Cell",
    autoConfirmMethods: "Card payment\nPayToday",
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
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
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
    paymentGateway: "network-international",
    gatewayMode: "sandbox",
    gatewayPublicKey: "pk_test_51Demo00000000000000000000000000000000000000000000",
    gatewaySecretKey: "sk_test_51Demo00000000000000000000000000000000000000000000",
    gatewayWebhookSecret: "whsec_demo000000000000000000000000000000",
    gatewayMerchantId: "",
    gatewayExtraConfig: '{"paymentMethodTypes": ["card"], "currency": "NAD", "note": "Network International Namibia, formerly DPO Pay. Settles in NAD."}',
    maintenanceMode: false,
  },
  content: {
    announcement: "Free delivery in Windhoek over N$1,500 \u00b7 PayToday, eWallet, EasyWallet, PayPulse and EFT accepted",
    heroTitle: "House of Sirka",
    heroBadge: "Cut and fitted in Windhoek",
    heroSubtitle:
      "A Windhoek atelier cutting dresses, tailoring and intimate collections for Namibian bodies, Namibian light and Namibian occasions \u2014 held in depth across sizes, not spread thin across styles.",
    heroImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=84",
    heroCtaPrimary: "Shop the rail",
    heroCtaSecondary: "View collections",
    fittingNoteTitle: "Fitting note",
    fittingNoteText: "Every piece can be fitted at the atelier. The first alteration is on us \u2014 hems, waists, straps.",
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
    collection2Title: "Workroom",
    collection2Category: "Outerwear",
    collection2Image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=82",
    collection3Title: "Coast",
    collection3Category: "Sets",
    collection3Image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82",
    collection4Title: "Essentials",
    collection4Category: "Tops",
    collection4Image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=82",
    accountEyebrow: "Customer",
    accountTitle: "Account and order tracking",
    accountCopy:
      "Log in with the email you used at checkout to follow your order, confirm an eWallet or EFT payment, and keep your wishlist.",
    footerTagline: "A Windhoek atelier. Classical silhouettes, honest measurements, and one complimentary alteration on every piece we sell.",
  },
};

/** Stable URL key for a product. Falls back to the name for admin-created items. */
export function productSlug(product) {
  return product?.slug || slugify(product?.name);
}

export const SEED_CATEGORIES = [...new Set(SEED_PRODUCTS.map((p) => p.category))];
export const SEED_COLLECTIONS = [...new Set(SEED_PRODUCTS.map((p) => p.collection))];

export function getSeedProduct(slug) {
  return SEED_PRODUCTS.find((p) => productSlug(p) === slug) || null;
}

/**
 * Merges a persisted store over the seed defaults.
 *
 * Product-level additions are backfilled so payloads saved by older builds — and
 * products created in the admin panel — gain new optional fields automatically.
 * Existing keys are never renamed or dropped: app/admin/page.jsx reads them directly.
 */
/**
 * Per-key merge: seed wins only where the saved value is untouched.
 * `snapshot` is the seed content this payload was last reconciled against.
 */
function reconcileContent(savedContent, snapshot) {
  const saved = stripNulls(savedContent);
  const out = { ...initialStore.content };

  for (const [key, savedValue] of Object.entries(saved)) {
    const wasEdited = !snapshot || savedValue !== snapshot[key];
    if (wasEdited) out[key] = savedValue;
  }
  return out;
}

export function normalizeStore(store) {
  const contentIsStale = (store.seedVersion || 0) < SEED_VERSION;

  return {
    ...initialStore,
    ...store,
    seedVersion: SEED_VERSION,
    products: (store.products || initialStore.products).map((product) => ({
      ...product,
      slug: product.slug || slugify(product.name),
      images:
        Array.isArray(product.images) && product.images.length
          ? product.images
          : product.image
            ? [product.image]
            : [],
      reviews: Array.isArray(product.reviews) ? product.reviews : [],
      sizeGuide: product.sizeGuide || null,
    })),
    customers: store.customers || [],
    promotions: normalizePromotions(store.promotions),
    settings: {
      ...initialStore.settings,
      ...stripNulls(store.settings),
    },
    content: contentIsStale
      ? reconcileContent(store.content, store.contentSnapshot)
      : {
          ...initialStore.content,
          ...stripNulls(store.content),
        },
    // Recorded so the next migration can tell edited fields from untouched ones.
    contentSnapshot: initialStore.content,
  };
}
