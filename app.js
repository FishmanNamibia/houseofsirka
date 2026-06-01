const STORAGE_KEY = "houseOfSirkaStoreV1";

const ORDER_STATUSES = [
  "Pending Payment",
  "Paid",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refunded",
];

const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Cancelled", "Refunded"];

const ROLE_PERMISSIONS = {
  "Super Admin": {
    products: "Full",
    orders: "Full",
    content: "Full",
    customers: "Full",
    reports: "Full",
    settings: "Full",
    promotions: "Full",
    inventory: "Full",
  },
  Admin: {
    products: "Full",
    orders: "Full",
    content: "Full",
    customers: "View",
    reports: "Full",
    settings: "Limited",
    promotions: "Full",
    inventory: "Full",
  },
  "Content Manager": {
    products: "View",
    orders: "No",
    content: "Full",
    customers: "No",
    reports: "Limited",
    settings: "No",
    promotions: "Limited",
    inventory: "No",
  },
  "Order Manager": {
    products: "View",
    orders: "Full",
    content: "No",
    customers: "View",
    reports: "Limited",
    settings: "No",
    promotions: "No",
    inventory: "View",
  },
  "Inventory Manager": {
    products: "Stock",
    orders: "View",
    content: "No",
    customers: "No",
    reports: "Inventory",
    settings: "No",
    promotions: "No",
    inventory: "Full",
  },
  "Marketing Manager": {
    products: "View",
    orders: "View",
    content: "Promotions",
    customers: "Limited",
    reports: "Marketing",
    settings: "No",
    promotions: "Full",
    inventory: "No",
  },
};

const COLOR_SWATCHES = {
  Black: "#121212",
  Ivory: "#f7f2e9",
  Merlot: "#6f1730",
  Sage: "#829576",
  Sand: "#cbb99b",
  Teal: "#106b68",
  Rose: "#d49aa4",
  Navy: "#18243d",
  Stone: "#bab5ad",
  Ochre: "#b88b3a",
};

const DEFAULT_CONTENT = {
  announcement:
    "Launch edit live now. Free Windhoek delivery on orders over N$1,500.",
  heroTitle: "House of Sirka",
  heroSubtitle:
    "A premium online boutique experience with curated fashion, easy checkout, and a CMS-ready operations flow.",
  heroImage:
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=82",
  footerCopy:
    "Elegant essentials, polished occasionwear, and seasonal collections managed through a boutique-friendly CMS.",
  socialLinks: [
    { label: "Instagram", url: "https://www.instagram.com/" },
    { label: "Facebook", url: "https://www.facebook.com/" },
    { label: "WhatsApp", url: "https://www.whatsapp.com/" },
  ],
  about:
    "House of Sirka curates timeless fashion pieces for customers who want polished style with smooth online service.",
};

const COLLECTIONS = [
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    category: "All",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Workroom",
    slug: "workroom",
    category: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Evening Edit",
    slug: "evening-edit",
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Resort Sets",
    slug: "resort-sets",
    category: "Sets",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
];

const DEFAULT_PRODUCTS = [
  {
    id: "p-dress-liora",
    name: "Liora Satin Midi Dress",
    slug: "liora-satin-midi-dress",
    sku: "HOS-DRS-101",
    category: "Dresses",
    collection: "Evening Edit",
    brand: "House of Sirka",
    price: 1490,
    salePrice: 1290,
    status: "published",
    featured: true,
    newArrival: true,
    bestSeller: true,
    description:
      "Bias-cut satin midi dress with a soft drape, adjustable straps, and a polished evening silhouette.",
    shortDescription: "Bias-cut satin midi dress.",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
    ],
    rating: 4.8,
    reviews: 18,
    createdAt: "2026-03-18",
    metaTitle: "Liora Satin Midi Dress | House of Sirka",
    metaDescription: "Shop the Liora satin midi dress from House of Sirka.",
    variants: [
      { id: "v-liora-s-merlot", size: "S", color: "Merlot", stock: 5, sku: "HOS-DRS-101-S-MER" },
      { id: "v-liora-m-merlot", size: "M", color: "Merlot", stock: 2, sku: "HOS-DRS-101-M-MER" },
      { id: "v-liora-l-black", size: "L", color: "Black", stock: 3, sku: "HOS-DRS-101-L-BLK" },
    ],
  },
  {
    id: "p-blazer-amara",
    name: "Amara Tailored Blazer",
    slug: "amara-tailored-blazer",
    sku: "HOS-OUT-204",
    category: "Outerwear",
    collection: "Workroom",
    brand: "House of Sirka",
    price: 1890,
    salePrice: null,
    status: "published",
    featured: true,
    newArrival: false,
    bestSeller: true,
    description:
      "Sharp single-breasted blazer with a structured shoulder, satin lining, and office-to-evening finish.",
    shortDescription: "Structured single-breasted blazer.",
    image:
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80",
    ],
    rating: 4.7,
    reviews: 12,
    createdAt: "2026-02-25",
    metaTitle: "Amara Tailored Blazer | House of Sirka",
    metaDescription: "Shop the Amara tailored blazer from House of Sirka.",
    variants: [
      { id: "v-amara-s-black", size: "S", color: "Black", stock: 4, sku: "HOS-OUT-204-S-BLK" },
      { id: "v-amara-m-black", size: "M", color: "Black", stock: 6, sku: "HOS-OUT-204-M-BLK" },
      { id: "v-amara-l-ivory", size: "L", color: "Ivory", stock: 1, sku: "HOS-OUT-204-L-IVY" },
    ],
  },
  {
    id: "p-set-sira",
    name: "Sira Linen Co-ord Set",
    slug: "sira-linen-coord-set",
    sku: "HOS-SET-118",
    category: "Sets",
    collection: "Resort Sets",
    brand: "House of Sirka",
    price: 1190,
    salePrice: 990,
    status: "published",
    featured: true,
    newArrival: true,
    bestSeller: false,
    description:
      "Breathable linen-blend shirt and relaxed trouser set made for polished warm-weather styling.",
    shortDescription: "Linen-blend shirt and trouser set.",
    image:
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    ],
    rating: 4.6,
    reviews: 9,
    createdAt: "2026-04-01",
    metaTitle: "Sira Linen Co-ord Set | House of Sirka",
    metaDescription: "Shop the Sira linen co-ord set from House of Sirka.",
    variants: [
      { id: "v-sira-xs-sage", size: "XS", color: "Sage", stock: 3, sku: "HOS-SET-118-XS-SAG" },
      { id: "v-sira-s-sage", size: "S", color: "Sage", stock: 5, sku: "HOS-SET-118-S-SAG" },
      { id: "v-sira-m-sand", size: "M", color: "Sand", stock: 4, sku: "HOS-SET-118-M-SND" },
    ],
  },
  {
    id: "p-skirt-naledi",
    name: "Naledi Pleated Skirt",
    slug: "naledi-pleated-skirt",
    sku: "HOS-SKT-077",
    category: "Skirts",
    collection: "New Arrivals",
    brand: "House of Sirka",
    price: 820,
    salePrice: null,
    status: "published",
    featured: false,
    newArrival: true,
    bestSeller: false,
    description:
      "Fluid pleated midi skirt with a clean waistband and soft movement for day or evening wear.",
    shortDescription: "Fluid pleated midi skirt.",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    ],
    rating: 4.5,
    reviews: 7,
    createdAt: "2026-04-11",
    metaTitle: "Naledi Pleated Skirt | House of Sirka",
    metaDescription: "Shop the Naledi pleated skirt from House of Sirka.",
    variants: [
      { id: "v-naledi-s-rose", size: "S", color: "Rose", stock: 8, sku: "HOS-SKT-077-S-RSE" },
      { id: "v-naledi-m-navy", size: "M", color: "Navy", stock: 0, sku: "HOS-SKT-077-M-NVY" },
      { id: "v-naledi-l-navy", size: "L", color: "Navy", stock: 2, sku: "HOS-SKT-077-L-NVY" },
    ],
  },
  {
    id: "p-top-mira",
    name: "Mira Rib Knit Top",
    slug: "mira-rib-knit-top",
    sku: "HOS-TOP-042",
    category: "Tops",
    collection: "Essentials",
    brand: "House of Sirka",
    price: 540,
    salePrice: null,
    status: "published",
    featured: false,
    newArrival: false,
    bestSeller: true,
    description:
      "Soft rib knit top with a square neckline, close fit, and reliable layering weight.",
    shortDescription: "Square-neck rib knit top.",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    ],
    rating: 4.9,
    reviews: 26,
    createdAt: "2026-01-20",
    metaTitle: "Mira Rib Knit Top | House of Sirka",
    metaDescription: "Shop the Mira rib knit top from House of Sirka.",
    variants: [
      { id: "v-mira-xs-ivory", size: "XS", color: "Ivory", stock: 10, sku: "HOS-TOP-042-XS-IVY" },
      { id: "v-mira-s-black", size: "S", color: "Black", stock: 12, sku: "HOS-TOP-042-S-BLK" },
      { id: "v-mira-m-teal", size: "M", color: "Teal", stock: 7, sku: "HOS-TOP-042-M-TEL" },
    ],
  },
  {
    id: "p-trouser-nia",
    name: "Nia Wide Leg Trouser",
    slug: "nia-wide-leg-trouser",
    sku: "HOS-BTM-063",
    category: "Bottoms",
    collection: "Workroom",
    brand: "House of Sirka",
    price: 980,
    salePrice: null,
    status: "published",
    featured: true,
    newArrival: false,
    bestSeller: false,
    description:
      "High-waisted wide leg trouser with a tailored fall, side pockets, and soft front pleats.",
    shortDescription: "High-waisted wide leg trouser.",
    image:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=900&q=80",
    ],
    rating: 4.4,
    reviews: 6,
    createdAt: "2026-02-06",
    metaTitle: "Nia Wide Leg Trouser | House of Sirka",
    metaDescription: "Shop the Nia wide leg trouser from House of Sirka.",
    variants: [
      { id: "v-nia-s-stone", size: "S", color: "Stone", stock: 4, sku: "HOS-BTM-063-S-STN" },
      { id: "v-nia-m-black", size: "M", color: "Black", stock: 5, sku: "HOS-BTM-063-M-BLK" },
      { id: "v-nia-l-black", size: "L", color: "Black", stock: 1, sku: "HOS-BTM-063-L-BLK" },
    ],
  },
  {
    id: "p-coat-kalahari",
    name: "Kalahari Wrap Coat",
    slug: "kalahari-wrap-coat",
    sku: "HOS-OUT-301",
    category: "Outerwear",
    collection: "Winter Edit",
    brand: "House of Sirka",
    price: 2680,
    salePrice: 2290,
    status: "published",
    featured: true,
    newArrival: true,
    bestSeller: false,
    description:
      "Soft wrap coat with a generous collar, belted waist, and refined cold-weather silhouette.",
    shortDescription: "Belted wrap coat.",
    image:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80",
    ],
    rating: 4.7,
    reviews: 5,
    createdAt: "2026-04-15",
    metaTitle: "Kalahari Wrap Coat | House of Sirka",
    metaDescription: "Shop the Kalahari wrap coat from House of Sirka.",
    variants: [
      { id: "v-kalahari-s-sand", size: "S", color: "Sand", stock: 1, sku: "HOS-OUT-301-S-SND" },
      { id: "v-kalahari-m-stone", size: "M", color: "Stone", stock: 2, sku: "HOS-OUT-301-M-STN" },
      { id: "v-kalahari-l-black", size: "L", color: "Black", stock: 0, sku: "HOS-OUT-301-L-BLK" },
    ],
  },
  {
    id: "p-scarf-selma",
    name: "Selma Silk Scarf",
    slug: "selma-silk-scarf",
    sku: "HOS-ACC-009",
    category: "Accessories",
    collection: "Essentials",
    brand: "House of Sirka",
    price: 430,
    salePrice: null,
    status: "published",
    featured: false,
    newArrival: true,
    bestSeller: false,
    description:
      "Lightweight silk-feel scarf with a clean border print for styling hair, bags, and necklines.",
    shortDescription: "Border print silk-feel scarf.",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9f297d54f3f?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1506629905607-d9f297d54f3f?auto=format&fit=crop&w=900&q=80",
    ],
    rating: 4.3,
    reviews: 4,
    createdAt: "2026-04-05",
    metaTitle: "Selma Silk Scarf | House of Sirka",
    metaDescription: "Shop the Selma silk scarf from House of Sirka.",
    variants: [
      { id: "v-selma-os-ochre", size: "OS", color: "Ochre", stock: 9, sku: "HOS-ACC-009-OS-OCH" },
      { id: "v-selma-os-merlot", size: "OS", color: "Merlot", stock: 4, sku: "HOS-ACC-009-OS-MER" },
    ],
  },
];

