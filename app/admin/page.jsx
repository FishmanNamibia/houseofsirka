"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ArrowLeft,
  BarChart3,
  Bell,
  Boxes,
  Check,
  CreditCard,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  LogIn,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Settings,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import {
  createSeedPromotions,
  evaluatePromotion,
  normalizePromotions,
  promotionTargetLabel,
  PROMOTION_SCOPES,
  PROMOTION_TYPES,
} from "@/lib/promotions";

const STORAGE_KEY = "house-of-sirka-next-store";
const AUTH_KEY = "house-of-sirka-admin-auth";
const ADMIN_EMAIL = "admin@houseofsirka.local";
const ADMIN_PASSWORD = "sirka-admin";

const roles = [
  "Super Admin",
  "Admin",
  "Content Manager",
  "Order Manager",
  "Inventory Manager",
  "Marketing Manager",
];

const permissions = {
  "Super Admin": ["dashboard", "products", "content", "orders", "customers", "promotions", "inventory", "reports", "settings"],
  Admin: ["dashboard", "products", "content", "orders", "customers", "promotions", "inventory", "reports", "settings"],
  "Content Manager": ["dashboard", "content", "reports"],
  "Order Manager": ["dashboard", "orders", "customers", "reports"],
  "Inventory Manager": ["dashboard", "inventory", "reports"],
  "Marketing Manager": ["dashboard", "content", "customers", "promotions", "reports"],
};

const adminTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "content", label: "Content", icon: ImageIcon },
  { id: "orders", label: "Orders", icon: Truck },
  { id: "customers", label: "Customers", icon: Users },
  { id: "promotions", label: "Promotions", icon: Tag },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const fallbackStore = {
  products: [
    {
      id: "p-liora",
      name: "Liora Satin Midi Dress",
      sku: "HOS-DRS-101",
      category: "Dresses",
      collection: "Evening Edit",
      price: 1490,
      salePrice: 1290,
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1100&q=82",
      description: "Bias-cut satin midi dress with a soft evening drape.",
      tags: ["Featured", "Best seller"],
      rating: 4.8,
      createdAt: "2026-04-02",
      status: "Published",
      variants: [
        { id: "v-liora-s-merlot", size: "S", color: "Merlot", stock: 5 },
        { id: "v-liora-m-merlot", size: "M", color: "Merlot", stock: 2 },
      ],
    },
    {
      id: "p-amara",
      name: "Amara Tailored Blazer",
      sku: "HOS-OUT-204",
      category: "Outerwear",
      collection: "Workroom",
      price: 1890,
      salePrice: null,
      image:
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1100&q=82",
      description: "Single-breasted blazer with a structured shoulder and satin lining.",
      tags: ["Featured", "Tailored"],
      rating: 4.7,
      createdAt: "2026-03-20",
      status: "Published",
      variants: [
        { id: "v-amara-s-black", size: "S", color: "Black", stock: 4 },
        { id: "v-amara-m-black", size: "M", color: "Black", stock: 6 },
      ],
    },
  ],
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
    storeAddress: "Windhoek, Namibia",
    currency: "N$",
    locale: "en-NA",
    taxRate: 15,
    deliveryFee: 95,
    freeDeliveryThreshold: 1500,
    deliveryAreas: "Windhoek, Swakopmund, Walvis Bay",
    deliveryOptions: "Windhoek delivery\nCourier delivery\nPickup arrangement",
    defaultCity: "Windhoek",
    orderPrefix: "HOS",
    orderStatuses: "Pending Payment\nProcessing\nPacked\nShipped\nDelivered\nCancelled\nRefunded",
    lowStockThreshold: 2,
    paymentMethods: "Online card payment\nEWallet transfer\nEFT bank transfer\nPay upon delivery",
    proofRequiredMethods: "EWallet transfer\nEFT bank transfer",
    autoConfirmMethods: "Online card payment",
    bankName: "First National Bank Namibia",
    bankAccountName: "House of Sirka",
    bankAccountNumber: "",
    bankBranchCode: "",
    bankReference: "Use your order number as reference",
    ewalletProvider: "FNB EWallet",
    ewalletNumber: "+264 81 000 0000",
    ewalletInstructions: "Send to the number above and upload proof of payment.",
    whatsappNumber: "+264810000000",
    whatsappMessage: "Hi House of Sirka, I'd like to enquire about my order.",
    supportEmail: "support@houseofsirka.local",
    notificationEmail: "orders@houseofsirka.local",
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    // ── Email service ──
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
    // ── Online payment gateway ──
    paymentGateway: "stripe",
    gatewayMode: "sandbox",
    gatewayPublicKey: "pk_test_51Demo00000000000000000000000000000000000000000000",
    gatewaySecretKey: "sk_test_51Demo00000000000000000000000000000000000000000000",
    gatewayWebhookSecret: "whsec_demo000000000000000000000000000000",
    gatewayMerchantId: "",
    gatewayExtraConfig: '{"paymentMethodTypes": ["card"], "currency": "nad"}',
    maintenanceMode: false,
  },
  content: {
    announcement: "A cheerful atelier edit: free Windhoek delivery over N$1,500",
    heroTitle: "House of Sirka",
    heroBadge: "Classical boutique, bright mood",
    heroSubtitle:
      "A graceful online boutique for dresses, tailoring, and soft statement pieces with an old-world heart and a bright modern pulse.",
    heroImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=84",
    heroCtaPrimary: "Shop the salon",
    heroCtaSecondary: "View collections",
    fittingNoteTitle: "Fitting note",
    fittingNoteText: "Soft dresses, fine tailoring, and occasion pieces arranged for calm browsing.",
    heroSecondaryImage:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=82",
    heroSecondaryLabel: "Evening edit",
    heroSecondaryBadge: "Sunny classic",
    campaignTitle: "The Garden Salon",
    campaignCopy:
      "Classical silhouettes, sunlit color, and pieces arranged like a private fitting room rather than a warehouse shelf.",
    catalogEyebrow: "Boutique rail",
    catalogTitle: "Pieces with presence",
    catalogCopy: "A brighter product room with enough structure for shopping and enough warmth to feel personal.",
    collectionsEyebrow: "Collections",
    collection1Title: "Evening Edit",
    collection1Category: "Dresses",
    collection1Image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=82",
    collection2Title: "Workroom",
    collection2Category: "Outerwear",
    collection2Image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=82",
    collection3Title: "Resort Sets",
    collection3Category: "Sets",
    collection3Image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82",
    collection4Title: "Essentials",
    collection4Category: "Tops",
    collection4Image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=82",
    accountEyebrow: "Customer",
    accountTitle: "Account and order tracking",
    accountCopy: "Log in with your email to view your orders, track payment status, and manage your wishlist.",
    footerTagline: "Classical silhouettes, cheerful color, and a gentler way to shop online.",
  },
};

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function splitLines(value) {
  return String(value || "").split("\n").map((s) => s.trim()).filter(Boolean);
}

