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
  evaluatePromotion,
  promotionTargetLabel,
  PROMOTION_SCOPES,
  PROMOTION_TYPES,
} from "@/lib/promotions";
import { STORAGE_KEY, initialStore, normalizeStore } from "@/lib/catalog";
import { money, productPrice, splitLines, totalStock, uid } from "@/lib/format";
import { fileToDataUrl } from "@/lib/media";

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
  const [store, setStore] = useState(initialStore);
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
        setStore(initialStore);
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
    setStore(initialStore);
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
      <main id="main" className="floral-paper relative min-h-screen overflow-hidden bg-ink-100 text-ink-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(223,191,145,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(122,23,52,0.08),transparent_30%)]" />
        <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <section className="grid gap-6">
            <a
              href="/"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-garden-700 transition hover:text-wine-600"
            >
              <ArrowLeft size={17} /> Back to storefront
            </a>

            <div className="grid gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brass-200 bg-white/70 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-clay-700">
                <ShieldCheck size={14} /> House of Sirka admin
              </span>
              <div className="max-w-2xl">
                <h1 className="font-display text-display-lg leading-none text-wine-800 md:text-display-xl">
                  A calmer, cleaner place to run the boutique.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-ink-700">
                  Manage products, orders, clients, promotions, and stock from one polished workspace built for daily
                  boutique operations.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm font-bold text-ink-700">
              {[
                [Package, "Product CMS"],
                [Truck, "Order follow-up"],
                [Users, "Client roster"],
                [Tag, "Promotions"],
              ].map(([Icon, label]) => (
                <span
                  key={label}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-brass-200 bg-white/70 px-4 backdrop-blur-sm"
                >
                  <Icon size={16} className="text-wine-600" /> {label}
                </span>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[360px] overflow-hidden rounded-md border border-brass-200 bg-ink-100 shadow-soft">
                <img
                  src={store.content.heroImage}
                  alt="House of Sirka workroom mood"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-white/10" />
                <div className="relative flex h-full flex-col justify-between p-6 text-white">
                  <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em]">
                    Control center
                  </span>
                  <div className="max-w-md">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/85">Daily overview</p>
                    <h2 className="mt-3 font-display text-display-md leading-tight">
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
                  <div key={label} className="rounded-md border border-brass-200 bg-white/75 p-4 backdrop-blur-sm">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-clay-700">{label}</p>
                    <strong className="mt-2 block text-3xl text-wine-800">{value}</strong>
                  </div>
                ))}

                <div className="rounded-md border border-brass-200 bg-ink-100/90 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-clay-700">What you can do here</p>
                  <div className="mt-3 grid gap-2 text-sm leading-6 text-ink-700">
                    <span>Update catalog and upload product images</span>
                    <span>Track unpaid checkouts and proof of payment</span>
                    <span>Launch and manage time-bound offers</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-brass-200 bg-white/80 p-6 shadow-soft backdrop-blur-sm md:p-8">
            <div className="w-full max-w-xs">
              <img src="/house-of-sirka-logo-final.png" alt="House of Sirka" className="h-auto w-full" />
            </div>

            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-clay-700">Admin access</p>
              <h2 className="mt-3 font-display text-display-md text-wine-800">Welcome back</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-ink-700">
                Sign in to access the boutique dashboard. The admin workspace is available only through this private
                entry point.
              </p>
            </div>

            <form onSubmit={login} className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  defaultValue={ADMIN_EMAIL}
                  className="h-12 rounded-md border border-brass-600 bg-ink-100 px-4 text-ink-900 outline-none transition focus:border-wine focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  className="h-12 rounded-md border border-brass-600 bg-ink-100 px-4 text-ink-900 outline-none transition focus:border-wine focus:bg-white"
                />
              </label>

              {error && (
                <div className="rounded-md border border-wine/20 bg-wine-50 px-4 py-3 text-sm font-semibold text-wine-600">
                  {error}
                </div>
              )}

              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-wine-600 px-5 font-bold text-white transition hover:bg-wine-700">
                <LogIn size={18} /> Login to admin
              </button>
            </form>

            <div className="mt-6 rounded-md border border-brass-200 bg-ink-100 px-4 py-4 text-sm text-ink-700">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-clay-700">Demo credentials</p>
              <div className="mt-3 grid gap-2">
                <span>
                  <strong className="text-wine-800">Email:</strong> {ADMIN_EMAIL}
                </span>
                <span>
                  <strong className="text-wine-800">Password:</strong> {ADMIN_PASSWORD}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="min-h-screen bg-ink-100 px-4 py-8 text-ink-900 md:px-8">
      <div className="mx-auto max-w-shell">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <a
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-garden-700 transition hover:text-wine-600"
            >
              <ArrowLeft size={17} /> Back to storefront
            </a>
            <div className="mb-4 w-56 border border-brass-200 bg-ink-100 p-2 shadow-sm">
              <img src="/house-of-sirka-logo-final.png" alt="House of Sirka" className="h-auto w-full" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay-700">CMS and operations</p>
            <h1 className="mt-2 font-display text-display-lg text-wine-800">Admin control center</h1>
            <p className="mt-3 max-w-2xl text-ink-600">
              Products, content, clients, orders, payment follow-ups, inventory, analytics, and role-aware permissions.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="grid min-w-64 gap-2 text-sm font-bold text-ink-700">
              Active role
              <select
                value={store.role}
                onChange={(event) => {
                  setStorePatch({ role: event.target.value });
                  if (!permissions[event.target.value].includes(activeAdminTab)) {
                    setActiveAdminTab("dashboard");
                  }
                }}
                className="h-11 rounded-md border border-garden/25 bg-ink-50 px-3 text-ink-900"
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={logout}
              className="h-11 rounded-md border border-garden/25 bg-ink-50 px-4 text-sm font-bold text-garden-700 transition hover:border-wine-600 hover:text-wine-600"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-garden/10 px-3 py-1 text-sm font-bold text-garden-700">
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
                      ? "border-garden bg-garden-700 text-white"
                      : "border-garden/20 bg-ink-50 text-ink-800 hover:border-wine-600 hover:text-wine-600",
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
    <label className="grid gap-2 text-sm font-bold text-ink-700">
      {label}
      <input type="hidden" name={name} ref={hiddenRef} defaultValue={value || ""} />
      <div
        className="relative flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-brass-200 bg-white p-3 transition hover:border-wine/50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-wine-600"); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove("border-wine-600"); }}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-wine-600"); handleFile(e.dataTransfer.files[0]); }}
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-32 rounded object-contain" />
        ) : (
          <span className="text-center text-xs text-ink-600">Click or drag an image here</span>
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
          className="w-fit text-xs font-bold text-wine-600 underline"
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
    <div className="min-h-[560px] rounded-md border border-garden/20 bg-ink-50 p-5 shadow-soft">
      {activeTab === "dashboard" && (
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-display-sm text-wine-800">Dashboard</h3>
              <p className="text-sm text-ink-600">Active role: {store.role}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-garden/10 px-3 py-1 text-sm font-bold text-garden-700">
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
          <h3 className="font-display text-display-sm text-wine-800">Product CMS</h3>
          <form onSubmit={onProductAdd} className="grid gap-3 rounded-md border border-brass-200 bg-ink-100 p-4">
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
              <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                Product image
                <input
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  className="rounded-md border border-brass-600 bg-white px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-petal file:px-3 file:py-2 file:text-sm file:font-bold file:text-wine"
                />
              </label>
              <label className="flex items-center gap-2 pt-7 text-sm font-bold text-ink-700">
                <input name="featured" type="checkbox" className="h-4 w-4" /> Featured
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-3">
                Description
                <textarea name="description" required className="min-h-24 rounded-md border border-brass-600 bg-white p-3" />
              </label>
            </div>
            <button className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-wine-600 px-4 font-bold text-white">
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
                className="inline-flex h-9 items-center gap-2 rounded-md border border-brass-200 px-3 text-sm font-bold text-garden-700"
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
            <h3 className="font-display text-display-sm text-wine-800">Content CMS</h3>
            <p className="mt-1 text-sm text-ink-600">Edit your storefront content below. Every field maps to a visible area on the shop page. Changes appear once you press <strong>Save all content</strong>.</p>
          </div>
          <form onSubmit={onContentSave} className="grid gap-6">

            {/* ── 1. ANNOUNCEMENT BAR ──────────────────────────────── */}
            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden-700 text-xs font-black text-white">1</span>
                <h4 className="font-bold text-wine-800">Announcement bar</h4>
              </div>
              <p className="mb-3 text-xs text-ink-600">The coloured banner at the very top of the page. Use it for delivery offers, sales, or store news.</p>
              <TextInput name="announcement" label="Announcement text" defaultValue={store.content.announcement} />
            </div>

            {/* ── 2. HERO SECTION ──────────────────────────────────── */}
            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden-700 text-xs font-black text-white">2</span>
                <h4 className="font-bold text-wine-800">Hero section</h4>
              </div>
              <p className="mb-4 text-xs text-ink-600">The large banner visitors see first. Includes a badge, headline, subtitle, two images, buttons, and a floating note card.</p>
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput name="heroTitle" label="Page title (SEO / screen readers)" defaultValue={store.content.heroTitle} />
                <TextInput name="heroBadge" label="Badge text (small label above the logo)" defaultValue={store.content.heroBadge || ""} />
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  Subtitle (paragraph below the logo)
                  <textarea name="heroSubtitle" defaultValue={store.content.heroSubtitle} className="min-h-20 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine" />
                </label>
                <TextInput name="heroCtaPrimary" label="Primary button label" defaultValue={store.content.heroCtaPrimary || "Shop the salon"} />
                <TextInput name="heroCtaSecondary" label="Secondary button label" defaultValue={store.content.heroCtaSecondary || "View collections"} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <h5 className="mb-2 text-sm font-bold text-wine-800">Main image (large, right side)</h5>
                  <ImageUpload name="heroImage" label="Upload or drag hero image" value={store.content.heroImage} maxWidth={1200} />
                </div>
                <div>
                  <h5 className="mb-2 text-sm font-bold text-wine-800">Secondary image (bottom-left overlay)</h5>
                  <ImageUpload name="heroSecondaryImage" label="Upload or drag secondary image" value={store.content.heroSecondaryImage || ""} maxWidth={900} />
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <TextInput name="heroSecondaryLabel" label="Image caption" defaultValue={store.content.heroSecondaryLabel || "Evening edit"} />
                    <TextInput name="heroSecondaryBadge" label="Image badge" defaultValue={store.content.heroSecondaryBadge || "Sunny classic"} />
                  </div>
                </div>
              </div>

              <h5 className="mt-5 mb-2 text-sm font-bold text-wine-800">Fitting note (floating card, left side)</h5>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="fittingNoteTitle" label="Card title" defaultValue={store.content.fittingNoteTitle || "Fitting note"} />
                <TextInput name="fittingNoteText" label="Card description" defaultValue={store.content.fittingNoteText || ""} />
              </div>
            </div>

            {/* ── 3. COLLECTIONS ───────────────────────────────────── */}
            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden-700 text-xs font-black text-white">3</span>
                <h4 className="font-bold text-wine-800">Collections section</h4>
              </div>
              <p className="mb-4 text-xs text-ink-600">The grid of clickable collection cards that filter your product catalog. Each card has a name, a category it filters to, and a background image.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="collectionsEyebrow" label="Section eyebrow" defaultValue={store.content.collectionsEyebrow || "Collections"} />
                <TextInput name="campaignTitle" label="Section headline" defaultValue={store.content.campaignTitle} />
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  Section description
                  <textarea name="campaignCopy" defaultValue={store.content.campaignCopy} className="min-h-16 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine" />
                </label>
              </div>

              <h5 className="mt-5 mb-3 text-sm font-bold text-wine-800">Collection cards (up to 4)</h5>
              <div className="grid gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="grid gap-3 rounded-md border border-brass-200 bg-ink-50 p-4 md:grid-cols-[140px_1fr]">
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
            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden-700 text-xs font-black text-white">4</span>
                <h4 className="font-bold text-wine-800">Product catalog section</h4>
              </div>
              <p className="mb-4 text-xs text-ink-600">The main product grid where customers browse, filter, and add items to cart.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="catalogEyebrow" label="Section eyebrow" defaultValue={store.content.catalogEyebrow || "Boutique rail"} />
                <TextInput name="catalogTitle" label="Section headline" defaultValue={store.content.catalogTitle || "Pieces with presence"} />
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  Section description
                  <textarea name="catalogCopy" defaultValue={store.content.catalogCopy || ""} className="min-h-16 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine" />
                </label>
              </div>
            </div>

            {/* ── 5. ACCOUNT SECTION ───────────────────────────────── */}
            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden-700 text-xs font-black text-white">5</span>
                <h4 className="font-bold text-wine-800">Account section</h4>
              </div>
              <p className="mb-4 text-xs text-ink-600">The customer login / order-tracking area at the bottom of the page.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="accountEyebrow" label="Section eyebrow" defaultValue={store.content.accountEyebrow || "Customer"} />
                <TextInput name="accountTitle" label="Section headline" defaultValue={store.content.accountTitle || "Account and order tracking"} />
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  Section description
                  <textarea name="accountCopy" defaultValue={store.content.accountCopy || ""} className="min-h-16 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine" />
                </label>
              </div>
            </div>

            {/* ── 6. FOOTER ────────────────────────────────────────── */}
            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-garden-700 text-xs font-black text-white">6</span>
                <h4 className="font-bold text-wine-800">Footer</h4>
              </div>
              <p className="mb-3 text-xs text-ink-600">The dark bar at the very bottom. Contact info is pulled from your Settings tab automatically — only the tagline is edited here.</p>
              <TextInput name="footerTagline" label="Footer tagline" defaultValue={store.content.footerTagline || ""} />
            </div>

            <div className="sticky bottom-4 z-10 flex justify-end">
              <button className="inline-flex h-12 items-center gap-2 rounded-md bg-wine-600 px-6 font-bold text-white shadow-lg transition hover:bg-wine-700">
                <Check size={18} /> Save all content
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="grid gap-5">
          <h3 className="font-display text-display-sm text-wine-800">Order management</h3>
          <ResponsiveTable
            headers={["Order", "Customer", "Contact", "Total", "Promotion", "Payment", "Proof", "Status"]}
            rows={
              store.orders.length
                ? store.orders.map((order) => [
                    <strong key="order">{order.orderNumber}</strong>,
                    <span key="customer">
                      <strong className="block">{order.customer}</strong>
                      <span className="text-xs text-ink-600">{order.email}</span>
                    </span>,
                    <span key="contact">
                      <span className="block">{order.phone || "No phone"}</span>
                      <span className="text-xs text-ink-600">{order.city || order.address}</span>
                    </span>,
                    fmt(order.total),
                    order.promotion ? (
                      <span key="promotion">
                        <strong className="block">{order.promotion.code}</strong>
                        <span className="text-xs text-ink-600">-{fmt(order.promotion.discount)}</span>
                      </span>
                    ) : (
                      <span key="promotion" className="text-ink-600">No promotion</span>
                    ),
                    <span key="payment">
                      <strong className="block">{order.payment}</strong>
                      <span className="text-xs text-ink-600">{order.paymentStatus}</span>
                    </span>,
                    order.proofOfPayment ? (
                      <a
                        key="proof"
                        href={order.proofOfPayment.dataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-wine-600 underline"
                      >
                        View proof
                      </a>
                    ) : (
                      <span key="proof" className="text-ink-600">No proof</span>
                    ),
                    <select
                      key="status"
                      value={order.status}
                      onChange={(event) => onOrderUpdate(order.id, event.target.value)}
                      className="h-10 rounded-md border border-brass-600 px-2"
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
              <h3 className="font-display text-display-sm text-wine-800">Client roster</h3>
              <p className="mt-1 text-sm text-ink-600">
                Customers are created or updated automatically from checkout details.
              </p>
            </div>
            <span className="rounded-full bg-wine-50 px-3 py-1 text-sm font-bold text-wine-600">
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
                  <span className="text-xs text-ink-600">{customer.email}</span>
                </span>,
                <span key="contact">
                  <span className="block">{customer.phone}</span>
                  <span className="text-xs text-ink-600">WhatsApp: {customer.whatsapp || customer.phone || "N/A"}</span>
                </span>,
                `${customer.city || ""} ${customer.address || ""}`.trim() || "N/A",
                customer.registered ? "Registered" : "Guest",
                customerOrders.length,
                fmt(totalSpent),
                <span key="followup" className="flex flex-wrap gap-2">
                  {unpaidOrders.length ? (
                    <span className="rounded-full bg-wine-50 px-2 py-1 text-xs font-black text-wine-600">
                      {unpaidOrders.length} unpaid
                    </span>
                  ) : (
                    <span className="rounded-full bg-garden/10 px-2 py-1 text-xs font-black text-garden-700">
                      Clear
                    </span>
                  )}
                  {customer.email && (
                    <a className="text-xs font-bold text-wine-600 underline" href={`mailto:${customer.email}`}>
                      Email
                    </a>
                  )}
                  {whatsapp && (
                    <a className="text-xs font-bold text-wine-600 underline" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  )}
                </span>,
              ];
            })}
            empty="Customers will appear here after checkout."
          />

          <div>
            <h4 className="mb-3 font-display text-display-sm text-wine-800">Payment follow-up queue</h4>
            <ResponsiveTable
              headers={["Order", "Client", "Payment method", "Amount", "Proof", "Follow-up note"]}
              rows={paymentFollowUps.map((order) => [
                <strong key="order">{order.orderNumber}</strong>,
                <span key="client">
                  <strong className="block">{order.customer}</strong>
                  <span className="text-xs text-ink-600">{order.phone || order.email}</span>
                </span>,
                <span key="payment">
                  <strong className="block">{order.payment}</strong>
                  <span className="text-xs text-ink-600">{order.paymentStatus}</span>
                </span>,
                fmt(order.total),
                order.proofOfPayment ? (
                  <a
                    key="proof"
                    href={order.proofOfPayment.dataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-wine-600 underline"
                  >
                    View proof
                  </a>
                ) : (
                  <span key="proof" className="text-ink-600">No proof attached</span>
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
          <h3 className="font-display text-display-sm text-wine-800">Promotions</h3>
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

          <form onSubmit={onSavePromotion} className="grid gap-4 rounded-md border border-brass-200 bg-ink-100 p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h4 className="font-display text-display-sm text-wine-800">
                  {promotionDraft.id ? "Edit promotion" : "Create promotion"}
                </h4>
                <p className="mt-1 text-sm text-ink-600">
                  Manage codes, dates, minimum spend, targeting, and availability.
                </p>
              </div>
              {promotionDraft.id && (
                <button
                  type="button"
                  onClick={() => setPromotionDraft(createPromotionDraft())}
                  className="h-10 rounded-md border border-brass-200 px-3 text-sm font-bold text-garden-700"
                >
                  Clear form
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                Promotion name
                <input
                  value={promotionDraft.name}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, name: event.target.value }))}
                  className="h-11 rounded-md border border-brass-600 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                Code
                <input
                  value={promotionDraft.code}
                  onChange={(event) =>
                    setPromotionDraft((current) => ({ ...current, code: event.target.value.toUpperCase() }))
                  }
                  className="h-11 rounded-md border border-brass-600 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
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
                  className="h-11 rounded-md border border-brass-600 bg-white px-3"
                >
                  {PROMOTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                Value
                <input
                  type="number"
                  min="0"
                  value={promotionDraft.value}
                  disabled={promotionDraft.type === "free-shipping"}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, value: event.target.value }))}
                  className="h-11 rounded-md border border-brass-600 bg-white px-3 disabled:bg-ink-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                Minimum order
                <input
                  type="number"
                  min="0"
                  value={promotionDraft.minSubtotal}
                  onChange={(event) =>
                    setPromotionDraft((current) => ({ ...current, minSubtotal: event.target.value }))
                  }
                  className="h-11 rounded-md border border-brass-600 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                Status
                <select
                  value={promotionDraft.status}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, status: event.target.value }))}
                  className="h-11 rounded-md border border-brass-600 bg-white px-3"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
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
                  className="h-11 rounded-md border border-brass-600 bg-white px-3"
                >
                  {PROMOTION_SCOPES.map((scope) => (
                    <option key={scope} value={scope}>
                      {scope}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
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
                  className="h-11 rounded-md border border-brass-600 bg-white px-3 disabled:bg-ink-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                Usage limit
                <input
                  type="number"
                  min="0"
                  value={promotionDraft.usageLimit}
                  onChange={(event) =>
                    setPromotionDraft((current) => ({ ...current, usageLimit: event.target.value }))
                  }
                  className="h-11 rounded-md border border-brass-600 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                Start date
                <input
                  type="date"
                  value={promotionDraft.startsAt}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, startsAt: event.target.value }))}
                  className="h-11 rounded-md border border-brass-600 bg-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink-700">
                End date
                <input
                  type="date"
                  value={promotionDraft.endsAt}
                  onChange={(event) => setPromotionDraft((current) => ({ ...current, endsAt: event.target.value }))}
                  className="h-11 rounded-md border border-brass-600 bg-white px-3"
                />
              </label>
            </div>

            <button className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-wine-600 px-4 font-bold text-white">
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
                <span className="text-xs text-ink-600">
                  {promotion.startsAt || "Now"} to {promotion.endsAt || "Open ended"}
                </span>
              </span>,
              `${promotion.usageCount} / ${promotion.usageLimit || "No limit"}`,
              <span
                key="status"
                className={
                  promotion.status === "active"
                    ? "rounded-full bg-garden/10 px-2 py-1 text-xs font-black text-garden-700"
                    : "rounded-full bg-wine-50 px-2 py-1 text-xs font-black text-wine-600"
                }
              >
                {promotion.status}
              </span>,
              <span key="actions" className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEditPromotion(promotion)}
                  className="h-9 rounded-md border border-brass-200 px-3 text-sm font-bold text-garden-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onTogglePromotionStatus(promotion.id)}
                  className="h-9 rounded-md border border-brass-200 px-3 text-sm font-bold text-garden-700"
                >
                  {promotion.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePromotion(promotion.id)}
                  className="h-9 rounded-md border border-petal px-3 text-sm font-bold text-wine-600"
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
          <h3 className="font-display text-display-sm text-wine-800">Inventory</h3>
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
          <div className="rounded-md border border-brass-200 bg-ink-100 p-4">
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
          <h3 className="font-display text-display-sm text-wine-800">Reports</h3>
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
                <span className="text-xs text-ink-600">{promotion.name}</span>
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
              <h3 className="font-display text-display-sm text-wine-800">Settings</h3>
              <p className="mt-1 text-sm text-ink-600">
                Configure store details, shipping, tax, and system preferences.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-garden/10 px-3 py-1 text-sm font-bold text-garden-700">
              <Settings size={16} /> Admin only
            </span>
          </div>

          <form onSubmit={onSettingsSave} className="grid gap-6">
            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Store information</h4>
              <p className="mb-4 text-sm text-ink-600">General store identity and contact details.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="storeName" label="Store name" defaultValue={store.settings.storeName} required />
                <TextInput name="storeEmail" label="Contact email" defaultValue={store.settings.storeEmail} type="email" />
                <TextInput name="storePhone" label="Phone number" defaultValue={store.settings.storePhone} />
                <TextInput name="storeAddress" label="Address" defaultValue={store.settings.storeAddress} />
                <TextInput name="currency" label="Currency symbol" defaultValue={store.settings.currency} />
                <TextInput name="locale" label="Number locale (e.g. en-NA)" defaultValue={store.settings.locale} />
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Shipping & delivery</h4>
              <p className="mb-4 text-sm text-ink-600">Delivery fees, options, and coverage areas used by the storefront and checkout.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="deliveryFee" label="Default delivery fee" type="number" defaultValue={store.settings.deliveryFee} />
                <TextInput name="freeDeliveryThreshold" label="Free delivery threshold" type="number" defaultValue={store.settings.freeDeliveryThreshold} />
                <TextInput name="defaultCity" label="Default city at checkout" defaultValue={store.settings.defaultCity} />
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Delivery areas
                  <textarea
                    name="deliveryAreas"
                    defaultValue={store.settings.deliveryAreas}
                    className="min-h-20 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine"
                    placeholder="Comma-separated list of delivery areas"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  Delivery options (one per line)
                  <textarea
                    name="deliveryOptions"
                    defaultValue={store.settings.deliveryOptions}
                    className="min-h-24 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine"
                    placeholder={"Windhoek delivery\nCourier delivery\nPickup arrangement"}
                  />
                  <span className="text-xs font-medium text-ink-600">These appear as dropdown options at checkout.</span>
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Payment methods</h4>
              <p className="mb-4 text-sm text-ink-600">Configure which payment methods appear at checkout and which require proof of payment.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Available methods (one per line)
                  <textarea
                    name="paymentMethods"
                    defaultValue={store.settings.paymentMethods}
                    className="min-h-28 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine"
                    placeholder={"Online card payment\nEWallet transfer\nEFT bank transfer\nPay upon delivery"}
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Proof-required methods (one per line)
                  <textarea
                    name="proofRequiredMethods"
                    defaultValue={store.settings.proofRequiredMethods}
                    className="min-h-28 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine"
                    placeholder={"EWallet transfer\nEFT bank transfer"}
                  />
                  <span className="text-xs font-medium text-ink-600">Customer must upload proof of payment for these methods.</span>
                </label>
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  Auto-confirm methods (one per line)
                  <textarea
                    name="autoConfirmMethods"
                    defaultValue={store.settings.autoConfirmMethods}
                    className="min-h-16 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine"
                    placeholder="Online card payment"
                  />
                  <span className="text-xs font-medium text-ink-600">Orders with these methods are marked as &quot;Paid&quot; automatically.</span>
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Payment gateway — Bank / EFT</h4>
              <p className="mb-4 text-sm text-ink-600">Bank account details shown to customers who select EFT bank transfer.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="bankName" label="Bank name" defaultValue={store.settings.bankName} />
                <TextInput name="bankAccountName" label="Account holder name" defaultValue={store.settings.bankAccountName} />
                <TextInput name="bankAccountNumber" label="Account number" defaultValue={store.settings.bankAccountNumber} />
                <TextInput name="bankBranchCode" label="Branch code" defaultValue={store.settings.bankBranchCode} />
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  Reference instructions
                  <input
                    name="bankReference"
                    defaultValue={store.settings.bankReference}
                    className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Payment gateway — EWallet</h4>
              <p className="mb-4 text-sm text-ink-600">EWallet details shown to customers who select EWallet transfer.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="ewalletProvider" label="EWallet provider" defaultValue={store.settings.ewalletProvider} />
                <TextInput name="ewalletNumber" label="EWallet number" defaultValue={store.settings.ewalletNumber} />
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  Customer instructions
                  <textarea
                    name="ewalletInstructions"
                    defaultValue={store.settings.ewalletInstructions}
                    className="min-h-20 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Communication</h4>
              <p className="mb-4 text-sm text-ink-600">WhatsApp, email, and social media configuration.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="whatsappNumber" label="WhatsApp number (digits only for wa.me link)" defaultValue={store.settings.whatsappNumber} />
                <TextInput name="supportEmail" label="Support email" defaultValue={store.settings.supportEmail} type="email" />
                <TextInput name="notificationEmail" label="Order notification email" defaultValue={store.settings.notificationEmail} type="email" />
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Default WhatsApp message
                  <textarea
                    name="whatsappMessage"
                    defaultValue={store.settings.whatsappMessage}
                    className="min-h-20 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine"
                  />
                </label>
                <TextInput name="instagramUrl" label="Instagram URL" defaultValue={store.settings.instagramUrl} />
                <TextInput name="facebookUrl" label="Facebook URL" defaultValue={store.settings.facebookUrl} />
                <TextInput name="tiktokUrl" label="TikTok URL" defaultValue={store.settings.tiktokUrl} />
              </div>
              <div className="mt-5 border-t border-brass-200 pt-5">
                <h5 className="mb-1 font-bold text-wine-800">WhatsApp Business API (optional)</h5>
                <p className="mb-3 text-xs text-ink-600">
                  For automated WhatsApp order notifications to the manager. Leave blank to use the default click-to-send fallback.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextInput name="whatsappApiUrl" label="WhatsApp API endpoint URL" defaultValue={store.settings.whatsappApiUrl || ""} />
                  <TextInput name="whatsappApiToken" label="WhatsApp API bearer token" type="password" defaultValue={store.settings.whatsappApiToken || ""} />
                </div>
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Email service</h4>
              <p className="mb-4 text-sm text-ink-600">
                Configure transactional email delivery for order confirmations, shipping updates, and notifications.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Email provider
                  <select
                    name="emailProvider"
                    defaultValue={store.settings.emailProvider}
                    className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
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
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  SMTP encryption
                  <select
                    name="smtpEncryption"
                    defaultValue={store.settings.smtpEncryption}
                    className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
                  >
                    <option value="tls">TLS (port 587)</option>
                    <option value="ssl">SSL (port 465)</option>
                    <option value="none">None (port 25)</option>
                  </select>
                  <span className="text-xs font-medium text-ink-600">Only used when provider is SMTP.</span>
                </label>
                <TextInput name="smtpHost" label="SMTP host" defaultValue={store.settings.smtpHost} />
                <TextInput name="smtpPort" label="SMTP port" defaultValue={store.settings.smtpPort} />
                <TextInput name="smtpUser" label="SMTP username" defaultValue={store.settings.smtpUser} />
                <TextInput name="smtpPass" label="SMTP password" type="password" defaultValue={store.settings.smtpPass} />
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  API key
                  <input
                    name="emailApiKey"
                    type="password"
                    defaultValue={store.settings.emailApiKey}
                    className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
                    placeholder="Used by SendGrid, Mailgun, Resend, Postmark, SES"
                  />
                  <span className="text-xs font-medium text-ink-600">Required for API-based providers. Leave blank if using SMTP.</span>
                </label>
                <TextInput name="emailFromAddress" label="From email address" type="email" defaultValue={store.settings.emailFromAddress} />
                <TextInput name="emailFromName" label="From display name" defaultValue={store.settings.emailFromName} />
                <TextInput name="emailReplyTo" label="Reply-to address" type="email" defaultValue={store.settings.emailReplyTo} />
                <div className="flex flex-col gap-3 md:col-span-2">
                  <label className="flex items-center gap-3 text-sm font-bold text-ink-700">
                    <input name="sendOrderConfirmation" type="checkbox" defaultChecked={store.settings.sendOrderConfirmation} className="h-4 w-4 accent-wine" />
                    Send order confirmation emails to customers
                  </label>
                  <label className="flex items-center gap-3 text-sm font-bold text-ink-700">
                    <input name="sendShippingUpdates" type="checkbox" defaultChecked={store.settings.sendShippingUpdates} className="h-4 w-4 accent-wine" />
                    Send shipping / status update emails
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Online payment gateway</h4>
              <p className="mb-4 text-sm text-ink-600">
                Connect a payment processor for online card and wallet payments. API keys are stored locally and should be moved to environment variables in production.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Gateway provider
                  <select
                    name="paymentGateway"
                    defaultValue={store.settings.paymentGateway}
                    className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
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
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Mode
                  <select
                    name="gatewayMode"
                    defaultValue={store.settings.gatewayMode}
                    className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
                  >
                    <option value="sandbox">Sandbox / Test</option>
                    <option value="live">Live / Production</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Public key / Client ID
                  <input
                    name="gatewayPublicKey"
                    type="password"
                    defaultValue={store.settings.gatewayPublicKey}
                    className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
                    placeholder="pk_test_... or client ID"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Secret key / Client secret
                  <input
                    name="gatewaySecretKey"
                    type="password"
                    defaultValue={store.settings.gatewaySecretKey}
                    className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
                    placeholder="sk_test_... or client secret"
                  />
                </label>
                <TextInput name="gatewayWebhookSecret" label="Webhook secret" type="password" defaultValue={store.settings.gatewayWebhookSecret} />
                <TextInput name="gatewayMerchantId" label="Merchant / Company ID" defaultValue={store.settings.gatewayMerchantId} />
                <label className="grid gap-2 text-sm font-bold text-ink-700 md:col-span-2">
                  Extra configuration (JSON)
                  <textarea
                    name="gatewayExtraConfig"
                    defaultValue={store.settings.gatewayExtraConfig}
                    className="min-h-20 rounded-md border border-brass-600 bg-white p-3 font-mono text-sm text-ink-900 outline-none focus:border-wine"
                    placeholder={'{"serviceType": "...", "region": "..."}'}
                  />
                  <span className="text-xs font-medium text-ink-600">Optional JSON for provider-specific settings (DPO service type, Peach entity ID, etc.).</span>
                </label>
              </div>
              <div className="mt-4 rounded-md border border-marigold/30 bg-marigold/10 p-3 text-sm text-ink-700">
                <strong className="text-ink-800">⚠ Security note:</strong> In production, API secret keys and passwords should be stored in server-side environment variables, not in browser storage. This admin panel stores them locally for configuration purposes only.
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Orders</h4>
              <p className="mb-4 text-sm text-ink-600">Order number prefix and available order statuses.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="orderPrefix" label="Order number prefix" defaultValue={store.settings.orderPrefix} />
                <label className="grid gap-2 text-sm font-bold text-ink-700">
                  Order statuses (one per line)
                  <textarea
                    name="orderStatuses"
                    defaultValue={store.settings.orderStatuses}
                    className="min-h-36 rounded-md border border-brass-600 bg-white p-3 text-ink-900 outline-none focus:border-wine"
                  />
                  <span className="text-xs font-medium text-ink-600">These appear as status dropdown options in order management.</span>
                </label>
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-1 font-display text-display-sm text-wine-800">Tax & inventory</h4>
              <p className="mb-4 text-sm text-ink-600">Tax rate applied at checkout and low-stock alert threshold.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput name="taxRate" label="Tax rate (%)" type="number" defaultValue={store.settings.taxRate} />
                <TextInput name="lowStockThreshold" label="Low stock alert threshold" type="number" defaultValue={store.settings.lowStockThreshold} />
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
              <h4 className="mb-4 font-display text-display-sm text-wine-800">System</h4>
              <label className="flex items-center gap-3 text-sm font-bold text-ink-700">
                <input
                  name="maintenanceMode"
                  type="checkbox"
                  defaultChecked={store.settings.maintenanceMode}
                  className="h-4 w-4 accent-wine"
                />
                Maintenance mode (hides storefront from visitors)
              </label>
            </div>

            <button className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-wine-600 px-5 font-bold text-white transition hover:bg-wine-700">
              <Check size={18} /> Save all settings
            </button>
          </form>

          <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
            <h4 className="mb-2 font-display text-display-sm text-wine-800">Role permissions</h4>
            <p className="mb-4 text-sm text-ink-600">Current role-based access control configuration.</p>
            <ResponsiveTable
              headers={["Role", "Allowed modules"]}
              rows={Object.entries(permissions).map(([role, modules]) => [
                <strong key={role}>{role}</strong>,
                <span key="modules" className="flex flex-wrap gap-1">
                  {modules.map((mod) => (
                    <span key={mod} className="rounded-full bg-garden/10 px-2 py-0.5 text-xs font-bold text-garden-700">
                      {mod}
                    </span>
                  ))}
                </span>,
              ])}
            />
          </div>

          <div className="rounded-md border border-wine/20 bg-petal/50 p-5">
            <h4 className="mb-2 font-display text-display-sm text-wine-600">Danger zone</h4>
            <p className="mb-4 text-sm text-ink-600">
              Reset all store data back to the original demo defaults. This removes all products, orders, customers, and settings changes.
            </p>
            <button
              type="button"
              onClick={onResetStore}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-wine-600 bg-white px-4 font-bold text-wine-600 transition hover:bg-wine-700 hover:text-white"
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
        <div key={label} className="rounded-md border border-brass-200 bg-ink-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-ink-600">{label}</span>
            <Icon size={18} className="text-clay-700" />
          </div>
          <strong className="mt-2 block text-3xl">{value}</strong>
        </div>
      ))}
    </div>
  );
}