const DEFAULT_COUPONS = [
  {
    id: "c-sirka10",
    code: "SIRKA10",
    discountType: "percentage",
    discountValue: 10,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 500,
    minOrderAmount: 800,
    freeShipping: false,
    status: "active",
    used: 0,
  },
  {
    id: "c-freeship",
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 0,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 300,
    minOrderAmount: 600,
    freeShipping: true,
    status: "active",
    used: 0,
  },
];

const DEFAULT_CUSTOMER = {
  firstName: "Guest",
  lastName: "Shopper",
  email: "guest@houseofsirka.local",
  phone: "",
  marketingOptIn: true,
  addresses: ["Windhoek, Namibia"],
  wishlist: [],
};

let state = loadState();
let filters = {
  search: "",
  category: "All",
  size: "All",
  color: "All",
  maxPrice: 3000,
  sort: "featured",
};
let selectedProductId = null;
let activeAdminTab = "dashboard";
let toastTimer = null;

const dom = {
  announcement: document.querySelector("#announcement"),
  hero: document.querySelector("#home"),
  heroTitle: document.querySelector("#heroTitle"),
  heroSubtitle: document.querySelector("#heroSubtitle"),
  footerCopy: document.querySelector("#footerCopy"),
  socialLinks: document.querySelector("#socialLinks"),
  collectionGrid: document.querySelector("#collectionGrid"),
  productGrid: document.querySelector("#productGrid"),
  resultCount: document.querySelector("#resultCount"),
  cartCount: document.querySelector("#cartCount"),
  cartDrawer: document.querySelector("#cartDrawer"),
  cartItems: document.querySelector("#cartItems"),
  cartSummary: document.querySelector("#cartSummary"),
  scrim: document.querySelector("#scrim"),
  productModal: document.querySelector("#productModal"),
  checkoutModal: document.querySelector("#checkoutModal"),
  toast: document.querySelector("#toast"),
  adminPanel: document.querySelector("#adminPanel"),
  roleSelect: document.querySelector("#roleSelect"),
  accountForm: document.querySelector("#accountForm"),
  addressForm: document.querySelector("#addressForm"),
  addressList: document.querySelector("#addressList"),
  accountOrders: document.querySelector("#accountOrders"),
  wishlistList: document.querySelector("#wishlistList"),
  trackingForm: document.querySelector("#trackingForm"),
  trackingResult: document.querySelector("#trackingResult"),
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        products: parsed.products || structuredClone(DEFAULT_PRODUCTS),
        coupons: parsed.coupons || structuredClone(DEFAULT_COUPONS),
        content: { ...DEFAULT_CONTENT, ...(parsed.content || {}) },
        customer: { ...DEFAULT_CUSTOMER, ...(parsed.customer || {}) },
        cart: parsed.cart || [],
        orders: parsed.orders || [],
        inventoryLogs: parsed.inventoryLogs || [],
        activeCoupon: parsed.activeCoupon || null,
        role: parsed.role || "Super Admin",
      };
    } catch (error) {
      console.warn("Resetting corrupted demo store data.", error);
    }
  }

  return {
    products: structuredClone(DEFAULT_PRODUCTS),
    coupons: structuredClone(DEFAULT_COUPONS),
    content: structuredClone(DEFAULT_CONTENT),
    customer: structuredClone(DEFAULT_CUSTOMER),
    cart: [],
    orders: [],
    inventoryLogs: [],
    activeCoupon: null,
    role: "Super Admin",
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  filters = {
    search: "",
    category: "All",
    size: "All",
    color: "All",
    maxPrice: 3000,
    sort: "featured",
  };
  activeAdminTab = "dashboard";
  selectedProductId = null;
  renderAll();
  showToast("Demo data restored.");
}

function money(amount) {
  return `N$${Number(amount || 0).toLocaleString("en-NA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function productPrice(product) {
  return product.salePrice || product.price;
}

function totalStock(product) {
  return product.variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0);
}

function cartReservedStock(variantId) {
  return state.cart
    .filter((item) => item.variantId === variantId)
    .reduce((sum, item) => sum + item.quantity, 0);
}

function findProduct(productId) {
  return state.products.find((product) => product.id === productId);
}

function findVariant(product, variantId) {
  return product?.variants.find((variant) => variant.id === variantId);
}

function publishedProducts() {
  return state.products.filter((product) => product.status === "published");
}

function categoryOptions() {
  return unique(state.products.map((product) => product.category));
}

function sizeOptions() {
  return unique(state.products.flatMap((product) => product.variants.map((variant) => variant.size)));
}

function colorOptions() {
  return unique(state.products.flatMap((product) => product.variants.map((variant) => variant.color)));
}

function canManage(moduleName, level = "Full") {
  const permission = ROLE_PERMISSIONS[state.role]?.[moduleName] || "No";
  if (permission === "Full") return true;
  if (level === "View") return permission !== "No";
  if (level === "Limited") return ["Limited", "Marketing", "Inventory", "Promotions", "Stock"].includes(permission);
  if (level === "Stock") return permission === "Stock" || permission === "Full";
  return false;
}

function guard(moduleName, level = "Full") {
  if (canManage(moduleName, level)) return true;
  showToast(`${state.role} does not have permission for that action.`);
  return false;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  toastTimer = window.setTimeout(() => {
    dom.toast.classList.remove("show");
  }, 2800);
}

function scrollToSection(sectionId) {
  document.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelectorAll(".main-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.route === sectionId);
  });
}

function renderAll() {
  renderContent();
  renderCollections();
  renderFilters();
  renderProducts();
  renderCart();
  renderAccount();
  renderTracking();
  renderAdmin();
  saveState();
}

function renderContent() {
  dom.announcement.textContent = state.content.announcement;
  dom.hero.style.backgroundImage = `url("${state.content.heroImage}")`;
  dom.heroTitle.textContent = state.content.heroTitle;
  dom.heroSubtitle.textContent = state.content.heroSubtitle;
  dom.footerCopy.textContent = state.content.footerCopy;
  dom.socialLinks.innerHTML = state.content.socialLinks
    .map((link) => `<a href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
    .join("");
  dom.roleSelect.value = state.role;
}