function money(value, currency = "N$", locale = "en-NA") {
  return `${currency}${Number(value || 0).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function productPrice(product) {
  return product.salePrice || product.price;
}

function totalStock(product) {
  return product.variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0);
}

function stripNulls(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v != null) out[k] = v;
  }
  return out;
}

function normalizeStore(store) {
  return {
    ...fallbackStore,
    ...store,
    customers: store.customers || [],
    promotions: normalizePromotions(store.promotions),
    settings: {
      ...fallbackStore.settings,
      ...stripNulls(store.settings),
    },
    content: {
      ...fallbackStore.content,
      ...stripNulls(store.content),
    },
  };
}

function cleanPhone(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function createPromotionDraft(promotion = {}) {
  return {
    id: promotion.id || "",
    name: promotion.name || "",
    code: promotion.code || "",
    type: promotion.type || "percentage",
    value: promotion.type === "free-shipping" ? "0" : String(promotion.value ?? 10),
    minSubtotal: String(promotion.minSubtotal ?? 0),
    scope: promotion.scope || "all",
    scopeValue: promotion.scopeValue || "",
    startsAt: promotion.startsAt || "",
    endsAt: promotion.endsAt || "",
    usageLimit: String(promotion.usageLimit ?? 0),
    status: promotion.status || "active",
  };
}

export default function AdminPage() {
  const [store, setStore] = useState(fallbackStore);
  const [hydrated, setHydrated] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState("dashboard");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [promotionDraft, setPromotionDraft] = useState(createPromotionDraft());

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const session = window.sessionStorage.getItem(AUTH_KEY);

    if (saved) {
      try {
        setStore(normalizeStore(JSON.parse(saved)));
      } catch {
        setStore(fallbackStore);
      }
    }

    setAuthenticated(session === "true");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const json = JSON.stringify(store);
    try {
      window.localStorage.setItem(STORAGE_KEY, json);
    } catch {
      const lite = JSON.parse(json);
      (lite.products || []).forEach((p) => {
        if (p.image && p.image.length > 2048) p.image = "";
        (p.variants || []).forEach((v) => { if (v.image && v.image.length > 2048) v.image = ""; });
      });
      (lite.orders || []).forEach((o) => {
        if (o.proofOfPayment?.dataUrl && o.proofOfPayment.dataUrl.length > 2048) {
          o.proofOfPayment = { ...o.proofOfPayment, dataUrl: "(too large)" };
        }
      });
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lite));
      } catch {
        console.error("LocalStorage quota exceeded even after trimming.");
      }
    }
  }, [hydrated, store]);

  useEffect(() => {
    function onStorage(event) {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          setStore(normalizeStore(JSON.parse(event.newValue)));
        } catch { /* ignore bad data */ }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const activePermissions = permissions[store.role] || permissions.Admin;
  const cartSummary = useMemo(() => {
    return evaluatePromotion({
      cart: store.cart,
      couponCode: store.couponCode,
      promotions: store.promotions,
      products: store.products,
    });
  }, [store.cart, store.couponCode, store.products, store.promotions]);

  function show(message) {
    setNotice(message);
  }

  function setStorePatch(patch) {
    setStore((current) => ({ ...current, ...patch }));
  }

  function updateProduct(productId, updater) {
    setStore((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === productId ? updater(product) : product,
      ),
    }));
  }

  function login(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(AUTH_KEY, "true");
      setAuthenticated(true);
      setError("");
      show("Welcome to the admin CMS.");
      return;
    }

    setError("Use the demo admin credentials shown below.");
  }

  function logout() {
    window.sessionStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
    setActiveAdminTab("dashboard");
  }

  function saveSettings(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setStorePatch({
      settings: {
        storeName: form.get("storeName"),
        storeEmail: form.get("storeEmail"),
        storePhone: form.get("storePhone"),
        storeAddress: form.get("storeAddress"),
        currency: form.get("currency"),
        locale: form.get("locale"),
        taxRate: Number(form.get("taxRate") || 15),
        deliveryFee: Number(form.get("deliveryFee") || 95),
        freeDeliveryThreshold: Number(form.get("freeDeliveryThreshold") || 1500),
        deliveryAreas: form.get("deliveryAreas"),
        deliveryOptions: form.get("deliveryOptions"),
        defaultCity: form.get("defaultCity"),
        orderPrefix: form.get("orderPrefix"),
        orderStatuses: form.get("orderStatuses"),
        lowStockThreshold: Number(form.get("lowStockThreshold") || 2),
        paymentMethods: form.get("paymentMethods"),
        proofRequiredMethods: form.get("proofRequiredMethods"),
        autoConfirmMethods: form.get("autoConfirmMethods"),
        bankName: form.get("bankName"),
        bankAccountName: form.get("bankAccountName"),
        bankAccountNumber: form.get("bankAccountNumber"),
        bankBranchCode: form.get("bankBranchCode"),
        bankReference: form.get("bankReference"),
        ewalletProvider: form.get("ewalletProvider"),
        ewalletNumber: form.get("ewalletNumber"),
        ewalletInstructions: form.get("ewalletInstructions"),
        whatsappNumber: form.get("whatsappNumber"),
        whatsappMessage: form.get("whatsappMessage"),
        supportEmail: form.get("supportEmail"),
        notificationEmail: form.get("notificationEmail"),
        instagramUrl: form.get("instagramUrl"),
        facebookUrl: form.get("facebookUrl"),
        tiktokUrl: form.get("tiktokUrl"),
        whatsappApiUrl: form.get("whatsappApiUrl") || "",
        whatsappApiToken: form.get("whatsappApiToken") || "",
        // email service
        emailProvider: form.get("emailProvider"),
        smtpHost: form.get("smtpHost"),
        smtpPort: form.get("smtpPort"),
        smtpUser: form.get("smtpUser"),
        smtpPass: form.get("smtpPass"),
        smtpEncryption: form.get("smtpEncryption"),
        emailApiKey: form.get("emailApiKey"),
        emailFromAddress: form.get("emailFromAddress"),
        emailFromName: form.get("emailFromName"),
        emailReplyTo: form.get("emailReplyTo"),
        sendOrderConfirmation: !!form.get("sendOrderConfirmation"),
        sendShippingUpdates: !!form.get("sendShippingUpdates"),
        // payment gateway
        paymentGateway: form.get("paymentGateway"),
        gatewayMode: form.get("gatewayMode"),
        gatewayPublicKey: form.get("gatewayPublicKey"),
        gatewaySecretKey: form.get("gatewaySecretKey"),
        gatewayWebhookSecret: form.get("gatewayWebhookSecret"),
        gatewayMerchantId: form.get("gatewayMerchantId"),
        gatewayExtraConfig: form.get("gatewayExtraConfig"),
        maintenanceMode: !!form.get("maintenanceMode"),
      },
    });
    show("Settings saved.");
  }

  function resetStore() {
    if (!window.confirm("Reset all store data to defaults? This cannot be undone.")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setStore(fallbackStore);
    show("Store data reset to defaults.");
  }

  function saveContent(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setStorePatch({
      content: {
        announcement: form.get("announcement"),
        heroTitle: form.get("heroTitle"),
        heroBadge: form.get("heroBadge"),
        heroSubtitle: form.get("heroSubtitle"),
        heroImage: form.get("heroImage"),
        heroCtaPrimary: form.get("heroCtaPrimary"),
        heroCtaSecondary: form.get("heroCtaSecondary"),
        fittingNoteTitle: form.get("fittingNoteTitle"),
        fittingNoteText: form.get("fittingNoteText"),
        heroSecondaryImage: form.get("heroSecondaryImage"),
        heroSecondaryLabel: form.get("heroSecondaryLabel"),
        heroSecondaryBadge: form.get("heroSecondaryBadge"),
        campaignTitle: form.get("campaignTitle"),
        campaignCopy: form.get("campaignCopy"),
        catalogEyebrow: form.get("catalogEyebrow"),
        catalogTitle: form.get("catalogTitle"),
        catalogCopy: form.get("catalogCopy"),
        collectionsEyebrow: form.get("collectionsEyebrow"),
        collection1Title: form.get("collection1Title"),
        collection1Category: form.get("collection1Category"),
        collection1Image: form.get("collection1Image"),
        collection2Title: form.get("collection2Title"),
        collection2Category: form.get("collection2Category"),
        collection2Image: form.get("collection2Image"),
        collection3Title: form.get("collection3Title"),
        collection3Category: form.get("collection3Category"),
        collection3Image: form.get("collection3Image"),
        collection4Title: form.get("collection4Title"),
        collection4Category: form.get("collection4Category"),
        collection4Image: form.get("collection4Image"),
        accountEyebrow: form.get("accountEyebrow"),
        accountTitle: form.get("accountTitle"),
        accountCopy: form.get("accountCopy"),
        footerTagline: form.get("footerTagline"),
      },
    });
    show("Content updated.");
  }

  function savePromotion(event) {
    event.preventDefault();

    const draft = {
      ...promotionDraft,
      code: promotionDraft.code.trim().toUpperCase(),
      name: promotionDraft.name.trim(),
      scopeValue: promotionDraft.scopeValue.trim(),
    };

    if (!draft.name || !draft.code) {
      show("Promotion name and code are required.");
      return;
    }

    if (draft.scope !== "all" && !draft.scopeValue) {
      show("Add a target value for category, collection, or product promotions.");
      return;
    }

    const codeExists = store.promotions.some(
      (promotion) => promotion.code === draft.code && promotion.id !== draft.id,
    );
    if (codeExists) {
      show("That promotion code already exists.");
      return;
    }

    const promotion = {
      id: draft.id || uid("promo"),
      name: draft.name,
      code: draft.code,
      type: draft.type,
      value: draft.type === "free-shipping" ? 0 : Number(draft.value || 0),
      minSubtotal: Number(draft.minSubtotal || 0),
      scope: draft.scope,
      scopeValue: draft.scope === "all" ? "" : draft.scopeValue,
      startsAt: draft.startsAt,
      endsAt: draft.endsAt,
      usageLimit: Number(draft.usageLimit || 0),
      usageCount: draft.id
        ? store.promotions.find((item) => item.id === draft.id)?.usageCount || 0
        : 0,
      status: draft.status,
    };

    setStore((current) => ({
      ...current,
      promotions: current.promotions.some((item) => item.id === promotion.id)
        ? current.promotions.map((item) => (item.id === promotion.id ? promotion : item))
        : [promotion, ...current.promotions],
    }));
    setPromotionDraft(createPromotionDraft());
    show(draft.id ? "Promotion updated." : "Promotion created.");
  }

  function editPromotion(promotion) {
    setPromotionDraft(createPromotionDraft(promotion));
  }

  function togglePromotionStatus(promotionId) {
    setStore((current) => ({
      ...current,
      promotions: current.promotions.map((promotion) =>
        promotion.id === promotionId
          ? {
              ...promotion,
              status: promotion.status === "active" ? "inactive" : "active",
            }
          : promotion,
      ),
    }));
    show("Promotion status updated.");
  }

  function deletePromotion(promotionId) {
    setStore((current) => ({
      ...current,
      promotions: current.promotions.filter((promotion) => promotion.id !== promotionId),
    }));
    if (promotionDraft.id === promotionId) {
      setPromotionDraft(createPromotionDraft());
    }
    show("Promotion removed.");
  }

  async function addProduct(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const imageFile = form.get("imageFile");
    const uploadedImage =
      imageFile instanceof File && imageFile.size > 0
        ? await fileToDataUrl(imageFile)
        : "";
    const product = {
      id: uid("p"),
      name: form.get("name"),
      sku: form.get("sku"),
      category: form.get("category"),
      collection: form.get("collection"),
      price: Number(form.get("price") || 0),
      salePrice: form.get("salePrice") ? Number(form.get("salePrice")) : null,
      image:
        uploadedImage ||
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1100&q=82",
      description: form.get("description"),
      tags: form.get("featured") ? ["Featured", "New arrival"] : ["New arrival"],
      rating: 0,
      createdAt: new Date().toISOString(),
      status: "Published",
      variants: [
        {
          id: uid("v"),
          size: form.get("size") || "OS",
          color: form.get("color") || "Black",
          stock: Number(form.get("stock") || 0),
        },
      ],
    };

    setStore((current) => ({ ...current, products: [product, ...current.products] }));
    event.currentTarget.reset();
    show("Product added.");
  }

  function updateStock(productId, variantId, stock) {
    setStore((current) => {
      const product = current.products.find((item) => item.id === productId);
      const variant = product?.variants.find((item) => item.id === variantId);
      const nextStock = Number(stock || 0);

      return {
        ...current,
        products: current.products.map((item) =>
          item.id === productId
            ? {
                ...item,
                variants: item.variants.map((row) =>
                  row.id === variantId ? { ...row, stock: nextStock } : row,
                ),
              }
            : item,
        ),
        inventoryLogs: [
          {
            id: uid("log"),
            product: product?.name || "Product",
            variant: variant ? `${variant.size} / ${variant.color}` : "Variant",
            change: `${variant?.stock || 0} to ${nextStock}`,
            reason: "Manual CMS adjustment",
            createdAt: new Date().toISOString(),
          },
          ...current.inventoryLogs,
        ],
      };
    });
    show("Stock updated.");
  }

  if (!authenticated) {
    return (
      <main className="floral-paper relative min-h-screen overflow-hidden bg-sky text-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(223,191,145,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(122,23,52,0.08),transparent_30%)]" />
        <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <section className="grid gap-6">
            <a
              href="/"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-garden transition hover:text-wine"
            >
              <ArrowLeft size={17} /> Back to storefront
            </a>

            <div className="grid gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brass/25 bg-white/70 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-clay">
                <ShieldCheck size={14} /> House of Sirka admin
              </span>
              <div className="max-w-2xl">
                <h1 className="font-display text-5xl leading-none text-merlot md:text-6xl">
                  A calmer, cleaner place to run the boutique.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-charcoal/68">
                  Manage products, orders, clients, promotions, and stock from one polished workspace built for daily
                  boutique operations.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm font-bold text-charcoal/75">
              {[
                [Package, "Product CMS"],
                [Truck, "Order follow-up"],
                [Users, "Client roster"],
                [Tag, "Promotions"],
              ].map(([Icon, label]) => (
                <span
                  key={label}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-brass/20 bg-white/70 px-4 backdrop-blur-sm"
                >
                  <Icon size={16} className="text-wine" /> {label}
                </span>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[360px] overflow-hidden rounded-md border border-brass/25 bg-paper shadow-soft">
                <img
                  src={store.content.heroImage}
                  alt="House of Sirka atelier mood"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-white/10" />
                <div className="relative flex h-full flex-col justify-between p-6 text-white">
                  <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em]">
                    Control center
                  </span>
                  <div className="max-w-md">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">Daily overview</p>
                    <h2 className="mt-3 font-display text-4xl leading-tight">
                      Keep the brand elegant behind the scenes too.
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/80">
                      Review orders, watch low stock, adjust campaigns, and keep customer follow-up close at hand.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  ["Products live", store.products.length],
                  ["Active promotions", store.promotions.filter((promotion) => promotion.status === "active").length],
                  ["Saved clients", store.customers.length],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-brass/20 bg-white/75 p-4 backdrop-blur-sm">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-clay">{label}</p>
                    <strong className="mt-2 block text-3xl text-merlot">{value}</strong>
                  </div>
                ))}

                <div className="rounded-md border border-brass/20 bg-paper/90 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-clay">What you can do here</p>
                  <div className="mt-3 grid gap-2 text-sm leading-6 text-charcoal/70">
                    <span>Update catalog and upload product images</span>
                    <span>Track unpaid checkouts and proof of payment</span>
                    <span>Launch and manage time-bound offers</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-brass/25 bg-white/82 p-6 shadow-soft backdrop-blur-sm md:p-8">
            <div className="w-full max-w-xs">
              <img src="/house-of-sirka-logo-final.png" alt="House of Sirka" className="h-auto w-full" />
            </div>

            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">Admin access</p>
              <h2 className="mt-3 font-display text-4xl text-merlot">Welcome back</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-charcoal/68">
                Sign in to access the boutique dashboard. The admin workspace is available only through this private
                entry point.
              </p>
            </div>

            <form onSubmit={login} className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  defaultValue={ADMIN_EMAIL}
                  className="h-12 rounded-md border border-brass/25 bg-paper px-4 text-ink outline-none transition focus:border-wine focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  className="h-12 rounded-md border border-brass/25 bg-paper px-4 text-ink outline-none transition focus:border-wine focus:bg-white"
                />
              </label>

              {error && (
                <div className="rounded-md border border-wine/20 bg-petal px-4 py-3 text-sm font-semibold text-wine">
                  {error}
                </div>
              )}

              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-wine px-5 font-bold text-white transition hover:bg-merlot">
                <LogIn size={18} /> Login to admin
              </button>
            </form>

            <div className="mt-6 rounded-md border border-brass/20 bg-paper px-4 py-4 text-sm text-charcoal/72">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-clay">Demo credentials</p>
              <div className="mt-3 grid gap-2">
                <span>
                  <strong className="text-merlot">Email:</strong> {ADMIN_EMAIL}
                </span>
                <span>
                  <strong className="text-merlot">Password:</strong> {ADMIN_PASSWORD}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sky px-4 py-8 text-ink md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <a
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-garden transition hover:text-wine"
            >
              <ArrowLeft size={17} /> Back to storefront
            </a>
            <div className="mb-4 w-56 border border-brass/25 bg-paper p-2 shadow-sm">
              <img src="/house-of-sirka-logo-final.png" alt="House of Sirka" className="h-auto w-full" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">CMS and operations</p>
            <h1 className="mt-2 font-display text-5xl text-merlot">Admin control center</h1>
            <p className="mt-3 max-w-2xl text-charcoal/65">
              Products, content, clients, orders, payment follow-ups, inventory, analytics, and role-aware permissions.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="grid min-w-64 gap-2 text-sm font-bold text-charcoal/70">
              Active role
              <select
                value={store.role}
                onChange={(event) => {
                  setStorePatch({ role: event.target.value });
                  if (!permissions[event.target.value].includes(activeAdminTab)) {
                    setActiveAdminTab("dashboard");
                  }
                }}
                className="h-11 rounded-md border border-garden/25 bg-pearl px-3 text-ink"
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={logout}
              className="h-11 rounded-md border border-garden/25 bg-pearl px-4 text-sm font-bold text-garden transition hover:border-wine hover:text-wine"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-garden/10 px-3 py-1 text-sm font-bold text-garden">
          <ShieldCheck size={16} /> Logged in as {store.role}
        </div>

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          <div className="flex gap-2 overflow-x-auto lg:grid lg:content-start">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeAdminTab === tab.id;
              const allowed = activePermissions.includes(tab.id);

              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={!allowed}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={[
                    "flex h-12 shrink-0 items-center gap-3 rounded-md border px-4 text-left text-sm font-bold transition",
                    active
                      ? "border-garden bg-garden text-white"
                      : "border-garden/20 bg-pearl text-charcoal hover:border-wine hover:text-wine",
                  ].join(" ")}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </div>

          <AdminPanel
            activeTab={activeAdminTab}
            store={store}
            cartSummary={cartSummary}
            promotionDraft={promotionDraft}
            setPromotionDraft={setPromotionDraft}
            onSettingsSave={saveSettings}
            onResetStore={resetStore}
            onContentSave={saveContent}
            onProductAdd={addProduct}
            onSavePromotion={savePromotion}
            onEditPromotion={editPromotion}
            onTogglePromotionStatus={togglePromotionStatus}
            onDeletePromotion={deletePromotion}
            onArchive={(productId) =>
              updateProduct(productId, (product) => ({
                ...product,
                status: product.status === "Published" ? "Archived" : "Published",
              }))
            }
            onOrderUpdate={(orderId, status) => {
              setStore((current) => ({
                ...current,
                orders: current.orders.map((order) =>
                  order.id === orderId ? { ...order, status } : order,
                ),
              }));
              show("Order status updated.");
            }}
            onStockUpdate={updateStock}
          />
        </div>
      </div>

      {notice && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white shadow-soft">
          {notice}
        </div>
      )}
    </main>
  );
}

function fileToDataUrl(file, maxWidth = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(String(reader.result || ""));
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });
}

function ImageUpload({ name, label, value, maxWidth = 800 }) {
  const [preview, setPreview] = useState(value || "");
  const inputRef = useRef(null);
  const hiddenRef = useRef(null);

  useEffect(() => { setPreview(value || ""); }, [value]);

  async function handleFile(file) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file, maxWidth);
    setPreview(dataUrl);
    if (hiddenRef.current) hiddenRef.current.value = dataUrl;
  }

  return (
    <label className="grid gap-2 text-sm font-bold text-charcoal/70">
      {label}
      <input type="hidden" name={name} ref={hiddenRef} defaultValue={value || ""} />
      <div
        className="relative flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-brass/30 bg-white p-3 transition hover:border-wine/50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-wine"); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove("border-wine"); }}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-wine"); handleFile(e.dataTransfer.files[0]); }}
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-32 rounded object-contain" />
        ) : (
          <span className="text-center text-xs text-charcoal/40">Click or drag an image here</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      {preview && (
        <button
          type="button"
          onClick={() => { setPreview(""); if (hiddenRef.current) hiddenRef.current.value = ""; }}
          className="w-fit text-xs font-bold text-wine underline"
        >
          Remove image
        </button>
      )}
    </label>
  );
}

function AdminPanel({
  activeTab,
  store,
  cartSummary,
  promotionDraft,
  setPromotionDraft,
  onSettingsSave,
  onResetStore,
  onContentSave,
  onProductAdd,
  onSavePromotion,
  onEditPromotion,
  onTogglePromotionStatus,
  onDeletePromotion,
  onArchive,
  onOrderUpdate,
  onStockUpdate,
}) {
  const revenue = store.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const paymentFollowUps = store.orders.filter(
    (order) => order.followUpRequired || order.paymentStatus !== "Paid",
  );
  const cfg = store.settings || {};
  const fmt = (value) => money(value, cfg.currency, cfg.locale);
  const threshold = Number(cfg.lowStockThreshold ?? 2);
  const lowStock = store.products.flatMap((product) =>
    product.variants
      .filter((variant) => variant.stock <= threshold)
      .map((variant) => ({ product, variant })),
  );

  return (
    <div className="min-h-[560px] rounded-md border border-garden/20 bg-pearl p-5 shadow-soft">
      {activeTab === "dashboard" && (
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-3xl text-merlot">Dashboard</h3>
              <p className="text-sm text-charcoal/65">Active role: {store.role}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-garden/10 px-3 py-1 text-sm font-bold text-garden">
              <ShieldCheck size={16} /> Protected CMS
            </span>
          </div>
          <MetricGrid
            metrics={[
              ["Total sales", fmt(revenue), CreditCard],
              ["Orders", store.orders.length, ShoppingBag],
              ["Clients", store.customers?.length || 0, Users],
              ["Payment follow-ups", paymentFollowUps.length, Bell],
              ["Active promotions", store.promotions.filter((promotion) => promotion.status === "active").length, Tag],
              ["Products", store.products.length, Package],
              ["Stock alerts", lowStock.length, Bell],
              ["Cart preview", fmt(cartSummary.total), ShoppingBag],
            ]}
          />
        </div>
      )}

      {activeTab === "products" && (
        <div className="grid gap-6">
          <h3 className="font-display text-3xl text-merlot">Product CMS</h3>
          <form onSubmit={onProductAdd} className="grid gap-3 rounded-md border border-brass/25 bg-paper p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <TextInput name="name" label="Product name" required />
              <TextInput name="sku" label="SKU" required />
              <TextInput name="category" label="Category" required />
              <TextInput name="collection" label="Collection" defaultValue="New Arrivals" />
              <TextInput name="price" type="number" label="Price" required />
              <TextInput name="salePrice" type="number" label="Sale price" />
              <TextInput name="size" label="First size" defaultValue="M" />
              <TextInput name="color" label="First color" defaultValue="Black" />
              <TextInput name="stock" type="number" label="First stock" defaultValue="4" />
              <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                Product image
                <input
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  className="rounded-md border border-brass/25 bg-white px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-petal file:px-3 file:py-2 file:text-sm file:font-bold file:text-wine"
                />
              </label>
              <label className="flex items-center gap-2 pt-7 text-sm font-bold text-charcoal/70">
                <input name="featured" type="checkbox" className="h-4 w-4" /> Featured
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-3">
                Description
                <textarea name="description" required className="min-h-24 rounded-md border border-brass/25 bg-white p-3" />
              </label>
            </div>
            <button className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-wine px-4 font-bold text-white">
              <Plus size={18} /> Add product
            </button>
          </form>
          <ResponsiveTable
            headers={["Product", "Category", "Price", "Stock", "Status", "Action"]}
            rows={store.products.map((product) => [
              <strong key="name">{product.name}</strong>,
              product.category,
              fmt(productPrice(product)),
              totalStock(product),
              product.status,
              <button
                key="archive"
                type="button"
                onClick={() => onArchive(product.id)}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-brass/25 px-3 text-sm font-bold text-garden"
              >
                <Archive size={15} /> {product.status === "Published" ? "Archive" : "Restore"}
              </button>,
            ])}
          />
        </div>
      )}

      {activeTab === "content" && (
        <div className="grid gap-5">
          <div>
            <h3 className="font-display text-3xl text-merlot">Content CMS</h3>
            <p className="mt-1 text-sm text-charcoal/60">Edit your storefront content below. Every field maps to a visible area on the shop page. Changes appear once you press <strong>Save all content</strong>.</p>
          </div>
          <form onSubmit={onContentSave} className="grid gap-6">

            {/* ── 1. ANNOUNCEMENT BAR ──────────────────────────────── */}
            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden text-xs font-black text-white">1</span>
                <h4 className="font-bold text-merlot">Announcement bar</h4>
              </div>
              <p className="mb-3 text-xs text-charcoal/50">The coloured banner at the very top of the page. Use it for delivery offers, sales, or store news.</p>
              <TextInput name="announcement" label="Announcement text" defaultValue={store.content.announcement} />
            </div>

            {/* ── 2. HERO SECTION ──────────────────────────────────── */}
            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden text-xs font-black text-white">2</span>
                <h4 className="font-bold text-merlot">Hero section</h4>
              </div>
              <p className="mb-4 text-xs text-charcoal/50">The large banner visitors see first. Includes a badge, headline, subtitle, two images, buttons, and a floating note card.</p>
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput name="heroTitle" label="Page title (SEO / screen readers)" defaultValue={store.content.heroTitle} />
                <TextInput name="heroBadge" label="Badge text (small label above the logo)" defaultValue={store.content.heroBadge || ""} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  Subtitle (paragraph below the logo)
                  <textarea name="heroSubtitle" defaultValue={store.content.heroSubtitle} className="min-h-20 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine" />
                </label>
                <TextInput name="heroCtaPrimary" label="Primary button label" defaultValue={store.content.heroCtaPrimary || "Shop the salon"} />
                <TextInput name="heroCtaSecondary" label="Secondary button label" defaultValue={store.content.heroCtaSecondary || "View collections"} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <h5 className="mb-2 text-sm font-bold text-merlot">Main image (large, right side)</h5>
                  <ImageUpload name="heroImage" label="Upload or drag hero image" value={store.content.heroImage} maxWidth={1200} />
                </div>
                <div>
                  <h5 className="mb-2 text-sm font-bold text-merlot">Secondary image (bottom-left overlay)</h5>
                  <ImageUpload name="heroSecondaryImage" label="Upload or drag secondary image" value={store.content.heroSecondaryImage || ""} maxWidth={900} />
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <TextInput name="heroSecondaryLabel" label="Image caption" defaultValue={store.content.heroSecondaryLabel || "Evening edit"} />
                    <TextInput name="heroSecondaryBadge" label="Image badge" defaultValue={store.content.heroSecondaryBadge || "Sunny classic"} />
                  </div>
                </div>
              </div>

              <h5 className="mt-5 mb-2 text-sm font-bold text-merlot">Fitting note (floating card, left side)</h5>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="fittingNoteTitle" label="Card title" defaultValue={store.content.fittingNoteTitle || "Fitting note"} />
                <TextInput name="fittingNoteText" label="Card description" defaultValue={store.content.fittingNoteText || ""} />
              </div>
            </div>

            {/* ── 3. COLLECTIONS ───────────────────────────────────── */}
            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden text-xs font-black text-white">3</span>
                <h4 className="font-bold text-merlot">Collections section</h4>
              </div>
              <p className="mb-4 text-xs text-charcoal/50">The grid of clickable collection cards that filter your product catalog. Each card has a name, a category it filters to, and a background image.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="collectionsEyebrow" label="Section eyebrow" defaultValue={store.content.collectionsEyebrow || "Collections"} />
                <TextInput name="campaignTitle" label="Section headline" defaultValue={store.content.campaignTitle} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  Section description
                  <textarea name="campaignCopy" defaultValue={store.content.campaignCopy} className="min-h-16 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine" />
                </label>
              </div>

              <h5 className="mt-5 mb-3 text-sm font-bold text-merlot">Collection cards (up to 4)</h5>
              <div className="grid gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="grid gap-3 rounded-md border border-brass/20 bg-pearl p-4 md:grid-cols-[140px_1fr]">
                    <ImageUpload name={`collection${n}Image`} label={`Card ${n} image`} value={store.content[`collection${n}Image`] || ""} maxWidth={600} />
                    <div className="grid gap-2 content-start">
                      <TextInput name={`collection${n}Title`} label={`Card ${n} title`} defaultValue={store.content[`collection${n}Title`] || ""} />
                      <TextInput name={`collection${n}Category`} label={`Filters to category`} defaultValue={store.content[`collection${n}Category`] || ""} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 4. PRODUCT CATALOG ───────────────────────────────── */}
            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden text-xs font-black text-white">4</span>
                <h4 className="font-bold text-merlot">Product catalog section</h4>
              </div>
              <p className="mb-4 text-xs text-charcoal/50">The main product grid where customers browse, filter, and add items to cart.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="catalogEyebrow" label="Section eyebrow" defaultValue={store.content.catalogEyebrow || "Boutique rail"} />
                <TextInput name="catalogTitle" label="Section headline" defaultValue={store.content.catalogTitle || "Pieces with presence"} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  Section description
                  <textarea name="catalogCopy" defaultValue={store.content.catalogCopy || ""} className="min-h-16 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine" />
                </label>
              </div>
            </div>

            {/* ── 5. ACCOUNT SECTION ───────────────────────────────── */}
            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden text-xs font-black text-white">5</span>
                <h4 className="font-bold text-merlot">Account section</h4>
              </div>
              <p className="mb-4 text-xs text-charcoal/50">The customer login / order-tracking area at the bottom of the page.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="accountEyebrow" label="Section eyebrow" defaultValue={store.content.accountEyebrow || "Customer"} />
                <TextInput name="accountTitle" label="Section headline" defaultValue={store.content.accountTitle || "Account and order tracking"} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  Section description
                  <textarea name="accountCopy" defaultValue={store.content.accountCopy || ""} className="min-h-16 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine" />
                </label>
              </div>
            </div>

            {/* ── 6. FOOTER ────────────────────────────────────────── */}
            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden text-xs font-black text-white">6</span>
                <h4 className="font-bold text-merlot">Footer</h4>
              </div>
              <p className="mb-3 text-xs text-charcoal/50">The dark bar at the very bottom. Contact info is pulled from your Settings tab automatically — only the tagline is edited here.</p>
              <TextInput name="footerTagline" label="Footer tagline" defaultValue={store.content.footerTagline || ""} />
            </div>

            <div className="sticky bottom-4 z-10 flex justify-end">
              <button className="inline-flex h-12 items-center gap-2 rounded-md bg-wine px-6 font-bold text-white shadow-lg transition hover:bg-merlot">
                <Check size={18} /> Save all content
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="grid gap-5">
          <h3 className="font-display text-3xl text-merlot">Order management</h3>
          <ResponsiveTable
            headers={["Order", "Customer", "Contact", "Total", "Promotion", "Payment", "Proof", "Status"]}
            rows={
              store.orders.length
                ? store.orders.map((order) => [
                    <strong key="order">{order.orderNumber}</strong>,
                    <span key="customer">
                      <strong className="block">{order.customer}</strong>
                      <span className="text-xs text-charcoal/60">{order.email}</span>
                    </span>,
                    <span key="contact">
                      <span className="block">{order.phone || "No phone"}</span>
                      <span className="text-xs text-charcoal/60">{order.city || order.address}</span>
                    </span>,
                    fmt(order.total),
                    order.promotion ? (
                      <span key="promotion">
                        <strong className="block">{order.promotion.code}</strong>
                        <span className="text-xs text-charcoal/60">-{fmt(order.promotion.discount)}</span>
                      </span>
                    ) : (
                      <span key="promotion" className="text-charcoal/50">No promotion</span>
                    ),
                    <span key="payment">
                      <strong className="block">{order.payment}</strong>
                      <span className="text-xs text-charcoal/60">{order.paymentStatus}</span>
                    </span>,
                    order.proofOfPayment ? (
                      <a
                        key="proof"
                        href={order.proofOfPayment.dataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-wine underline"
                      >
                        View proof
                      </a>
                    ) : (
                      <span key="proof" className="text-charcoal/50">No proof</span>
                    ),
                    <select
                      key="status"
                      value={order.status}
                      onChange={(event) => onOrderUpdate(order.id, event.target.value)}
                      className="h-10 rounded-md border border-brass/25 px-2"
                    >
                      {(store.settings.orderStatuses || "").split("\n").map((s) => s.trim()).filter(Boolean).map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>,
                  ])
                : []
            }
            empty="Orders created from checkout will appear here."
          />
        </div>
      )}

      {activeTab === "customers" && (
        <div className="grid gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl text-merlot">Client roster</h3>
              <p className="mt-1 text-sm text-charcoal/65">
                Customers are created or updated automatically from checkout details.
              </p>
            </div>
            <span className="rounded-full bg-petal px-3 py-1 text-sm font-bold text-wine">
              {paymentFollowUps.length} payment follow-up{paymentFollowUps.length === 1 ? "" : "s"}
            </span>
          </div>

          <ResponsiveTable
            headers={["Client", "Contact", "Location", "Profile", "Orders", "Total spent", "Follow up"]}
            rows={(store.customers || []).map((customer) => {
              const customerOrders = store.orders.filter((order) => order.email === customer.email);
              const unpaidOrders = customerOrders.filter((order) => order.paymentStatus !== "Paid");
              const totalSpent = customerOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
              const whatsapp = cleanPhone(customer.whatsapp || customer.phone);

              return [
                <span key="client">
                  <strong className="block">{customer.name}</strong>
                  <span className="text-xs text-charcoal/60">{customer.email}</span>
                </span>,
                <span key="contact">
                  <span className="block">{customer.phone}</span>
                  <span className="text-xs text-charcoal/60">WhatsApp: {customer.whatsapp || customer.phone || "N/A"}</span>
                </span>,
                `${customer.city || ""} ${customer.address || ""}`.trim() || "N/A",
                customer.registered ? "Registered" : "Guest",
                customerOrders.length,
                fmt(totalSpent),
                <span key="followup" className="flex flex-wrap gap-2">
                  {unpaidOrders.length ? (
                    <span className="rounded-full bg-petal px-2 py-1 text-xs font-black text-wine">
                      {unpaidOrders.length} unpaid
                    </span>
                  ) : (
                    <span className="rounded-full bg-garden/10 px-2 py-1 text-xs font-black text-garden">
                      Clear
                    </span>
                  )}
                  {customer.email && (
                    <a className="text-xs font-bold text-wine underline" href={`mailto:${customer.email}`}>
                      Email
                    </a>
                  )}
                  {whatsapp && (
                    <a className="text-xs font-bold text-wine underline" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  )}
                </span>,
              ];
            })}
            empty="Customers will appear here after checkout."
          />

          <div>
            <h4 className="mb-3 font-display text-2xl text-merlot">Payment follow-up queue</h4>
            <ResponsiveTable
              headers={["Order", "Client", "Payment method", "Amount", "Proof", "Follow-up note"]}
              rows={paymentFollowUps.map((order) => [
                <strong key="order">{order.orderNumber}</strong>,
                <span key="client">
                  <strong className="block">{order.customer}</strong>
                  <span className="text-xs text-charcoal/60">{order.phone || order.email}</span>
                </span>,
                <span key="payment">
                  <strong className="block">{order.payment}</strong>
                  <span className="text-xs text-charcoal/60">{order.paymentStatus}</span>
                </span>,
                fmt(order.total),
                order.proofOfPayment ? (
                  <a
                    key="proof"
                    href={order.proofOfPayment.dataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-wine underline"
                  >
                    View proof
                  </a>
                ) : (
                  <span key="proof" className="text-charcoal/50">No proof attached</span>
                ),
                !splitLines(cfg.proofRequiredMethods).includes(order.payment) && !splitLines(cfg.autoConfirmMethods).includes(order.payment)
                  ? "Confirm delivery payment arrangement."
                  : "Verify proof or contact customer for payment confirmation.",
              ])}
              empty="No unpaid or manual-payment orders need follow-up."
            />
          </div>
        </div>
      )}

      {activeTab === "promotions" && (
        <div className="grid gap-5">
          <h3 className="font-display text-3xl text-merlot">Promotions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <PromoCard
              code={`${store.promotions.filter((promotion) => promotion.status === "active").length}`}
              title="Active promotions"
              copy="Currently available at checkout."
            />
            <PromoCard
              code={`${store.promotions.reduce((sum, promotion) => sum + Number(promotion.usageCount || 0), 0)}`}
              title="Total uses"
              copy="Tracked from completed checkout applications."
            />
            <PromoCard
              code={`${store.promotions.filter((promotion) => promotion.scope !== "all").length}`}
              title="Targeted offers"
              copy="Category, collection, or product-specific rules."
            />
          </div>

          <form onSubmit={onSavePromotion} className="grid gap-4 rounded-md border border-brass/25 bg-paper p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h4 className="font-display text-2xl text-merlot">
                  {promotionDraft.id ? "Edit promotion" : "Create promotion"}
                </h4>
                <p className="mt-1 text-sm text-charcoal/65">
                  Manage codes, dates, minimum spend, targeting, and availability.
                </p>
              </div>
              {promotionDraft.id && (
                <button
                  type="button"
                  onClick={() => setPromotionDraft(createPromotionDraft())}
                  className="h-10 rounded-md border border-brass/25 px-3 text-sm font-bold text-garden"
                >
                  Clear form
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Promotion name
                <input
                  value={promotionDraft.name}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, name: event.target.value }))}
                  className="h-11 rounded-md border border-brass/25 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Code
                <input
                  value={promotionDraft.code}
                  onChange={(event) =>
                    setPromotionDraft((current) => ({ ...current, code: event.target.value.toUpperCase() }))
                  }
                  className="h-11 rounded-md border border-brass/25 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Type
                <select
                  value={promotionDraft.type}
                  onChange={(event) =>
                    setPromotionDraft((current) => ({
                      ...current,
                      type: event.target.value,
                      value: event.target.value === "free-shipping" ? "0" : current.value,
                    }))
                  }
                  className="h-11 rounded-md border border-brass/25 bg-white px-3"
                >
                  {PROMOTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Value
                <input
                  type="number"
                  min="0"
                  value={promotionDraft.value}
                  disabled={promotionDraft.type === "free-shipping"}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, value: event.target.value }))}
                  className="h-11 rounded-md border border-brass/25 bg-white px-3 disabled:bg-paper"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Minimum order
                <input
                  type="number"
                  min="0"
                  value={promotionDraft.minSubtotal}
                  onChange={(event) =>
                    setPromotionDraft((current) => ({ ...current, minSubtotal: event.target.value }))
                  }
                  className="h-11 rounded-md border border-brass/25 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Status
                <select
                  value={promotionDraft.status}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, status: event.target.value }))}
                  className="h-11 rounded-md border border-brass/25 bg-white px-3"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Scope
                <select
                  value={promotionDraft.scope}
                  onChange={(event) =>
                    setPromotionDraft((current) => ({
                      ...current,
                      scope: event.target.value,
                      scopeValue: event.target.value === "all" ? "" : current.scopeValue,
                    }))
                  }
                  className="h-11 rounded-md border border-brass/25 bg-white px-3"
                >
                  {PROMOTION_SCOPES.map((scope) => (
                    <option key={scope} value={scope}>
                      {scope}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Target value
                <input
                  value={promotionDraft.scopeValue}
                  disabled={promotionDraft.scope === "all"}
                  onChange={(event) =>
                    setPromotionDraft((current) => ({ ...current, scopeValue: event.target.value }))
                  }
                  placeholder={
                    promotionDraft.scope === "product"
                      ? "Product id or product name"
                      : promotionDraft.scope === "all"
                        ? "Applies to all products"
                        : `Target ${promotionDraft.scope}`
                  }
                  className="h-11 rounded-md border border-brass/25 bg-white px-3 disabled:bg-paper"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Usage limit
                <input
                  type="number"
                  min="0"
                  value={promotionDraft.usageLimit}
                  onChange={(event) =>
                    setPromotionDraft((current) => ({ ...current, usageLimit: event.target.value }))
                  }
                  className="h-11 rounded-md border border-brass/25 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                Start date
                <input
                  type="date"
                  value={promotionDraft.startsAt}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, startsAt: event.target.value }))}
                  className="h-11 rounded-md border border-brass/25 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                End date
                <input
                  type="date"
                  value={promotionDraft.endsAt}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, endsAt: event.target.value }))}
                  className="h-11 rounded-md border border-brass/25 bg-white px-3"
                />
              </label>
            </div>

            <button className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-wine px-4 font-bold text-white">
              <Check size={18} /> {promotionDraft.id ? "Update promotion" : "Save promotion"}
            </button>
          </form>

          <ResponsiveTable
            headers={["Code", "Name", "Type", "Target", "Rules", "Usage", "Status", "Actions"]}
            rows={store.promotions.map((promotion) => [
              <strong key="code">{promotion.code}</strong>,
              promotion.name,
              promotion.type,
              promotionTargetLabel(promotion),
              <span key="rules">
                <span className="block">Minimum: {fmt(promotion.minSubtotal)}</span>
                <span className="text-xs text-charcoal/60">
                  {promotion.startsAt || "Now"} to {promotion.endsAt || "Open ended"}
                </span>
              </span>,
              `${promotion.usageCount} / ${promotion.usageLimit || "No limit"}`,
              <span
                key="status"
                className={
                  promotion.status === "active"
                    ? "rounded-full bg-garden/10 px-2 py-1 text-xs font-black text-garden"
                    : "rounded-full bg-petal px-2 py-1 text-xs font-black text-wine"
                }
              >
                {promotion.status}
              </span>,
              <span key="actions" className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEditPromotion(promotion)}
                  className="h-9 rounded-md border border-brass/25 px-3 text-sm font-bold text-garden"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onTogglePromotionStatus(promotion.id)}
                  className="h-9 rounded-md border border-brass/25 px-3 text-sm font-bold text-garden"
                >
                  {promotion.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePromotion(promotion.id)}
                  className="h-9 rounded-md border border-petal px-3 text-sm font-bold text-wine"
                >
                  Delete
                </button>
              </span>,
            ])}
            empty="No promotions created yet."
          />
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="grid gap-5">
          <h3 className="font-display text-3xl text-merlot">Inventory</h3>
          <ResponsiveTable
            headers={["Product", "Variant", "Current", "Set stock"]}
            rows={store.products.flatMap((product) =>
              product.variants.map((variant) => [
                product.name,
                `${variant.size} / ${variant.color}`,
                variant.stock,
                <StockControl
                  key={variant.id}
                  initial={variant.stock}
                  onSave={(stock) => onStockUpdate(product.id, variant.id, stock)}
                />,
              ]),
            )}
          />
          <div className="rounded-md border border-brass/25 bg-paper p-4">
            <h4 className="font-bold">Recent stock logs</h4>
            <div className="mt-3 grid gap-2">
              {store.inventoryLogs.length ? (
                store.inventoryLogs.slice(0, 6).map((log) => (
                  <InfoRow key={log.id} label={`${log.product} ${log.variant}`} value={`${log.change} / ${log.reason}`} />
                ))
              ) : (
                <EmptyState text="Stock movements will appear here." />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="grid gap-5">
          <h3 className="font-display text-3xl text-merlot">Reports</h3>
          <MetricGrid
            metrics={[
              ["Revenue", fmt(revenue), CreditCard],
              ["Average order", fmt(store.orders.length ? revenue / store.orders.length : 0), BarChart3],
              ["Top products", store.products.filter((product) => product.tags.includes("Featured")).length, Package],
              ["Low stock", lowStock.length, Bell],
            ]}
          />
          <ResponsiveTable
            headers={["Role", "Allowed modules"]}
            rows={Object.entries(permissions).map(([role, modules]) => [
              <strong key={role}>{role}</strong>,
              modules.join(", "),
            ])}
          />
          <ResponsiveTable
            headers={["Promotion", "Type", "Target", "Status", "Usage"]}
            rows={store.promotions.map((promotion) => [
              <span key="promotion">
                <strong className="block">{promotion.code}</strong>
                <span className="text-xs text-charcoal/60">{promotion.name}</span>
              </span>,
              promotion.type,
              promotionTargetLabel(promotion),
              promotion.status,
              `${promotion.usageCount} / ${promotion.usageLimit || "No limit"}`,
            ])}
          />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="grid gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-3xl text-merlot">Settings</h3>
              <p className="mt-1 text-sm text-charcoal/65">
                Configure store details, shipping, tax, and system preferences.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-garden/10 px-3 py-1 text-sm font-bold text-garden">
              <Settings size={16} /> Admin only
            </span>
          </div>

          <form onSubmit={onSettingsSave} className="grid gap-6">
            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Store information</h4>
              <p className="mb-4 text-sm text-charcoal/60">General store identity and contact details.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="storeName" label="Store name" defaultValue={store.settings.storeName} required />
                <TextInput name="storeEmail" label="Contact email" defaultValue={store.settings.storeEmail} type="email" />
                <TextInput name="storePhone" label="Phone number" defaultValue={store.settings.storePhone} />
                <TextInput name="storeAddress" label="Address" defaultValue={store.settings.storeAddress} />
                <TextInput name="currency" label="Currency symbol" defaultValue={store.settings.currency} />
                <TextInput name="locale" label="Number locale (e.g. en-NA)" defaultValue={store.settings.locale} />
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Shipping & delivery</h4>
              <p className="mb-4 text-sm text-charcoal/60">Delivery fees, options, and coverage areas used by the storefront and checkout.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="deliveryFee" label="Default delivery fee" type="number" defaultValue={store.settings.deliveryFee} />
                <TextInput name="freeDeliveryThreshold" label="Free delivery threshold" type="number" defaultValue={store.settings.freeDeliveryThreshold} />
                <TextInput name="defaultCity" label="Default city at checkout" defaultValue={store.settings.defaultCity} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Delivery areas
                  <textarea
                    name="deliveryAreas"
                    defaultValue={store.settings.deliveryAreas}
                    className="min-h-20 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine"
                    placeholder="Comma-separated list of delivery areas"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  Delivery options (one per line)
                  <textarea
                    name="deliveryOptions"
                    defaultValue={store.settings.deliveryOptions}
                    className="min-h-24 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine"
                    placeholder={"Windhoek delivery\nCourier delivery\nPickup arrangement"}
                  />
                  <span className="text-xs font-medium text-charcoal/50">These appear as dropdown options at checkout.</span>
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Payment methods</h4>
              <p className="mb-4 text-sm text-charcoal/60">Configure which payment methods appear at checkout and which require proof of payment.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Available methods (one per line)
                  <textarea
                    name="paymentMethods"
                    defaultValue={store.settings.paymentMethods}
                    className="min-h-28 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine"
                    placeholder={"Online card payment\nEWallet transfer\nEFT bank transfer\nPay upon delivery"}
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Proof-required methods (one per line)
                  <textarea
                    name="proofRequiredMethods"
                    defaultValue={store.settings.proofRequiredMethods}
                    className="min-h-28 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine"
                    placeholder={"EWallet transfer\nEFT bank transfer"}
                  />
                  <span className="text-xs font-medium text-charcoal/50">Customer must upload proof of payment for these methods.</span>
                </label>
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  Auto-confirm methods (one per line)
                  <textarea
                    name="autoConfirmMethods"
                    defaultValue={store.settings.autoConfirmMethods}
                    className="min-h-16 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine"
                    placeholder="Online card payment"
                  />
                  <span className="text-xs font-medium text-charcoal/50">Orders with these methods are marked as &quot;Paid&quot; automatically.</span>
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Payment gateway — Bank / EFT</h4>
              <p className="mb-4 text-sm text-charcoal/60">Bank account details shown to customers who select EFT bank transfer.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="bankName" label="Bank name" defaultValue={store.settings.bankName} />
                <TextInput name="bankAccountName" label="Account holder name" defaultValue={store.settings.bankAccountName} />
                <TextInput name="bankAccountNumber" label="Account number" defaultValue={store.settings.bankAccountNumber} />
                <TextInput name="bankBranchCode" label="Branch code" defaultValue={store.settings.bankBranchCode} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  Reference instructions
                  <input
                    name="bankReference"
                    defaultValue={store.settings.bankReference}
                    className="h-11 rounded-md border border-brass/25 bg-white px-3 text-ink outline-none focus:border-wine"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Payment gateway — EWallet</h4>
              <p className="mb-4 text-sm text-charcoal/60">EWallet details shown to customers who select EWallet transfer.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="ewalletProvider" label="EWallet provider" defaultValue={store.settings.ewalletProvider} />
                <TextInput name="ewalletNumber" label="EWallet number" defaultValue={store.settings.ewalletNumber} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  Customer instructions
                  <textarea
                    name="ewalletInstructions"
                    defaultValue={store.settings.ewalletInstructions}
                    className="min-h-20 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Communication</h4>
              <p className="mb-4 text-sm text-charcoal/60">WhatsApp, email, and social media configuration.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="whatsappNumber" label="WhatsApp number (digits only for wa.me link)" defaultValue={store.settings.whatsappNumber} />
                <TextInput name="supportEmail" label="Support email" defaultValue={store.settings.supportEmail} type="email" />
                <TextInput name="notificationEmail" label="Order notification email" defaultValue={store.settings.notificationEmail} type="email" />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Default WhatsApp message
                  <textarea
                    name="whatsappMessage"
                    defaultValue={store.settings.whatsappMessage}
                    className="min-h-20 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine"
                  />
                </label>
                <TextInput name="instagramUrl" label="Instagram URL" defaultValue={store.settings.instagramUrl} />
                <TextInput name="facebookUrl" label="Facebook URL" defaultValue={store.settings.facebookUrl} />
                <TextInput name="tiktokUrl" label="TikTok URL" defaultValue={store.settings.tiktokUrl} />
              </div>
              <div className="mt-5 border-t border-brass/25 pt-5">
                <h5 className="mb-1 font-bold text-merlot">WhatsApp Business API (optional)</h5>
                <p className="mb-3 text-xs text-charcoal/50">
                  For automated WhatsApp order notifications to the manager. Leave blank to use the default click-to-send fallback.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextInput name="whatsappApiUrl" label="WhatsApp API endpoint URL" defaultValue={store.settings.whatsappApiUrl || ""} />
                  <TextInput name="whatsappApiToken" label="WhatsApp API bearer token" type="password" defaultValue={store.settings.whatsappApiToken || ""} />
                </div>
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Email service</h4>
              <p className="mb-4 text-sm text-charcoal/60">
                Configure transactional email delivery for order confirmations, shipping updates, and notifications.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Email provider
                  <select
                    name="emailProvider"
                    defaultValue={store.settings.emailProvider}
                    className="h-11 rounded-md border border-brass/25 bg-white px-3 text-ink outline-none focus:border-wine"
                  >
                    <option value="none">None (disabled)</option>
                    <option value="smtp">SMTP</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="resend">Resend</option>
                    <option value="postmark">Postmark</option>
                    <option value="ses">Amazon SES</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  SMTP encryption
                  <select
                    name="smtpEncryption"
                    defaultValue={store.settings.smtpEncryption}
                    className="h-11 rounded-md border border-brass/25 bg-white px-3 text-ink outline-none focus:border-wine"
                  >
                    <option value="tls">TLS (port 587)</option>
                    <option value="ssl">SSL (port 465)</option>
                    <option value="none">None (port 25)</option>
                  </select>
                  <span className="text-xs font-medium text-charcoal/50">Only used when provider is SMTP.</span>
                </label>
                <TextInput name="smtpHost" label="SMTP host" defaultValue={store.settings.smtpHost} />
                <TextInput name="smtpPort" label="SMTP port" defaultValue={store.settings.smtpPort} />
                <TextInput name="smtpUser" label="SMTP username" defaultValue={store.settings.smtpUser} />
                <TextInput name="smtpPass" label="SMTP password" type="password" defaultValue={store.settings.smtpPass} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  API key
                  <input
                    name="emailApiKey"
                    type="password"
                    defaultValue={store.settings.emailApiKey}
                    className="h-11 rounded-md border border-brass/25 bg-white px-3 text-ink outline-none focus:border-wine"
                    placeholder="Used by SendGrid, Mailgun, Resend, Postmark, SES"
                  />
                  <span className="text-xs font-medium text-charcoal/50">Required for API-based providers. Leave blank if using SMTP.</span>
                </label>
                <TextInput name="emailFromAddress" label="From email address" type="email" defaultValue={store.settings.emailFromAddress} />
                <TextInput name="emailFromName" label="From display name" defaultValue={store.settings.emailFromName} />
                <TextInput name="emailReplyTo" label="Reply-to address" type="email" defaultValue={store.settings.emailReplyTo} />
                <div className="flex flex-col gap-3 md:col-span-2">
                  <label className="flex items-center gap-3 text-sm font-bold text-charcoal/70">
                    <input name="sendOrderConfirmation" type="checkbox" defaultChecked={store.settings.sendOrderConfirmation} className="h-4 w-4 accent-wine" />
                    Send order confirmation emails to customers
                  </label>
                  <label className="flex items-center gap-3 text-sm font-bold text-charcoal/70">
                    <input name="sendShippingUpdates" type="checkbox" defaultChecked={store.settings.sendShippingUpdates} className="h-4 w-4 accent-wine" />
                    Send shipping / status update emails
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Online payment gateway</h4>
              <p className="mb-4 text-sm text-charcoal/60">
                Connect a payment processor for online card and wallet payments. API keys are stored locally and should be moved to environment variables in production.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Gateway provider
                  <select
                    name="paymentGateway"
                    defaultValue={store.settings.paymentGateway}
                    className="h-11 rounded-md border border-brass/25 bg-white px-3 text-ink outline-none focus:border-wine"
                  >
                    <option value="none">None (manual payments only)</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="dpo">DPO (Direct Pay Online)</option>
                    <option value="paystack">Paystack</option>
                    <option value="yoco">Yoco</option>
                    <option value="ozow">Ozow</option>
                    <option value="peach">Peach Payments</option>
                    <option value="flutterwave">Flutterwave</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Mode
                  <select
                    name="gatewayMode"
                    defaultValue={store.settings.gatewayMode}
                    className="h-11 rounded-md border border-brass/25 bg-white px-3 text-ink outline-none focus:border-wine"
                  >
                    <option value="sandbox">Sandbox / Test</option>
                    <option value="live">Live / Production</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Public key / Client ID
                  <input
                    name="gatewayPublicKey"
                    type="password"
                    defaultValue={store.settings.gatewayPublicKey}
                    className="h-11 rounded-md border border-brass/25 bg-white px-3 text-ink outline-none focus:border-wine"
                    placeholder="pk_test_... or client ID"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Secret key / Client secret
                  <input
                    name="gatewaySecretKey"
                    type="password"
                    defaultValue={store.settings.gatewaySecretKey}
                    className="h-11 rounded-md border border-brass/25 bg-white px-3 text-ink outline-none focus:border-wine"
                    placeholder="sk_test_... or client secret"
                  />
                </label>
                <TextInput name="gatewayWebhookSecret" label="Webhook secret" type="password" defaultValue={store.settings.gatewayWebhookSecret} />
                <TextInput name="gatewayMerchantId" label="Merchant / Company ID" defaultValue={store.settings.gatewayMerchantId} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70 md:col-span-2">
                  Extra configuration (JSON)
                  <textarea
                    name="gatewayExtraConfig"
                    defaultValue={store.settings.gatewayExtraConfig}
                    className="min-h-20 rounded-md border border-brass/25 bg-white p-3 font-mono text-sm text-ink outline-none focus:border-wine"
                    placeholder={'{"serviceType": "...", "region": "..."}'}
                  />
                  <span className="text-xs font-medium text-charcoal/50">Optional JSON for provider-specific settings (DPO service type, Peach entity ID, etc.).</span>
                </label>
              </div>
              <div className="mt-4 rounded-md border border-marigold/30 bg-marigold/10 p-3 text-sm text-charcoal/75">
                <strong className="text-charcoal">⚠ Security note:</strong> In production, API secret keys and passwords should be stored in server-side environment variables, not in browser storage. This admin panel stores them locally for configuration purposes only.
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Orders</h4>
              <p className="mb-4 text-sm text-charcoal/60">Order number prefix and available order statuses.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="orderPrefix" label="Order number prefix" defaultValue={store.settings.orderPrefix} />
                <label className="grid gap-2 text-sm font-bold text-charcoal/70">
                  Order statuses (one per line)
                  <textarea
                    name="orderStatuses"
                    defaultValue={store.settings.orderStatuses}
                    className="min-h-36 rounded-md border border-brass/25 bg-white p-3 text-ink outline-none focus:border-wine"
                  />
                  <span className="text-xs font-medium text-charcoal/50">These appear as status dropdown options in order management.</span>
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-1 font-display text-2xl text-merlot">Tax & inventory</h4>
              <p className="mb-4 text-sm text-charcoal/60">Tax rate applied at checkout and low-stock alert threshold.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="taxRate" label="Tax rate (%)" type="number" defaultValue={store.settings.taxRate} />
                <TextInput name="lowStockThreshold" label="Low stock alert threshold" type="number" defaultValue={store.settings.lowStockThreshold} />
              </div>
            </div>

            <div className="rounded-md border border-brass/25 bg-paper p-5">
              <h4 className="mb-4 font-display text-2xl text-merlot">System</h4>
              <label className="flex items-center gap-3 text-sm font-bold text-charcoal/70">
                <input
                  name="maintenanceMode"
                  type="checkbox"
                  defaultChecked={store.settings.maintenanceMode}
                  className="h-4 w-4 accent-wine"
                />
                Maintenance mode (hides storefront from visitors)
              </label>
            </div>

            <button className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-wine px-5 font-bold text-white transition hover:bg-merlot">
              <Check size={18} /> Save all settings
            </button>
          </form>

          <div className="rounded-md border border-brass/25 bg-paper p-5">
            <h4 className="mb-2 font-display text-2xl text-merlot">Role permissions</h4>
            <p className="mb-4 text-sm text-charcoal/65">Current role-based access control configuration.</p>
            <ResponsiveTable
              headers={["Role", "Allowed modules"]}
              rows={Object.entries(permissions).map(([role, modules]) => [
                <strong key={role}>{role}</strong>,
                <span key="modules" className="flex flex-wrap gap-1">
                  {modules.map((mod) => (
                    <span key={mod} className="rounded-full bg-garden/10 px-2 py-0.5 text-xs font-bold text-garden">
                      {mod}
                    </span>
                  ))}
                </span>,
              ])}
            />
          </div>

          <div className="rounded-md border border-wine/20 bg-petal/50 p-5">
            <h4 className="mb-2 font-display text-2xl text-wine">Danger zone</h4>
            <p className="mb-4 text-sm text-charcoal/65">
              Reset all store data back to the original demo defaults. This removes all products, orders, customers, and settings changes.
            </p>
            <button
              type="button"
              onClick={onResetStore}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-wine bg-white px-4 font-bold text-wine transition hover:bg-wine hover:text-white"
            >
              <Trash2 size={18} /> Reset store data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricGrid({ metrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map(([label, value, Icon]) => (
        <div key={label} className="rounded-md border border-brass/25 bg-paper p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-charcoal/60">{label}</span>
            <Icon size={18} className="text-clay" />
          </div>
          <strong className="mt-2 block text-3xl">{value}</strong>
        </div>
      ))}
    </div>
  );
}

function ResponsiveTable({ headers, rows, empty = "No records yet." }) {
  return (
    <div className="overflow-x-auto rounded-md border border-brass/25">
      <table className="min-w-[760px] w-full border-collapse bg-pearl text-sm">
        <thead className="bg-cream text-left text-xs uppercase tracking-wide text-charcoal/55">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-brass/25 px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-b border-brass/15 px-4 py-3 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-charcoal/55">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StockControl({ initial, onSave }) {
  const [value, setValue] = useState(initial);

  return (
    <div className="flex gap-2">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-10 w-24 rounded-md border border-brass/25 px-2"
      />
      <button type="button" onClick={() => onSave(value)} className="h-10 rounded-md bg-garden px-3 text-sm font-bold text-white">
        Save
      </button>
    </div>
  );
}

function PromoCard({ code, title, copy }) {
  return (
    <div className="rounded-md border border-brass/25 bg-paper p-5">
      <span className="inline-flex rounded-full bg-blush px-3 py-1 text-xs font-black text-wine">
        {code}
      </span>
      <h4 className="mt-4 font-display text-3xl text-merlot">{title}</h4>
      <p className="mt-2 text-sm text-charcoal/65">{copy}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-brass/20 py-2 last:border-b-0">
      <span className="text-charcoal/60">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}

function TextInput({ label, name, type = "text", defaultValue = "", required = false }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-charcoal/70">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="h-11 rounded-md border border-brass/25 bg-white px-3 text-ink outline-none focus:border-wine"
      />
    </label>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-md border border-dashed border-brass/40 bg-paper p-6 text-center text-sm text-charcoal/55">
      {text}
    </div>
  );
}