function ResponsiveTable({ headers, rows, empty = "No records yet." }) {
  return (
    <div className="overflow-x-auto rounded-md border border-brass-200">
      <table className="min-w-[760px] w-full border-collapse bg-ink-50 text-sm">
        <thead className="bg-ink-200 text-left text-xs uppercase tracking-wide text-ink-600">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-brass-200 px-4 py-3">
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
                  <td key={cellIndex} className="border-b border-brass-200 px-4 py-3 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-ink-600">
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
        className="h-10 w-24 rounded-md border border-brass-600 px-2"
      />
      <button type="button" onClick={() => onSave(value)} className="h-10 rounded-md bg-garden-700 px-3 text-sm font-bold text-white">
        Save
      </button>
    </div>
  );
}

function PromoCard({ code, title, copy }) {
  return (
    <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
      <span className="inline-flex rounded-full bg-wine-100 px-3 py-1 text-xs font-black text-wine-600">
        {code}
      </span>
      <h4 className="mt-4 font-display text-display-sm text-wine-800">{title}</h4>
      <p className="mt-2 text-sm text-ink-600">{copy}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-brass-200 py-2 last:border-b-0">
      <span className="text-ink-600">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}

function TextInput({ label, name, type = "text", defaultValue = "", required = false }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
      />
    </label>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-md border border-dashed border-brass-200 bg-ink-100 p-6 text-center text-sm text-ink-600">
      {text}
    </div>
  );
}