function renderCollections() {
  dom.collectionGrid.innerHTML = COLLECTIONS.map(
    (collection) => `
      <button type="button" class="collection-tile" data-action="collection-filter" data-category="${escapeAttr(collection.category)}">
        <img src="${escapeAttr(collection.image)}" alt="${escapeAttr(collection.name)} collection" loading="lazy" />
        <span>${escapeHtml(collection.name)}</span>
      </button>
    `,
  ).join("");
}

function renderFilters() {
  const categoryFilter = document.querySelector("#categoryFilter");
  const sizeFilter = document.querySelector("#sizeFilter");
  const colorFilter = document.querySelector("#colorFilter");
  const priceFilter = document.querySelector("#priceFilter");
  const searchInput = document.querySelector("#searchInput");
  const sortFilter = document.querySelector("#sortFilter");

  categoryFilter.innerHTML = ["All", ...categoryOptions()]
    .map((category) => `<option value="${escapeAttr(category)}">${escapeHtml(category)}</option>`)
    .join("");
  sizeFilter.innerHTML = ["All", ...sizeOptions()]
    .map((size) => `<option value="${escapeAttr(size)}">${escapeHtml(size)}</option>`)
    .join("");
  colorFilter.innerHTML = ["All", ...colorOptions()]
    .map((color) => `<option value="${escapeAttr(color)}">${escapeHtml(color)}</option>`)
    .join("");

  categoryFilter.value = filters.category;
  sizeFilter.value = filters.size;
  colorFilter.value = filters.color;
  priceFilter.value = String(filters.maxPrice);
  searchInput.value = filters.search;
  sortFilter.value = filters.sort;
  document.querySelector("#priceValue").textContent = money(filters.maxPrice);
}

function getFilteredProducts() {
  const search = filters.search.trim().toLowerCase();
  let products = publishedProducts().filter((product) => {
    const matchesSearch =
      !search ||
      [product.name, product.sku, product.category, product.collection, product.description]
        .join(" ")
        .toLowerCase()
        .includes(search);
    const matchesCategory = filters.category === "All" || product.category === filters.category;
    const matchesSize =
      filters.size === "All" || product.variants.some((variant) => variant.size === filters.size);
    const matchesColor =
      filters.color === "All" || product.variants.some((variant) => variant.color === filters.color);
    const matchesPrice = productPrice(product) <= Number(filters.maxPrice);
    return matchesSearch && matchesCategory && matchesSize && matchesColor && matchesPrice;
  });

  const sorters = {
    featured: (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      Number(b.bestSeller) - Number(a.bestSeller) ||
      productPrice(a) - productPrice(b),
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    "price-low": (a, b) => productPrice(a) - productPrice(b),
    "price-high": (a, b) => productPrice(b) - productPrice(a),
    popular: (a, b) => b.reviews - a.reviews,
  };

  return products.sort(sorters[filters.sort] || sorters.featured);
}

function renderProducts() {
  const products = getFilteredProducts();
  dom.resultCount.textContent = `${products.length} product${products.length === 1 ? "" : "s"}`;

  if (!products.length) {
    dom.productGrid.innerHTML = `<div class="empty-state">No products match these filters.</div>`;
    return;
  }

  dom.productGrid.innerHTML = products.map(renderProductCard).join("");
}

function renderProductCard(product) {
  const stock = totalStock(product);
  const stockClass = stock === 0 ? "out" : stock <= 3 ? "low" : "";
  const stockText = stock === 0 ? "Out of stock" : stock <= 3 ? `Low stock: ${stock}` : `${stock} in stock`;
  const colors = unique(product.variants.map((variant) => variant.color));
  const saved = state.customer.wishlist.includes(product.id);

  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" loading="lazy" />
        <span class="stock-badge ${stockClass}">${stockText}</span>
        <button type="button" class="wishlist-button" data-action="toggle-wishlist" data-product-id="${escapeAttr(product.id)}">
          ${saved ? "Saved" : "Save"}
        </button>
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span>${escapeHtml(product.category)}</span>
          <span>${escapeHtml(product.sku)}</span>
        </div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.shortDescription)}</p>
        <div class="variant-dots" aria-label="Available colors">
          ${colors
            .map(
              (color) =>
                `<span class="variant-dot" title="${escapeAttr(color)}" style="background:${COLOR_SWATCHES[color] || "#ddd"}"></span>`,
            )
            .join("")}
        </div>
        <div class="price-line">
          <span>${money(productPrice(product))}</span>
          ${product.salePrice ? `<del>${money(product.price)}</del>` : ""}
        </div>
        <div class="card-actions">
          <button type="button" class="primary-button" data-action="open-product" data-product-id="${escapeAttr(product.id)}">View</button>
          <button type="button" class="secondary-button" data-action="quick-add" data-product-id="${escapeAttr(product.id)}" ${stock === 0 ? "disabled" : ""}>Quick add</button>
        </div>
      </div>
    </article>
  `;
}

function openProduct(productId) {
  selectedProductId = productId;
  renderProductModal();
  openModal(dom.productModal);
}

function renderProductModal() {
  const product = findProduct(selectedProductId);
  if (!product) return;

  const firstAvailableVariant = product.variants.find((variant) => variant.stock > cartReservedStock(variant.id));
  const defaultVariantId = firstAvailableVariant?.id || product.variants[0]?.id || "";

  dom.productModal.innerHTML = `
    <div class="modal-shell">
      <div class="modal-image">
        <img src="${escapeAttr(product.images?.[0] || product.image)}" alt="${escapeAttr(product.name)}" />
      </div>
      <div class="modal-body">
        <div class="modal-head">
          <div>
            <p class="eyebrow">${escapeHtml(product.category)}</p>
            <h2>${escapeHtml(product.name)}</h2>
          </div>
          <button type="button" class="icon-button" data-action="close-overlays" aria-label="Close product">X</button>
        </div>
        <div class="price-line">
          <span>${money(productPrice(product))}</span>
          ${product.salePrice ? `<del>${money(product.price)}</del>` : ""}
        </div>
        <p>${escapeHtml(product.description)}</p>
        <div class="mini-list">
          <div class="mini-item">
            <strong><span>SKU</span><span>${escapeHtml(product.sku)}</span></strong>
            <span>Rating ${product.rating}/5 from ${product.reviews} review${product.reviews === 1 ? "" : "s"}</span>
          </div>
          <div class="mini-item">
            <strong><span>SEO title</span><span>${escapeHtml(product.metaTitle || product.name)}</span></strong>
            <span>${escapeHtml(product.metaDescription || "")}</span>
          </div>
        </div>
        <form id="productAddForm" class="panel-form">
          <label>
            Size and color
            <select name="variantId" required>
              ${product.variants
                .map((variant) => {
                  const available = Math.max(0, variant.stock - cartReservedStock(variant.id));
                  return `<option value="${escapeAttr(variant.id)}" ${variant.id === defaultVariantId ? "selected" : ""} ${available === 0 ? "disabled" : ""}>
                    ${escapeHtml(variant.size)} / ${escapeHtml(variant.color)} - ${available} available
                  </option>`;
                })
                .join("")}
            </select>
          </label>
          <label>
            Quantity
            <input type="number" name="quantity" min="1" value="1" required />
          </label>
          <div class="form-actions">
            <button type="submit" class="primary-button" ${!firstAvailableVariant ? "disabled" : ""}>Add to cart</button>
            <button type="button" class="secondary-button" data-action="toggle-wishlist" data-product-id="${escapeAttr(product.id)}">
              ${state.customer.wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function quickAdd(productId) {
  const product = findProduct(productId);
  const variant = product?.variants.find((item) => item.stock > cartReservedStock(item.id));
  if (!product || !variant) {
    showToast("This product is out of stock.");
    return;
  }
  addToCart(product.id, variant.id, 1);
}

function addToCart(productId, variantId, quantity) {
  const product = findProduct(productId);
  const variant = findVariant(product, variantId);
  if (!product || !variant) return;

  const requested = Number(quantity || 1);
  const existingQuantity = cartReservedStock(variantId);
  const available = variant.stock - existingQuantity;
  if (requested > available) {
    showToast(`Only ${available} available for ${product.name}.`);
    return;
  }

  const existing = state.cart.find((item) => item.variantId === variantId);
  if (existing) {
    existing.quantity += requested;
  } else {
    state.cart.push({
      id: uid("cart"),
      productId,
      variantId,
      name: product.name,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      image: product.image,
      unitPrice: productPrice(product),
      quantity: requested,
    });
  }

  renderAll();
  openCart();
  showToast(`${product.name} added to cart.`);
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  dom.cartCount.textContent = count;

  if (!state.cart.length) {
    dom.cartItems.innerHTML = `<div class="empty-state">Your cart is ready for the first piece.</div>`;
  } else {
    dom.cartItems.innerHTML = state.cart
      .map(
        (item) => `
          <div class="cart-line">
            <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" />
            <div class="cart-line-body">
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.size)} / ${escapeHtml(item.color)} / ${escapeHtml(item.sku)}</span>
              <span>${money(item.unitPrice)}</span>
              <div class="quantity-row">
                <button type="button" data-action="cart-decrease" data-cart-id="${escapeAttr(item.id)}" aria-label="Decrease quantity">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-action="cart-increase" data-cart-id="${escapeAttr(item.id)}" aria-label="Increase quantity">+</button>
                <button type="button" class="text-button" data-action="cart-remove" data-cart-id="${escapeAttr(item.id)}">Remove</button>
              </div>
            </div>
          </div>
        `,
      )
      .join("");
  }

  const summary = calculateCart();
  dom.cartSummary.innerHTML = `
    ${summary.couponMessage ? `<div class="mini-item">${escapeHtml(summary.couponMessage)}</div>` : ""}
    <div class="summary-row"><span>Subtotal</span><strong>${money(summary.subtotal)}</strong></div>
    <div class="summary-row"><span>Discount</span><strong>-${money(summary.discount)}</strong></div>
    <div class="summary-row"><span>Shipping</span><strong>${summary.shipping === 0 ? "Free" : money(summary.shipping)}</strong></div>
    <div class="summary-row"><span>Estimated tax</span><strong>${money(summary.tax)}</strong></div>
    <div class="summary-row total"><span>Total</span><strong>${money(summary.total)}</strong></div>
  `;
}

function calculateCart() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const coupon = getActiveCoupon();
  let discount = 0;
  let couponMessage = "";
  let freeShipping = subtotal >= 1500;

  if (coupon) {
    const valid = isCouponValid(coupon, subtotal);
    if (valid.ok) {
      discount =
        coupon.discountType === "percentage"
          ? subtotal * (Number(coupon.discountValue) / 100)
          : Number(coupon.discountValue || 0);
      freeShipping = freeShipping || Boolean(coupon.freeShipping);
      couponMessage = `${coupon.code} applied.`;
    } else {
      couponMessage = valid.message;
    }
  }

  discount = Math.min(discount, subtotal);
  const shipping = subtotal === 0 || freeShipping ? 0 : 95;
  const tax = Math.max(0, (subtotal - discount) * 0.15);
  const total = Math.max(0, subtotal - discount + shipping + tax);
  return { subtotal, discount, shipping, tax, total, coupon, couponMessage };
}

function getActiveCoupon() {
  if (!state.activeCoupon) return null;
  return state.coupons.find((coupon) => coupon.code.toUpperCase() === state.activeCoupon.toUpperCase());
}

function isCouponValid(coupon, subtotal) {
  if (!coupon) return { ok: false, message: "Coupon not found." };
  if (coupon.status !== "active") return { ok: false, message: `${coupon.code} is not active.` };
  if (coupon.startDate && todayIso() < coupon.startDate) return { ok: false, message: `${coupon.code} has not started.` };
  if (coupon.endDate && todayIso() > coupon.endDate) return { ok: false, message: `${coupon.code} has expired.` };
  if (Number(coupon.usageLimit || 0) > 0 && Number(coupon.used || 0) >= Number(coupon.usageLimit)) {
    return { ok: false, message: `${coupon.code} has reached its usage limit.` };
  }
  if (subtotal < Number(coupon.minOrderAmount || 0)) {
    return { ok: false, message: `${coupon.code} requires ${money(coupon.minOrderAmount)} minimum spend.` };
  }
  return { ok: true, message: "Coupon applied." };
}

function updateCartQuantity(cartId, delta) {
  const item = state.cart.find((cartItem) => cartItem.id === cartId);
  if (!item) return;
  const product = findProduct(item.productId);
  const variant = findVariant(product, item.variantId);
  const desired = item.quantity + delta;
  if (desired <= 0) {
    state.cart = state.cart.filter((cartItem) => cartItem.id !== cartId);
  } else if (desired <= variant.stock) {
    item.quantity = desired;
  } else {
    showToast("No more stock available for that variant.");
  }
  renderAll();
}

function openCart() {
  dom.cartDrawer.classList.add("open");
  dom.cartDrawer.setAttribute("aria-hidden", "false");
  dom.scrim.classList.add("open");
}

function closeOverlays() {
  dom.cartDrawer.classList.remove("open");
  dom.cartDrawer.setAttribute("aria-hidden", "true");
  dom.productModal.classList.remove("open");
  dom.productModal.setAttribute("aria-hidden", "true");
  dom.checkoutModal.classList.remove("open");
  dom.checkoutModal.setAttribute("aria-hidden", "true");
  dom.scrim.classList.remove("open");
}

function openModal(modal) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  dom.scrim.classList.add("open");
}

function openCheckout() {
  if (!state.cart.length) {
    showToast("Add at least one product before checkout.");
    return;
  }

  const summary = calculateCart();
  dom.checkoutModal.innerHTML = `
    <div class="checkout-shell">
      <div class="modal-head">
        <div>
          <p class="eyebrow">Secure checkout</p>
          <h2>Complete order</h2>
        </div>
        <button type="button" class="icon-button" data-action="close-overlays" aria-label="Close checkout">X</button>
      </div>
      <div class="checkout-grid">
        <form id="checkoutForm" class="panel-form">
          <div class="form-grid">
            <label>
              First name
              <input name="firstName" value="${escapeAttr(state.customer.firstName)}" required />
            </label>
            <label>
              Last name
              <input name="lastName" value="${escapeAttr(state.customer.lastName)}" required />
            </label>
            <label>
              Email
              <input type="email" name="email" value="${escapeAttr(state.customer.email)}" required />
            </label>
            <label>
              Phone
              <input name="phone" value="${escapeAttr(state.customer.phone)}" />
            </label>
            <label class="wide">
              Shipping address
              <input name="shippingAddress" value="${escapeAttr(state.customer.addresses[0] || "")}" required />
            </label>
            <label>
              Delivery option
              <select name="deliveryOption">
                <option>Windhoek delivery</option>
                <option>Courier delivery</option>
                <option>Pickup arrangement</option>
              </select>
            </label>
            <label>
              Payment method
              <select name="paymentMethod">
                <option>Card payment demo</option>
                <option>Bank transfer demo</option>
                <option>Pay on pickup</option>
              </select>
            </label>
            <label class="wide">
              Order notes
              <textarea name="notes" placeholder="Delivery notes, sizing questions, or gift note"></textarea>
            </label>
          </div>
          <button type="submit" class="primary-button">Place demo order</button>
        </form>
        <div class="checkout-summary">
          <h3>Order review</h3>
          <div class="mini-list">
            ${state.cart
              .map(
                (item) => `
                  <div class="mini-item">
                    <strong><span>${escapeHtml(item.name)}</span><span>${money(item.unitPrice * item.quantity)}</span></strong>
                    <span>${escapeHtml(item.quantity)} x ${escapeHtml(item.size)} / ${escapeHtml(item.color)}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
          <div class="cart-summary">
            <div class="summary-row"><span>Subtotal</span><strong>${money(summary.subtotal)}</strong></div>
            <div class="summary-row"><span>Discount</span><strong>-${money(summary.discount)}</strong></div>
            <div class="summary-row"><span>Shipping</span><strong>${summary.shipping === 0 ? "Free" : money(summary.shipping)}</strong></div>
            <div class="summary-row"><span>Estimated tax</span><strong>${money(summary.tax)}</strong></div>
            <div class="summary-row total"><span>Total</span><strong>${money(summary.total)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
  closeOverlays();
  openModal(dom.checkoutModal);
}

function placeOrder(form) {
  const summary = calculateCart();
  const coupon = summary.coupon;
  const formData = new FormData(form);
  const stockCheck = state.cart.every((item) => {
    const product = findProduct(item.productId);
    const variant = findVariant(product, item.variantId);
    return variant && variant.stock >= item.quantity;
  });

  if (!stockCheck) {
    showToast("A cart item no longer has enough stock.");
    renderAll();
    return;
  }

  const paymentMethod = formData.get("paymentMethod");
  const paid = paymentMethod !== "Pay on pickup";
  const orderNumber = `HOS-${1000 + state.orders.length + 1}`;

  const order = {
    id: uid("order"),
    orderNumber,
    customer: {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    },
    items: state.cart.map((item) => ({ ...item })),
    subtotal: summary.subtotal,
    discountAmount: summary.discount,
    shippingAmount: summary.shipping,
    taxAmount: summary.tax,
    totalAmount: summary.total,
    paymentStatus: paid ? "Paid" : "Pending",
    orderStatus: paid ? "Processing" : "Pending Payment",
    paymentMethod,
    transactionReference: paid ? `TX-${Date.now()}` : "",
    shippingAddress: formData.get("shippingAddress"),
    billingAddress: formData.get("shippingAddress"),
    deliveryOption: formData.get("deliveryOption"),
    notes: formData.get("notes"),
    internalNotes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    couponCode: coupon?.code || "",
  };

  order.items.forEach((item) => {
    const product = findProduct(item.productId);
    const variant = findVariant(product, item.variantId);
    const before = variant.stock;
    variant.stock = Math.max(0, variant.stock - item.quantity);
    state.inventoryLogs.unshift({
      id: uid("log"),
      productId: product.id,
      variantId: variant.id,
      changeType: "checkout",
      quantityBefore: before,
      quantityAfter: variant.stock,
      reason: `Order ${orderNumber}`,
      changedBy: "System",
      changedAt: new Date().toISOString(),
    });
  });

  if (coupon && isCouponValid(coupon, summary.subtotal).ok) {
    coupon.used = Number(coupon.used || 0) + 1;
  }

  state.customer = {
    ...state.customer,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    addresses: unique([formData.get("shippingAddress"), ...state.customer.addresses]),
  };
  state.orders.unshift(order);
  state.cart = [];
  state.activeCoupon = null;

  closeOverlays();
  renderAll();
  showToast(`Order ${orderNumber} created.`);
  dom.trackingResult.innerHTML = renderOrderTracking(order);
  scrollToSection("track");
}

function renderAccount() {
  const fields = dom.accountForm.elements;
  fields.firstName.value = state.customer.firstName;
  fields.lastName.value = state.customer.lastName;
  fields.email.value = state.customer.email;
  fields.phone.value = state.customer.phone;
  fields.marketingOptIn.checked = Boolean(state.customer.marketingOptIn);

  dom.addressList.innerHTML = state.customer.addresses.length
    ? `<div class="mini-list">${state.customer.addresses
        .map(
          (address, index) => `
            <div class="mini-item">
              <strong><span>${escapeHtml(address)}</span></strong>
              <button type="button" class="text-button" data-action="remove-address" data-index="${index}">Remove</button>
            </div>
          `,
        )
        .join("")}</div>`
    : `<div class="empty-state">No saved addresses yet.</div>`;

  dom.accountOrders.innerHTML = state.orders.length
    ? `<div class="mini-list">${state.orders
        .slice(0, 6)
        .map(
          (order) => `
            <div class="mini-item">
              <strong><span>${escapeHtml(order.orderNumber)}</span><span>${money(order.totalAmount)}</span></strong>
              <span>${escapeHtml(order.orderStatus)} / ${escapeHtml(order.paymentStatus)}</span>
              <button type="button" class="text-button" data-action="track-existing" data-order-number="${escapeAttr(order.orderNumber)}">Track</button>
            </div>
          `,
        )
        .join("")}</div>`
    : `<div class="empty-state">Orders placed at checkout appear here.</div>`;

  const wishlistProducts = state.customer.wishlist.map(findProduct).filter(Boolean);
  dom.wishlistList.innerHTML = wishlistProducts.length
    ? `<div class="mini-list">${wishlistProducts
        .map(
          (product) => `
            <div class="mini-item">
              <strong><span>${escapeHtml(product.name)}</span><span>${money(productPrice(product))}</span></strong>
              <span>${escapeHtml(product.category)}</span>
              <div class="status-actions">
                <button type="button" class="secondary-button" data-action="open-product" data-product-id="${escapeAttr(product.id)}">View</button>
                <button type="button" class="text-button" data-action="toggle-wishlist" data-product-id="${escapeAttr(product.id)}">Remove</button>
              </div>
            </div>
          `,
        )
        .join("")}</div>`
    : `<div class="empty-state">Saved wishlist items appear here.</div>`;
}

function saveProfile(form) {
  const data = new FormData(form);
  state.customer.firstName = data.get("firstName");
  state.customer.lastName = data.get("lastName");
  state.customer.email = data.get("email");
  state.customer.phone = data.get("phone");
  state.customer.marketingOptIn = data.has("marketingOptIn");
  renderAll();
  showToast("Profile saved.");
}

function toggleWishlist(productId) {
  const hasProduct = state.customer.wishlist.includes(productId);
  state.customer.wishlist = hasProduct
    ? state.customer.wishlist.filter((id) => id !== productId)
    : [...state.customer.wishlist, productId];
  renderAll();
  if (dom.productModal.classList.contains("open")) renderProductModal();
  showToast(hasProduct ? "Removed from wishlist." : "Added to wishlist.");
}

function renderTracking() {
  if (!state.orders.length) {
    dom.trackingResult.innerHTML = `<div class="empty-state">Place a demo order, then track it by order number.</div>`;
  }
}

function trackOrder(orderNumber) {
  const order = state.orders.find(
    (item) => item.orderNumber.toLowerCase() === String(orderNumber).trim().toLowerCase(),
  );
  dom.trackingResult.innerHTML = order
    ? renderOrderTracking(order)
    : `<div class="empty-state">No order found for ${escapeHtml(orderNumber)}.</div>`;
}

function renderOrderTracking(order) {
  const workflow = ["Pending Payment", "Processing", "Packed", "Shipped", "Delivered"];
  const activeIndex = Math.max(0, workflow.indexOf(order.orderStatus));

  return `
    <div class="panel-list">
      <h3>${escapeHtml(order.orderNumber)}</h3>
      <div class="mini-list">
        <div class="mini-item">
          <strong><span>Status</span><span>${escapeHtml(order.orderStatus)}</span></strong>
          <span>Payment: ${escapeHtml(order.paymentStatus)} / Total: ${money(order.totalAmount)}</span>
        </div>
        <div class="mini-item">
          <strong><span>Delivery</span><span>${escapeHtml(order.deliveryOption)}</span></strong>
          <span>${escapeHtml(order.shippingAddress)}</span>
        </div>
      </div>
      <div class="timeline">
        ${workflow
          .map(
            (status, index) => `
              <div class="timeline-step ${index <= activeIndex ? "active" : ""}">
                ${escapeHtml(status)}
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderAdmin() {
  document.querySelectorAll(".admin-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminTab === activeAdminTab);
  });

  const renderers = {
    dashboard: renderDashboardAdmin,
    products: renderProductsAdmin,
    content: renderContentAdmin,
    orders: renderOrdersAdmin,
    promotions: renderPromotionsAdmin,
    inventory: renderInventoryAdmin,
    reports: renderReportsAdmin,
  };
  dom.adminPanel.innerHTML = renderers[activeAdminTab]?.() || renderDashboardAdmin();
}

function renderDashboardAdmin() {
  const paidOrders = state.orders.filter((order) => order.paymentStatus === "Paid");
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const pendingOrders = state.orders.filter((order) => ["Pending Payment", "Processing", "Paid"].includes(order.orderStatus)).length;
  const completedOrders = state.orders.filter((order) => order.orderStatus === "Delivered").length;
  const stockAlerts = state.products.filter((product) => totalStock(product) <= 3).length;
  const customers = unique(state.orders.map((order) => order.customer.email)).length || 1;

  return `
    <div class="admin-actions">
      <span class="role-badge">${escapeHtml(state.role)}</span>
      <span>${renderPermissionSummary()}</span>
    </div>
    <div class="metric-grid">
      ${metricCard("Total sales", money(revenue))}
      ${metricCard("Orders", state.orders.length)}
      ${metricCard("Pending orders", pendingOrders)}
      ${metricCard("Completed orders", completedOrders)}
      ${metricCard("Stock alerts", stockAlerts)}
      ${metricCard("New customers", customers)}
      ${metricCard("Products live", publishedProducts().length)}
      ${metricCard("Active coupons", state.coupons.filter((coupon) => coupon.status === "active").length)}
    </div>
    <div class="table-shell">
      <table>
        <thead>
          <tr>
            <th>Quick link</th>
            <th>Purpose</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Products</td><td>Create products, assign categories, set visibility, and manage variants.</td><td><button class="secondary-button" data-admin-tab="products">Open</button></td></tr>
          <tr><td>Content</td><td>Update banners, announcement bar, footer copy, and social links.</td><td><button class="secondary-button" data-admin-tab="content">Open</button></td></tr>
          <tr><td>Orders</td><td>Update order status, payment status, and internal notes.</td><td><button class="secondary-button" data-admin-tab="orders">Open</button></td></tr>
          <tr><td>Inventory</td><td>Adjust variant stock and review stock movement logs.</td><td><button class="secondary-button" data-admin-tab="inventory">Open</button></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function metricCard(label, value) {
  return `<div class="metric-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function renderPermissionSummary() {
  const permissions = ROLE_PERMISSIONS[state.role];
  return `Products: ${permissions.products} / Orders: ${permissions.orders} / CMS: ${permissions.content} / Reports: ${permissions.reports}`;
}

function renderProductsAdmin() {
  const disabled = canManage("products") ? "" : "disabled";
  const stockOnly = ROLE_PERMISSIONS[state.role]?.products === "Stock";
  const canEdit = canManage("products") && !stockOnly;
  return `
    <h3>Product management</h3>
    <p>${canEdit ? "Create, edit, archive, and publish products." : "Your role can view products. Use Inventory for stock updates if permitted."}</p>
    <form id="productAdminForm" class="panel-form">
      <input type="hidden" name="id" />
      <div class="form-grid">
        <label>Name<input name="name" required ${canEdit ? "" : "disabled"} /></label>
        <label>SKU<input name="sku" required ${canEdit ? "" : "disabled"} /></label>
        <label>Brand<input name="brand" value="House of Sirka" ${canEdit ? "" : "disabled"} /></label>
        <label>Category<input name="category" list="categoryList" required ${canEdit ? "" : "disabled"} /></label>
        <label>Collection<input name="collection" required ${canEdit ? "" : "disabled"} /></label>
        <label>Status
          <select name="status" ${canEdit ? "" : "disabled"}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label>Price<input type="number" name="price" min="0" step="1" required ${canEdit ? "" : "disabled"} /></label>
        <label>Sale price<input type="number" name="salePrice" min="0" step="1" ${canEdit ? "" : "disabled"} /></label>
        <label>Image URL<input name="image" ${canEdit ? "" : "disabled"} /></label>
        <label class="checkbox-line"><input type="checkbox" name="featured" ${canEdit ? "" : "disabled"} /> Featured</label>
        <label class="checkbox-line"><input type="checkbox" name="newArrival" ${canEdit ? "" : "disabled"} /> New arrival</label>
        <label class="checkbox-line"><input type="checkbox" name="bestSeller" ${canEdit ? "" : "disabled"} /> Best seller</label>
        <label class="wide">Short description<input name="shortDescription" ${canEdit ? "" : "disabled"} /></label>
        <label class="wide">Description<textarea name="description" ${canEdit ? "" : "disabled"}></textarea></label>
        <label class="wide">Variants
          <textarea name="variants" placeholder="One per line: size, color, stock, sku" ${canEdit ? "" : "disabled"}></textarea>
        </label>
      </div>
      <datalist id="categoryList">
        ${categoryOptions().map((category) => `<option value="${escapeAttr(category)}"></option>`).join("")}
      </datalist>
      <div class="form-actions">
        <button type="submit" class="primary-button" ${disabled || (stockOnly ? "disabled" : "")}>Save product</button>
        <button type="button" class="secondary-button" data-action="clear-product-form">Clear</button>
      </div>
    </form>
    <div class="table-shell">
      <table>
        <thead>
          <tr>
            <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Flags</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.products
            .map(
              (product) => `
                <tr>
                  <td><strong>${escapeHtml(product.name)}</strong><br /><span>${escapeHtml(product.sku)}</span></td>
                  <td>${escapeHtml(product.category)}<br /><span>${escapeHtml(product.collection)}</span></td>
                  <td>${money(productPrice(product))}</td>
                  <td>${totalStock(product)}</td>
                  <td>${escapeHtml(product.status)}</td>
                  <td>${product.featured ? '<span class="flag-badge">Featured</span> ' : ""}${product.newArrival ? '<span class="flag-badge">New</span> ' : ""}${product.bestSeller ? '<span class="flag-badge">Best seller</span>' : ""}</td>
                  <td>
                    <div class="status-actions">
                      <button type="button" class="secondary-button" data-action="edit-product" data-product-id="${escapeAttr(product.id)}">Edit</button>
                      <button type="button" class="secondary-button" data-action="archive-product" data-product-id="${escapeAttr(product.id)}" ${canEdit ? "" : "disabled"}>Archive</button>
                    </div>
                  </td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function saveProduct(form) {
  if (!guard("products")) return;
  if (ROLE_PERMISSIONS[state.role]?.products === "Stock") {
    showToast("Use the Inventory module for stock-only access.");
    return;
  }

  const data = new FormData(form);
  const id = data.get("id") || uid("p");
  const variants = parseVariants(data.get("variants"), id);
  if (!variants.length) {
    showToast("Add at least one variant.");
    return;
  }

  const existing = state.products.find((product) => product.id === id);
  const product = {
    id,
    name: data.get("name"),
    slug: slugify(data.get("name")),
    sku: data.get("sku"),
    category: data.get("category"),
    collection: data.get("collection"),
    brand: data.get("brand") || "House of Sirka",
    price: Number(data.get("price") || 0),
    salePrice: data.get("salePrice") ? Number(data.get("salePrice")) : null,
    status: data.get("status") || "draft",
    featured: data.has("featured"),
    newArrival: data.has("newArrival"),
    bestSeller: data.has("bestSeller"),
    description: data.get("description"),
    shortDescription: data.get("shortDescription") || data.get("description").slice(0, 80),
    image: data.get("image") || "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    images: [data.get("image") || "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80"],
    rating: existing?.rating || 0,
    reviews: existing?.reviews || 0,
    createdAt: existing?.createdAt || todayIso(),
    metaTitle: `${data.get("name")} | House of Sirka`,
    metaDescription: data.get("shortDescription") || data.get("description").slice(0, 150),
    variants,
  };

  if (existing) {
    state.products = state.products.map((item) => (item.id === id ? product : item));
  } else {
    state.products.unshift(product);
  }

  form.reset();
  renderAll();
  activeAdminTab = "products";
  renderAdmin();
  showToast("Product saved.");
}

function parseVariants(raw, productId) {
  return String(raw || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [size = "OS", color = "Black", stock = "0", sku = ""] = line.split(",").map((part) => part.trim());
      return {
        id: `${productId}-v-${index}-${slugify(size)}-${slugify(color)}`,
        size,
        color,
        stock: Number(stock || 0),
        sku: sku || `${productId.toUpperCase()}-${size}-${color.slice(0, 3).toUpperCase()}`,
      };
    });
}

function fillProductForm(productId) {
  const product = findProduct(productId);
  const form = document.querySelector("#productAdminForm");
  if (!product || !form) return;
  const fields = form.elements;
  fields.id.value = product.id;
  fields.name.value = product.name;
  fields.sku.value = product.sku;
  fields.brand.value = product.brand;
  fields.category.value = product.category;
  fields.collection.value = product.collection;
  fields.status.value = product.status;
  fields.price.value = product.price;
  fields.salePrice.value = product.salePrice || "";
  fields.image.value = product.image;
  fields.featured.checked = product.featured;
  fields.newArrival.checked = product.newArrival;
  fields.bestSeller.checked = product.bestSeller;
  fields.shortDescription.value = product.shortDescription || "";
  fields.description.value = product.description || "";
  fields.variants.value = product.variants
    .map((variant) => `${variant.size}, ${variant.color}, ${variant.stock}, ${variant.sku}`)
    .join("\n");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function archiveProduct(productId) {
  if (!guard("products")) return;
  const product = findProduct(productId);
  if (!product) return;
  product.status = product.status === "archived" ? "published" : "archived";
  renderAll();
  activeAdminTab = "products";
  renderAdmin();
  showToast(product.status === "archived" ? "Product archived." : "Product restored.");
}

function renderContentAdmin() {
  const canEdit = canManage("content") || canManage("promotions");
  return `
    <h3>Content management</h3>
    <p>Update homepage banners, announcement bar, footer text, and social links.</p>
    <form id="contentAdminForm" class="panel-form">
      <div class="form-grid">
        <label class="wide">Announcement bar<input name="announcement" value="${escapeAttr(state.content.announcement)}" ${canEdit ? "" : "disabled"} /></label>
        <label>Hero title<input name="heroTitle" value="${escapeAttr(state.content.heroTitle)}" ${canEdit ? "" : "disabled"} /></label>
        <label class="wide">Hero subtitle<textarea name="heroSubtitle" ${canEdit ? "" : "disabled"}>${escapeHtml(state.content.heroSubtitle)}</textarea></label>
        <label class="wide">Hero image URL<input name="heroImage" value="${escapeAttr(state.content.heroImage)}" ${canEdit ? "" : "disabled"} /></label>
        <label class="wide">About copy<textarea name="about" ${canEdit ? "" : "disabled"}>${escapeHtml(state.content.about)}</textarea></label>
        <label class="wide">Footer copy<textarea name="footerCopy" ${canEdit ? "" : "disabled"}>${escapeHtml(state.content.footerCopy)}</textarea></label>
        <label class="wide">Social links
          <textarea name="socialLinks" placeholder="Label, URL" ${canEdit ? "" : "disabled"}>${escapeHtml(
            state.content.socialLinks.map((link) => `${link.label}, ${link.url}`).join("\n"),
          )}</textarea>
        </label>
      </div>
      <button type="submit" class="primary-button" ${canEdit ? "" : "disabled"}>Save content</button>
    </form>
  `;
}

function saveContent(form) {
  if (!(canManage("content", "Limited") || canManage("promotions", "Limited"))) {
    showToast(`${state.role} does not have permission to update CMS content.`);
    return;
  }
  const data = new FormData(form);
  state.content = {
    announcement: data.get("announcement"),
    heroTitle: data.get("heroTitle"),
    heroSubtitle: data.get("heroSubtitle"),
    heroImage: data.get("heroImage"),
    about: data.get("about"),
    footerCopy: data.get("footerCopy"),
    socialLinks: parseSocialLinks(data.get("socialLinks")),
  };
  renderAll();
  activeAdminTab = "content";
  renderAdmin();
  showToast("CMS content updated.");
}

function parseSocialLinks(raw) {
  return String(raw || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "Link", url = "#"] = line.split(",").map((part) => part.trim());
      return { label, url };
    });
}

function renderOrdersAdmin() {
  const canEdit = canManage("orders");
  return `
    <h3>Order management</h3>
    <p>Search, review, and update order statuses. Demo checkout orders appear here.</p>
    <div class="table-shell">
      <table>
        <thead>
          <tr>
            <th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Notes</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${
            state.orders.length
              ? state.orders
                  .map(
                    (order) => `
                      <tr>
                        <td><strong>${escapeHtml(order.orderNumber)}</strong><br /><span>${new Date(order.createdAt).toLocaleString()}</span></td>
                        <td>${escapeHtml(order.customer.firstName)} ${escapeHtml(order.customer.lastName)}<br /><span>${escapeHtml(order.customer.email)}</span></td>
                        <td>${order.items.map((item) => `${escapeHtml(item.name)} x ${item.quantity}`).join("<br />")}</td>
                        <td>${money(order.totalAmount)}</td>
                        <td>
                          <select data-order-field="orderStatus" data-order-id="${escapeAttr(order.id)}" ${canEdit ? "" : "disabled"}>
                            ${ORDER_STATUSES.map((status) => `<option ${status === order.orderStatus ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
                          </select>
                        </td>
                        <td>
                          <select data-order-field="paymentStatus" data-order-id="${escapeAttr(order.id)}" ${canEdit ? "" : "disabled"}>
                            ${PAYMENT_STATUSES.map((status) => `<option ${status === order.paymentStatus ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
                          </select>
                        </td>
                        <td><input data-order-field="internalNotes" data-order-id="${escapeAttr(order.id)}" value="${escapeAttr(order.internalNotes || "")}" ${canEdit ? "" : "disabled"} /></td>
                        <td><button type="button" class="secondary-button" data-action="save-order" data-order-id="${escapeAttr(order.id)}" ${canEdit ? "" : "disabled"}>Save</button></td>
                      </tr>
                    `,
                  )
                  .join("")
              : `<tr><td colspan="8">No orders yet. Place a demo order from checkout.</td></tr>`
          }
        </tbody>
      </table>
    </div>
  `;
}

function saveOrder(orderId) {
  if (!guard("orders")) return;
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  document.querySelectorAll(`[data-order-id="${CSS.escape(orderId)}"]`).forEach((field) => {
    const key = field.dataset.orderField;
    if (key) order[key] = field.value;
  });
  order.updatedAt = new Date().toISOString();
  renderAll();
  activeAdminTab = "orders";
  renderAdmin();
  showToast(`Order ${order.orderNumber} updated. Customer notification queued.`);
}

function renderPromotionsAdmin() {
  const canEdit = canManage("promotions");
  return `
    <h3>Promotions and coupons</h3>
    <form id="couponAdminForm" class="panel-form">
      <div class="form-grid">
        <label>Code<input name="code" required ${canEdit ? "" : "disabled"} /></label>
        <label>Discount type
          <select name="discountType" ${canEdit ? "" : "disabled"}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </label>
        <label>Discount value<input type="number" name="discountValue" min="0" step="1" value="10" ${canEdit ? "" : "disabled"} /></label>
        <label>Start date<input type="date" name="startDate" value="${todayIso()}" ${canEdit ? "" : "disabled"} /></label>
        <label>End date<input type="date" name="endDate" value="2026-12-31" ${canEdit ? "" : "disabled"} /></label>
        <label>Minimum order<input type="number" name="minOrderAmount" min="0" step="1" value="0" ${canEdit ? "" : "disabled"} /></label>
        <label>Usage limit<input type="number" name="usageLimit" min="0" step="1" value="100" ${canEdit ? "" : "disabled"} /></label>
        <label>Status
          <select name="status" ${canEdit ? "" : "disabled"}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label class="checkbox-line"><input type="checkbox" name="freeShipping" ${canEdit ? "" : "disabled"} /> Free shipping</label>
      </div>
      <button type="submit" class="primary-button" ${canEdit ? "" : "disabled"}>Create coupon</button>
    </form>
    <div class="table-shell">
      <table>
        <thead>
          <tr><th>Code</th><th>Discount</th><th>Dates</th><th>Minimum</th><th>Usage</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          ${state.coupons
            .map(
              (coupon) => `
                <tr>
                  <td><strong>${escapeHtml(coupon.code)}</strong>${coupon.freeShipping ? '<br /><span class="flag-badge">Free shipping</span>' : ""}</td>
                  <td>${coupon.discountType === "percentage" ? `${coupon.discountValue}%` : money(coupon.discountValue)}</td>
                  <td>${escapeHtml(coupon.startDate)} to ${escapeHtml(coupon.endDate)}</td>
                  <td>${money(coupon.minOrderAmount)}</td>
                  <td>${coupon.used || 0} / ${coupon.usageLimit || "Unlimited"}</td>
                  <td>${escapeHtml(coupon.status)}</td>
                  <td><button type="button" class="secondary-button" data-action="toggle-coupon" data-coupon-id="${escapeAttr(coupon.id)}" ${canEdit ? "" : "disabled"}>${coupon.status === "active" ? "Deactivate" : "Activate"}</button></td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function saveCoupon(form) {
  if (!guard("promotions")) return;
  const data = new FormData(form);
  const code = String(data.get("code")).trim().toUpperCase();
  if (state.coupons.some((coupon) => coupon.code === code)) {
    showToast("Coupon code already exists.");
    return;
  }
  state.coupons.unshift({
    id: uid("c"),
    code,
    discountType: data.get("discountType"),
    discountValue: Number(data.get("discountValue") || 0),
    startDate: data.get("startDate"),
    endDate: data.get("endDate"),
    usageLimit: Number(data.get("usageLimit") || 0),
    minOrderAmount: Number(data.get("minOrderAmount") || 0),
    freeShipping: data.has("freeShipping"),
    status: data.get("status"),
    used: 0,
  });
  form.reset();
  renderAll();
  activeAdminTab = "promotions";
  renderAdmin();
  showToast("Coupon created.");
}

function renderInventoryAdmin() {
  const canEdit = canManage("inventory") || canManage("products", "Stock");
  const lowStockRows = state.products.flatMap((product) =>
    product.variants
      .filter((variant) => Number(variant.stock) <= 3)
      .map((variant) => `${product.name} (${variant.size}/${variant.color})`),
  );

  return `
    <h3>Inventory management</h3>
    <div class="mini-list">
      <div class="mini-item">
        <strong><span>Low stock alerts</span><span>${lowStockRows.length}</span></strong>
        <span>${lowStockRows.length ? escapeHtml(lowStockRows.join(", ")) : "No low-stock variants."}</span>
      </div>
    </div>
    <div class="table-shell">
      <table>
        <thead>
          <tr><th>Product</th><th>Variant</th><th>SKU</th><th>Current stock</th><th>New stock</th><th>Reason</th><th>Action</th></tr>
        </thead>
        <tbody>
          ${state.products
            .flatMap((product) =>
              product.variants.map(
                (variant) => `
                  <tr>
                    <td>${escapeHtml(product.name)}</td>
                    <td>${escapeHtml(variant.size)} / ${escapeHtml(variant.color)}</td>
                    <td>${escapeHtml(variant.sku)}</td>
                    <td>${variant.stock}</td>
                    <td><input type="number" min="0" step="1" value="${variant.stock}" data-stock-field="quantity" data-product-id="${escapeAttr(product.id)}" data-variant-id="${escapeAttr(variant.id)}" ${canEdit ? "" : "disabled"} /></td>
                    <td><input value="Manual adjustment" data-stock-field="reason" data-product-id="${escapeAttr(product.id)}" data-variant-id="${escapeAttr(variant.id)}" ${canEdit ? "" : "disabled"} /></td>
                    <td><button type="button" class="secondary-button" data-action="save-stock" data-product-id="${escapeAttr(product.id)}" data-variant-id="${escapeAttr(variant.id)}" ${canEdit ? "" : "disabled"}>Save</button></td>
                  </tr>
                `,
              ),
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <h3>Stock adjustment logs</h3>
    <div class="table-shell">
      <table>
        <thead><tr><th>Date</th><th>Product</th><th>Variant</th><th>Before</th><th>After</th><th>Reason</th><th>Changed by</th></tr></thead>
        <tbody>
          ${
            state.inventoryLogs.length
              ? state.inventoryLogs
                  .slice(0, 20)
                  .map((log) => {
                    const product = findProduct(log.productId);
                    const variant = findVariant(product, log.variantId);
                    return `
                      <tr>
                        <td>${new Date(log.changedAt).toLocaleString()}</td>
                        <td>${escapeHtml(product?.name || "Deleted product")}</td>
                        <td>${escapeHtml(variant ? `${variant.size} / ${variant.color}` : "Deleted variant")}</td>
                        <td>${log.quantityBefore}</td>
                        <td>${log.quantityAfter}</td>
                        <td>${escapeHtml(log.reason)}</td>
                        <td>${escapeHtml(log.changedBy)}</td>
                      </tr>
                    `;
                  })
                  .join("")
              : `<tr><td colspan="7">No inventory movements yet.</td></tr>`
          }
        </tbody>
      </table>
    </div>
  `;
}

function saveStock(productId, variantId) {
  if (!(canManage("inventory", "Stock") || canManage("products", "Stock"))) {
    showToast(`${state.role} does not have permission to update stock.`);
    return;
  }
  const product = findProduct(productId);
  const variant = findVariant(product, variantId);
  if (!product || !variant) return;
  const quantityInput = document.querySelector(
    `[data-stock-field="quantity"][data-product-id="${CSS.escape(productId)}"][data-variant-id="${CSS.escape(variantId)}"]`,
  );
  const reasonInput = document.querySelector(
    `[data-stock-field="reason"][data-product-id="${CSS.escape(productId)}"][data-variant-id="${CSS.escape(variantId)}"]`,
  );
  const before = variant.stock;
  const after = Number(quantityInput.value || 0);
  variant.stock = after;
  state.inventoryLogs.unshift({
    id: uid("log"),
    productId,
    variantId,
    changeType: "manual",
    quantityBefore: before,
    quantityAfter: after,
    reason: reasonInput.value || "Manual adjustment",
    changedBy: state.role,
    changedAt: new Date().toISOString(),
  });
  renderAll();
  activeAdminTab = "inventory";
  renderAdmin();
  showToast("Stock updated.");
}

function renderReportsAdmin() {
  const revenue = state.orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const productSales = new Map();
  state.orders.forEach((order) => {
    order.items.forEach((item) => {
      productSales.set(item.name, (productSales.get(item.name) || 0) + item.quantity);
    });
  });
  const topProducts = [...productSales.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const orderStatuses = ORDER_STATUSES.map((status) => [
    status,
    state.orders.filter((order) => order.orderStatus === status).length,
  ]).filter(([, count]) => count > 0);

  return `
    <h3>Reports and analytics</h3>
    <div class="report-grid">
      <div class="report-card"><span>Revenue</span><strong>${money(revenue)}</strong></div>
      <div class="report-card"><span>Average order value</span><strong>${money(state.orders.length ? revenue / state.orders.length : 0)}</strong></div>
      <div class="report-card"><span>Coupon usage</span><strong>${state.coupons.reduce((sum, coupon) => sum + Number(coupon.used || 0), 0)}</strong></div>
      <div class="report-card"><span>Inventory units</span><strong>${state.products.reduce((sum, product) => sum + totalStock(product), 0)}</strong></div>
      <div class="report-card"><span>Customers</span><strong>${unique(state.orders.map((order) => order.customer.email)).length || 1}</strong></div>
      <div class="report-card"><span>Published products</span><strong>${publishedProducts().length}</strong></div>
    </div>
    <div class="table-shell">
      <table>
        <thead><tr><th>Report</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td>Top selling products</td><td>${topProducts.length ? topProducts.map(([name, qty]) => `${escapeHtml(name)} (${qty})`).join("<br />") : "No sales yet."}</td></tr>
          <tr><td>Orders by status</td><td>${orderStatuses.length ? orderStatuses.map(([status, qty]) => `${escapeHtml(status)}: ${qty}`).join("<br />") : "No orders yet."}</td></tr>
          <tr><td>Low stock products</td><td>${state.products.filter((product) => totalStock(product) <= 3).map((product) => escapeHtml(product.name)).join("<br />") || "No low-stock products."}</td></tr>
        </tbody>
      </table>
    </div>
    <h3>Role permissions matrix</h3>
    <div class="table-shell">
      <table>
        <thead><tr><th>Role</th><th>Products</th><th>Orders</th><th>CMS Content</th><th>Customers</th><th>Reports</th><th>Settings</th></tr></thead>
        <tbody>
          ${Object.entries(ROLE_PERMISSIONS)
            .map(
              ([role, perms]) => `
                <tr>
                  <td>${escapeHtml(role)}</td>
                  <td>${escapeHtml(perms.products)}</td>
                  <td>${escapeHtml(perms.orders)}</td>
                  <td>${escapeHtml(perms.content)}</td>
                  <td>${escapeHtml(perms.customers)}</td>
                  <td>${escapeHtml(perms.reports)}</td>
                  <td>${escapeHtml(perms.settings)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.dataset.route) {
    event.preventDefault();
    scrollToSection(target.dataset.route);
  }

  if (target.dataset.adminTab) {
    activeAdminTab = target.dataset.adminTab;
    renderAdmin();
  }

  const action = target.dataset.action;
  if (!action) return;

  const actions = {
    "open-cart": openCart,
    "close-cart": closeOverlays,
    "close-overlays": closeOverlays,
    "open-product": () => openProduct(target.dataset.productId),
    "quick-add": () => quickAdd(target.dataset.productId),
    "toggle-wishlist": () => toggleWishlist(target.dataset.productId),
    "cart-decrease": () => updateCartQuantity(target.dataset.cartId, -1),
    "cart-increase": () => updateCartQuantity(target.dataset.cartId, 1),
    "cart-remove": () => {
      state.cart = state.cart.filter((item) => item.id !== target.dataset.cartId);
      renderAll();
    },
    "start-checkout": openCheckout,
    "reset-store": resetDemoData,
    "collection-filter": () => {
      filters.category = target.dataset.category || "All";
      renderFilters();
      renderProducts();
      scrollToSection("shop");
    },
    "remove-address": () => {
      state.customer.addresses.splice(Number(target.dataset.index), 1);
      renderAll();
      showToast("Address removed.");
    },
    "track-existing": () => {
      trackOrder(target.dataset.orderNumber);
      scrollToSection("track");
    },
    "clear-product-form": () => document.querySelector("#productAdminForm")?.reset(),
    "edit-product": () => fillProductForm(target.dataset.productId),
    "archive-product": () => archiveProduct(target.dataset.productId),
    "save-order": () => saveOrder(target.dataset.orderId),
    "toggle-coupon": () => {
      if (!guard("promotions")) return;
      const coupon = state.coupons.find((item) => item.id === target.dataset.couponId);
      if (coupon) coupon.status = coupon.status === "active" ? "inactive" : "active";
      renderAll();
      activeAdminTab = "promotions";
      renderAdmin();
      showToast("Coupon status updated.");
    },
    "save-stock": () => saveStock(target.dataset.productId, target.dataset.variantId),
  };

  actions[action]?.();
});

function handleFilterChange(event) {
  const field = event.target;
  if (field.id === "searchInput") filters.search = field.value;
  if (field.id === "categoryFilter") filters.category = field.value;
  if (field.id === "sizeFilter") filters.size = field.value;
  if (field.id === "colorFilter") filters.color = field.value;
  if (field.id === "priceFilter") {
    filters.maxPrice = Number(field.value);
    document.querySelector("#priceValue").textContent = money(filters.maxPrice);
  }
  if (field.id === "sortFilter") filters.sort = field.value;
  renderProducts();
}

document.querySelector("#filters").addEventListener("input", handleFilterChange);
document.querySelector("#filters").addEventListener("change", handleFilterChange);

document.querySelector("#couponForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const code = String(formData.get("coupon") || "").trim().toUpperCase();
  const coupon = state.coupons.find((item) => item.code === code);
  const summary = calculateCart();
  const valid = isCouponValid(coupon, summary.subtotal);
  if (!valid.ok) {
    showToast(valid.message);
    return;
  }
  state.activeCoupon = code;
  event.currentTarget.reset();
  renderAll();
  showToast(`${code} applied.`);
});

dom.accountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveProfile(event.currentTarget);
});

dom.addressForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const address = String(formData.get("address") || "").trim();
  if (address) {
    state.customer.addresses = unique([address, ...state.customer.addresses]);
    event.currentTarget.reset();
    renderAll();
    showToast("Address saved.");
  }
});

dom.trackingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  trackOrder(formData.get("orderNumber"));
});

dom.productModal.addEventListener("submit", (event) => {
  if (event.target.id !== "productAddForm") return;
  event.preventDefault();
  const data = new FormData(event.target);
  closeOverlays();
  addToCart(selectedProductId, data.get("variantId"), Number(data.get("quantity")));
});

dom.checkoutModal.addEventListener("submit", (event) => {
  if (event.target.id !== "checkoutForm") return;
  event.preventDefault();
  placeOrder(event.target);
});

dom.adminPanel.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "productAdminForm") saveProduct(event.target);
  if (event.target.id === "contentAdminForm") saveContent(event.target);
  if (event.target.id === "couponAdminForm") saveCoupon(event.target);
});

dom.roleSelect.addEventListener("change", (event) => {
  state.role = event.target.value;
  renderAll();
  showToast(`Role changed to ${state.role}.`);
});

dom.scrim.addEventListener("click", closeOverlays);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeOverlays();
});

renderAll();
