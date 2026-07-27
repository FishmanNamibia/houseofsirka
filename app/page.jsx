"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  LogIn,
  LogOut,
  Maximize2,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { evaluatePromotion, incrementPromotionUsage } from "@/lib/promotions";
import {
  COLOR_SWATCHES as swatches,
  CUSTOMER_KEY,
  STORAGE_KEY,
  initialStore,
  normalizeStore,
} from "@/lib/catalog";
import {
  classNames,
  money,
  productPrice,
  splitLines,
  totalStock,
  uid,
  unique,
} from "@/lib/format";
import { fileToDataUrl } from "@/lib/media";


export default function Home() {
  const [store, setStore] = useState(initialStore);
  const [hydrated, setHydrated] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    size: "All",
    color: "All",
    maxPrice: 2800,
    sort: "Featured",
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageViewerProductId, setImageViewerProductId] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStore(normalizeStore(JSON.parse(saved)));
      } catch {
        setStore(initialStore);
      }
    }
    const savedCustomer = window.localStorage.getItem(CUSTOMER_KEY);
    if (savedCustomer) setCustomerEmail(savedCustomer);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const json = JSON.stringify(store);
    try {
      window.localStorage.setItem(STORAGE_KEY, json);
    } catch {
      // Quota exceeded — strip large base64 data URLs and retry
      const lite = JSON.parse(json);
      (lite.products || []).forEach((p) => {
        if (p.image && p.image.length > 2048) p.image = "";
        (p.variants || []).forEach((v) => { if (v.image && v.image.length > 2048) v.image = ""; });
      });
      (lite.orders || []).forEach((o) => {
        if (o.proofOfPayment?.dataUrl && o.proofOfPayment.dataUrl.length > 2048) {
          o.proofOfPayment = { ...o.proofOfPayment, dataUrl: "(too large — view in order)" };
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

  const publishedProducts = useMemo(
    () => store.products.filter((product) => product.status === "Published"),
    [store.products],
  );

  const categories = useMemo(
    () => ["All", ...unique(store.products.map((product) => product.category))],
    [store.products],
  );
  const sizes = useMemo(
    () => ["All", ...unique(store.products.flatMap((product) => product.variants.map((variant) => variant.size)))],
    [store.products],
  );
  const colors = useMemo(
    () => ["All", ...unique(store.products.flatMap((product) => product.variants.map((variant) => variant.color)))],
    [store.products],
  );

  const filteredProducts = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const sorted = publishedProducts.filter((product) => {
      const haystack = [
        product.name,
        product.sku,
        product.category,
        product.collection,
        product.description,
        product.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!search || haystack.includes(search)) &&
        (filters.category === "All" || product.category === filters.category) &&
        (filters.size === "All" || product.variants.some((variant) => variant.size === filters.size)) &&
        (filters.color === "All" || product.variants.some((variant) => variant.color === filters.color)) &&
        productPrice(product) <= Number(filters.maxPrice)
      );
    });

    return sorted.sort((a, b) => {
      if (filters.sort === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sort === "Price low") return productPrice(a) - productPrice(b);
      if (filters.sort === "Price high") return productPrice(b) - productPrice(a);
      return Number(b.tags.includes("Featured")) - Number(a.tags.includes("Featured")) || b.rating - a.rating;
    });
  }, [filters, publishedProducts]);

  const cfg = store.settings;
  const fmt = useMemo(() => (value) => money(value, cfg.currency, cfg.locale), [cfg.currency, cfg.locale]);

  const cartSummary = useMemo(() => {
    return evaluatePromotion({
      cart: store.cart,
      couponCode: store.couponCode,
      promotions: store.promotions,
      products: store.products,
      config: cfg,
    });
  }, [store.cart, store.couponCode, store.products, store.promotions, cfg]);

  const cartCount = store.cart.reduce((sum, line) => sum + line.quantity, 0);
  const imageViewerProduct = imageViewerProductId
    ? publishedProducts.find((product) => product.id === imageViewerProductId)
    : null;

  function customerLogin(email) {
    const normalizedEmail = email.trim().toLowerCase();
    setCustomerEmail(normalizedEmail);
    window.localStorage.setItem(CUSTOMER_KEY, normalizedEmail);
  }

  function customerLogout() {
    setCustomerEmail("");
    window.localStorage.removeItem(CUSTOMER_KEY);
  }

  function setStorePatch(patch) {
    setStore((current) => ({ ...current, ...patch }));
  }

  function show(message) {
    setNotice(message);
  }

  function updateProduct(productId, updater) {
    setStore((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === productId ? updater(product) : product,
      ),
    }));
  }

  function addToCart(product, variantId, quantity = 1) {
    const variant = product.variants.find((item) => item.id === variantId);
    if (!variant || variant.stock < quantity) {
      show("That variant is out of stock.");
      return;
    }

    setStore((current) => {
      const existing = current.cart.find((line) => line.variantId === variantId);
      const nextCart = existing
        ? current.cart.map((line) =>
            line.variantId === variantId
              ? { ...line, quantity: Math.min(variant.stock, line.quantity + quantity) }
              : line,
          )
        : [
            ...current.cart,
            {
              id: uid("cart"),
              productId: product.id,
              variantId,
              name: product.name,
              sku: product.sku,
              size: variant.size,
              color: variant.color,
              image: product.image,
              price: productPrice(product),
              quantity,
            },
          ];

      return { ...current, cart: nextCart };
    });
    setCartOpen(true);
    show(`${product.name} added to cart.`);
  }

  function changeCartQuantity(lineId, change) {
    setStore((current) => ({
      ...current,
      cart: current.cart
        .map((line) => {
          if (line.id !== lineId) return line;
          const product = current.products.find((item) => item.id === line.productId);
          const variant = product?.variants.find((item) => item.id === line.variantId);
          const maxStock = variant?.stock || 1;
          return { ...line, quantity: Math.max(0, Math.min(maxStock, line.quantity + change)) };
        })
        .filter((line) => line.quantity > 0),
    }));
  }

  function toggleWishlist(productId) {
    setStore((current) => ({
      ...current,
      wishlist: current.wishlist.includes(productId)
        ? current.wishlist.filter((id) => id !== productId)
        : [...current.wishlist, productId],
    }));
  }

  function placeOrder({ formData, gatewayResult }) {
    if (!store.cart.length) return;

    const paymentMethod = formData.payment;
    const proofMethods = splitLines(cfg.proofRequiredMethods);
    const proofRequired = proofMethods.includes(paymentMethod);
    const gatewayPaid = gatewayResult && gatewayResult.status === "succeeded";

    let paymentStatus;
    if (gatewayPaid) {
      paymentStatus = "Paid";
    } else if (formData.proofOfPayment) {
      paymentStatus = "Proof uploaded - pending verification";
    } else if (proofRequired) {
      paymentStatus = "Awaiting proof of payment";
    } else if (paymentMethod.toLowerCase().includes("delivery")) {
      paymentStatus = "Payment due on delivery";
    } else {
      paymentStatus = "Awaiting payment";
    }
    const orderStatus = paymentStatus === "Paid" ? "Processing" : "Pending Payment";
    const prefix = cfg.orderPrefix || "HOS";
    const orderNumber = `${prefix}-${String(store.orders.length + 1001).padStart(4, "0")}`;
    const appliedPromotion = cartSummary.appliedPromotion
      ? {
          id: cartSummary.appliedPromotion.id,
          code: cartSummary.appliedPromotion.code,
          name: cartSummary.appliedPromotion.name,
          discount: cartSummary.discount,
        }
      : null;
    const customerEmail = String(formData.email || "").trim().toLowerCase();
    const customerId = `customer-${customerEmail || Date.now()}`;
    const order = {
      id: uid("order"),
      orderNumber,
      customerId,
      customer: formData.name,
      email: customerEmail,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      address: formData.address,
      city: formData.city,
      delivery: formData.delivery,
      payment: paymentMethod,
      status: orderStatus,
      paymentStatus,
      proofOfPayment: formData.proofOfPayment || null,
      gatewayPaymentId: gatewayResult?.paymentId || null,
      promotion: appliedPromotion,
      followUpRequired: paymentStatus !== "Paid",
      registeredCustomer: formData.accountType === "registered",
      marketingOptIn: !!formData.marketingOptIn,
      items: store.cart,
      total: cartSummary.total,
      createdAt: new Date().toISOString(),
    };

    setStore((current) => {
      const products = current.products.map((product) => {
        const orderedForProduct = current.cart.filter((line) => line.productId === product.id);
        if (!orderedForProduct.length) return product;

        return {
          ...product,
          variants: product.variants.map((variant) => {
            const ordered = orderedForProduct.find((line) => line.variantId === variant.id);
            return ordered ? { ...variant, stock: Math.max(0, variant.stock - ordered.quantity) } : variant;
          }),
        };
      });

      const logs = current.cart.map((line) => ({
        id: uid("log"),
        product: line.name,
        variant: `${line.size} / ${line.color}`,
        change: `-${line.quantity}`,
        reason: orderNumber,
        createdAt: new Date().toISOString(),
      }));

      const customerRecord = {
        id: customerId,
        name: formData.name,
        email: customerEmail,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        address: formData.address,
        city: formData.city,
        registered: formData.accountType === "registered",
        marketingOptIn: !!formData.marketingOptIn,
        lastOrderAt: order.createdAt,
      };
      const existingCustomer = current.customers?.find((customer) => customer.email === customerEmail);
      const customers = existingCustomer
        ? current.customers.map((customer) =>
            customer.email === customerEmail
              ? { ...customer, ...customerRecord }
              : customer,
          )
        : [customerRecord, ...(current.customers || [])];

      const promotions = appliedPromotion
        ? incrementPromotionUsage(current.promotions, appliedPromotion.id)
        : current.promotions;

      return {
        ...current,
        products,
        customers,
        promotions,
        orders: [order, ...current.orders],
        inventoryLogs: [...logs, ...current.inventoryLogs],
        cart: [],
        couponCode: "",
      };
    });

    setCheckoutOpen(false);
    setCartOpen(false);
    setViewingOrder(order);
    if (order.email) customerLogin(order.email);
    show(`Order ${orderNumber} placed successfully.`);

    // Send manager/sales notifications (email + WhatsApp) in background
    notifyManager(order, cfg);
  }

  async function notifyManager(order, settings) {
    try {
      // Strip large image blobs from cart items before sending
      const liteItems = (order.items || []).map(({ image, ...rest }) => rest);
      const liteOrder = { ...order, items: liteItems, proofOfPayment: null };

      // Only send settings fields the API actually needs
      const liteSettings = {
        storeName: settings.storeName,
        currency: settings.currency,
        notificationEmail: settings.notificationEmail,
        storeEmail: settings.storeEmail,
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpUser: settings.smtpUser,
        smtpPass: settings.smtpPass,
        smtpEncryption: settings.smtpEncryption,
        emailFromName: settings.emailFromName,
        emailFromAddress: settings.emailFromAddress,
        whatsappNumber: settings.whatsappNumber,
        whatsappApiUrl: settings.whatsappApiUrl,
        whatsappApiToken: settings.whatsappApiToken,
      };

      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: liteOrder, settings: liteSettings }),
      });
      const data = await res.json();

      if (data.results?.email?.sent) {
        show(`📧 Order notification emailed to ${data.results.email.to}`);
      }

      // If WhatsApp API is not configured, open the click-to-send URL
      if (data.results?.whatsapp?.url && !data.results.whatsapp.api) {
        window.open(data.results.whatsapp.url, "_blank");
      } else if (data.results?.whatsapp?.sent) {
        show("📱 WhatsApp notification sent to manager.");
      }
    } catch (err) {
      console.error("Manager notification failed:", err);
    }
  }

  return (
    <main id="main" className="min-h-screen bg-ink-100 text-ink-900">
      <div className="bg-garden-700 px-4 py-2 text-center text-sm font-semibold text-white">
        {store.content.announcement}
      </div>

      <header className="sticky top-0 z-30 border-b border-brass-200 bg-pearl/88 px-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 py-4">
          <a href="#shop" className="flex items-center">
            <img
              src="/house-of-sirka-logo-final.png"
              alt="House of Sirka"
              className="h-auto w-[170px] sm:w-[220px]"
            />
          </a>

          <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold">
            {[
              { label: "Shop", href: "#shop" },
              { label: "Collections", href: "#collections" },
              { label: "Account", href: "#account" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-ink-800 transition hover:bg-wine-50 hover:text-wine-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-wine-600 bg-wine-600 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-wine-700"
          >
            <ShoppingBag size={18} />
            Cart
            <span className="grid min-w-6 place-items-center rounded-full bg-brass-300 px-2 py-0.5 text-xs text-ink-900">
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      <section id="shop" className="floral-paper relative overflow-hidden border-b border-brass-200">
        <div className="mx-auto grid min-h-[calc(100vh-116px)] max-w-7xl gap-10 px-4 py-12 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-brass-200 bg-pearl/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-garden-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brass-300" />
              {store.content.heroBadge}
            </div>
            <h1 className="sr-only">{store.content.heroTitle}</h1>
            <div className="w-fit max-w-full border border-brass-200 bg-pearl/82 p-4 shadow-sm backdrop-blur">
              <img
                src="/house-of-sirka-logo-final.png"
                alt="House of Sirka Intimate Collections"
                className="h-auto w-[min(430px,82vw)]"
              />
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-700 md:text-xl">
              {store.content.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-wine-600 px-5 font-bold text-white shadow-sm transition hover:bg-wine-700"
              >
                {store.content.heroCtaPrimary} <ChevronRight size={18} />
              </a>
              <a
                href="#collections"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-brass-200 bg-ink-50 px-5 font-bold text-garden-700 transition hover:border-wine-600 hover:text-wine-600"
              >
                {store.content.heroCtaSecondary} <Heart size={18} />
              </a>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["New pieces", publishedProducts.length],
                ["Sizes held", store.products.reduce((sum, product) => sum + totalStock(product), 0)],
                ["Orders dressed", store.orders.length],
              ].map(([label, value]) => (
                <div key={label} className="border border-brass-200 bg-pearl/82 p-4 shadow-sm">
                  <span className="text-xs font-bold uppercase text-ink-600">{label}</span>
                  <strong className="mt-1 block font-display text-display-sm text-wine-600">{value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <div className="absolute left-0 top-8 hidden w-48 border border-brass-200 bg-ink-50 p-4 shadow-soft md:block">
              <p className="font-display text-display-sm text-wine-800">{store.content.fittingNoteTitle}</p>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                {store.content.fittingNoteText}
              </p>
            </div>
            <div className="absolute right-0 top-0 h-[82%] w-[78%] border border-brass-200 bg-ink-200 p-3 shadow-soft">
              <img
                src={store.content.heroImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-8 w-[58%] border border-brass-200 bg-ink-50 p-3 shadow-soft">
              <img
                src={store.content.heroSecondaryImage}
                alt=""
                className="h-64 w-full object-cover"
              />
              <div className="flex items-center justify-between gap-3 px-2 py-3">
                <span className="font-display text-display-sm text-wine-800">{store.content.heroSecondaryLabel}</span>
                <span className="rounded-full bg-brass-300 px-3 py-1 text-xs font-black text-ink-900">
                  {store.content.heroSecondaryBadge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lace-edge h-3 bg-ink-50 text-brass/45" aria-hidden="true" />

      <section id="collections" className="border-b border-brass-200 bg-ink-50 px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow={store.content.collectionsEyebrow} title={store.content.campaignTitle} copy={store.content.campaignCopy} />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              [store.content.collection1Title, store.content.collection1Category, store.content.collection1Image],
              [store.content.collection2Title, store.content.collection2Category, store.content.collection2Image],
              [store.content.collection3Title, store.content.collection3Category, store.content.collection3Image],
              [store.content.collection4Title, store.content.collection4Category, store.content.collection4Image],
            ].filter(([t]) => t).map(([title, category, image]) => (
              <button
                key={title}
                type="button"
                onClick={() => {
                  setFilters((current) => ({ ...current, category }));
                  document.querySelector("#catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative min-h-72 overflow-hidden rounded-md border border-brass-200 bg-ink-200 text-left shadow-sm"
              >
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                {/* Scrim must guarantee contrast over an arbitrary photo, so the
                    bottom band stays opaque rather than fading to near-transparent. */}
                <span className="absolute inset-0 bg-gradient-to-t from-wine-950/85 via-wine-950/45 to-transparent" />
                <span className="absolute bottom-0 block p-5 text-white">
                  <span className="block font-display text-display-sm">{title}</span>
                  <span className="mt-1 block text-body-sm font-bold uppercase tracking-[0.16em] text-wine-100">
                    {category}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="bg-ink-100 px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow={store.content.catalogEyebrow}
              title={store.content.catalogTitle}
              copy={store.content.catalogCopy}
            />
          </div>

          <div className="mt-8 grid gap-3 rounded-md border border-brass-200 bg-ink-50 p-4 shadow-sm lg:grid-cols-[1.3fr_repeat(5,1fr)]">
            <label className="grid gap-2 text-sm font-bold text-ink-700">
              <span className="inline-flex items-center gap-2"><Search size={16} /> Search</span>
              <input
                value={filters.search}
                onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                placeholder="Dress, blazer, silk"
                className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
              />
            </label>
            <SelectFilter label="Category" value={filters.category} options={categories} onChange={(value) => setFilters({ ...filters, category: value })} />
            <SelectFilter label="Size" value={filters.size} options={sizes} onChange={(value) => setFilters({ ...filters, size: value })} />
            <SelectFilter label="Color" value={filters.color} options={colors} onChange={(value) => setFilters({ ...filters, color: value })} />
            <label className="grid gap-2 text-sm font-bold text-ink-700">
              <span className="inline-flex items-center gap-2"><SlidersHorizontal size={16} /> Max price</span>
              <input
                type="range"
                min="400"
                max="3000"
                step="50"
                value={filters.maxPrice}
                onChange={(event) => setFilters({ ...filters, maxPrice: Number(event.target.value) })}
                className="range-thumb h-11 accent-wine"
              />
              <span className="text-xs text-ink-600">{fmt(filters.maxPrice)}</span>
            </label>
            <SelectFilter
              label="Sort"
              value={filters.sort}
              options={["Featured", "Newest", "Price low", "Price high"]}
              onChange={(value) => setFilters({ ...filters, sort: value })}
            />
          </div>

          <div className="mt-5 text-sm font-semibold text-ink-600">
            Showing {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={store.wishlist.includes(product.id)}
                fmt={fmt}
                onView={() => setSelectedProduct(product)}
                onEnlarge={() => setImageViewerProductId(product.id)}
                onWish={() => toggleWishlist(product.id)}
                onQuickAdd={() => {
                  const variant = product.variants.find((item) => item.stock > 0);
                  if (variant) addToCart(product, variant.id);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="account" className="bg-wine-50 px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow={store.content.accountEyebrow}
            title={store.content.accountTitle}
            copy={store.content.accountCopy}
          />

          {!customerEmail ? (
            <div className="mt-8 mx-auto max-w-md">
              <div className="rounded-md border border-brass-200 bg-ink-50 p-6 shadow-sm">
                <LogIn className="mb-4 text-wine-600" size={24} />
                <h3 className="font-display text-display-sm text-wine-800">Customer login</h3>
                <p className="mt-2 text-sm text-ink-600">
                  Enter the email address you used when placing your order.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const email = new FormData(e.currentTarget).get("loginEmail");
                    if (email) {
                      customerLogin(email);
                      show("Logged in successfully.");
                    }
                  }}
                  className="mt-5 grid gap-3"
                >
                  <TextInput name="loginEmail" type="email" label="Email address" required />
                  <button type="submit" className="h-11 rounded-md bg-wine-600 font-bold text-white transition hover:bg-wine-700">
                    View my orders
                  </button>
                </form>
                <p className="mt-4 text-xs text-ink-600">
                  If you checked out as a guest, use the same email to see your order history.
                </p>
              </div>
            </div>
          ) : (
            <CustomerAccountView
              store={store}
              customerEmail={customerEmail}
              fmt={fmt}
              onViewOrder={(order) => setViewingOrder(order)}
              onLogout={customerLogout}
              onSelectProduct={(product) => setSelectedProduct(product)}
            />
          )}
        </div>
      </section>

      <footer className="bg-wine-800 px-4 py-8 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 w-56 bg-ink-50 p-2">
              <img src="/house-of-sirka-logo-final.png" alt="House of Sirka" className="h-auto w-full" />
            </div>
            <p className="mt-1 max-w-2xl text-sm text-white/85">
              {store.content.footerTagline}
            </p>
          </div>
          <div className="grid gap-2 text-sm text-white/85">
            {cfg.supportEmail && <span>Email: {cfg.supportEmail}</span>}
            {cfg.storePhone && <span>Phone: {cfg.storePhone}</span>}
            {cfg.whatsappNumber && (
              <a
                href={`https://wa.me/${cfg.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-white/90 underline transition hover:text-white"
              >
                WhatsApp us
              </a>
            )}
          </div>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        cart={store.cart}
        summary={cartSummary}
        couponCode={store.couponCode}
        fmt={fmt}
        onClose={() => setCartOpen(false)}
        onQuantity={changeCartQuantity}
        onCoupon={(couponCode) => setStorePatch({ couponCode })}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          wished={store.wishlist.includes(selectedProduct.id)}
          catalogueProducts={publishedProducts}
          fmt={fmt}
          onClose={() => setSelectedProduct(null)}
          onEnlarge={() => setImageViewerProductId(selectedProduct.id)}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onWish={() => toggleWishlist(selectedProduct.id)}
          onAdd={(variantId, quantity) => {
            addToCart(selectedProduct, variantId, quantity);
            setSelectedProduct(null);
          }}
        />
      )}

      {imageViewerProduct && (
        <ImageCatalogueViewer
          product={imageViewerProduct}
          products={publishedProducts}
          onClose={() => setImageViewerProductId(null)}
          onSelect={(product) => setImageViewerProductId(product.id)}
          onViewProduct={(product) => {
            setSelectedProduct(product);
            setImageViewerProductId(null);
          }}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={store.cart}
          summary={cartSummary}
          settings={cfg}
          fmt={fmt}
          customer={customerEmail ? store.customers?.find((c) => c.email === customerEmail) : null}
          onClose={() => setCheckoutOpen(false)}
          onSubmit={placeOrder}
        />
      )}

      {viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          settings={cfg}
          fmt={fmt}
          onClose={() => setViewingOrder(null)}
        />
      )}

      {notice && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white shadow-soft">
          {notice}
        </div>
      )}
    </main>
  );
}

function SectionTitle({ eyebrow, title, copy }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-clay-700">{eyebrow}</p>
      <h2 className="font-display text-display-md leading-tight text-wine-800 md:text-display-lg">{title}</h2>
      {copy && <p className="mt-3 max-w-2xl text-ink-600">{copy}</p>}
    </div>
  );
}

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ProductCard({ product, wished, fmt, onView, onEnlarge, onWish, onQuickAdd }) {
  const stock = totalStock(product);
  const colors = unique(product.variants.map((variant) => variant.color));

  return (
    <article className="group overflow-hidden rounded-md border border-brass-200 bg-ink-50 shadow-sm transition hover:-translate-y-1 hover:border-brass-400 hover:shadow-soft">
      <div className="relative aspect-[4/5] bg-ink-200 p-3">
        <button type="button" onClick={onView} className="block h-full w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
          />
        </button>
        <span
          className={classNames(
            "absolute left-5 top-5 rounded-full border border-brass-200 bg-pearl/94 px-3 py-1 text-xs font-black shadow-sm",
            stock <= 2 ? "text-wine-600" : "text-garden-700",
          )}
        >
          {stock ? `${stock} in stock` : "Out of stock"}
        </span>
        <button
          type="button"
          onClick={onWish}
          className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-brass-200 bg-pearl/94 text-wine-600 shadow-sm"
          aria-label="Toggle wishlist"
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={onEnlarge}
          className="absolute bottom-5 right-5 inline-flex h-10 items-center gap-2 rounded-full border border-brass-200 bg-pearl/94 px-3 text-xs font-black text-garden-700 shadow-sm transition hover:text-wine-600"
          aria-label={`Enlarge ${product.name} image`}
        >
          <Maximize2 size={15} /> Enlarge
        </button>
      </div>
      <div className="grid gap-3 p-4">
        <div className="flex justify-between gap-3 text-xs font-bold uppercase tracking-[0.16em] text-garden-700">
          <span>{product.category}</span>
          <span>{product.sku}</span>
        </div>
        <div>
          <h3 className="font-display text-display-sm leading-tight text-wine-800">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink-600">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1">
            {colors.map((color) => (
              <span
                key={color}
                title={color}
                className="h-5 w-5 rounded-full border border-brass-200"
                style={{ backgroundColor: swatches[color] || "#ddd" }}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-ink-600">{product.rating}/5</span>
        </div>
        <div className="flex items-baseline gap-2">
          <strong className="text-lg">{fmt(productPrice(product))}</strong>
          {product.salePrice && <del className="text-sm text-ink-600">{fmt(product.price)}</del>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onView}
            className="h-11 rounded-md bg-wine-600 px-3 text-sm font-bold text-white transition hover:bg-wine-700"
          >
            View
          </button>
          <button
            type="button"
            disabled={!stock}
            onClick={onQuickAdd}
            className="h-11 rounded-md border border-brass-200 bg-ink-100 px-3 text-sm font-bold text-garden-700 transition hover:border-wine-600 hover:text-wine-600"
          >
            Quick add
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductModal({
  product,
  wished,
  catalogueProducts,
  fmt,
  onClose,
  onEnlarge,
  onSelectProduct,
  onWish,
  onAdd,
}) {
  const firstVariant = product.variants.find((variant) => variant.stock > 0) || product.variants[0];
  const [variantId, setVariantId] = useState(firstVariant?.id || "");
  const [quantity, setQuantity] = useState(1);
  const moreProducts = catalogueProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 6);

  useEffect(() => {
    const nextVariant = product.variants.find((variant) => variant.stock > 0) || product.variants[0];
    setVariantId(nextVariant?.id || "");
    setQuantity(1);
  }, [product]);

  return (
    <Overlay onClose={onClose}>
      <div className="grid max-h-[calc(100vh-2rem)] w-[min(1000px,calc(100vw-2rem))] overflow-auto rounded-md border border-brass-200 bg-ink-50 shadow-soft lg:grid-cols-[.9fr_1fr]">
        <div className="relative min-h-96 bg-ink-200 p-3 lg:min-h-[620px]">
          <button
            type="button"
            onClick={onEnlarge}
            className="block h-full w-full overflow-hidden"
            aria-label={`Enlarge ${product.name} image`}
          >
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </button>
          <button
            type="button"
            onClick={onEnlarge}
            className="absolute bottom-6 right-6 inline-flex h-11 items-center gap-2 rounded-full border border-brass-200 bg-pearl/95 px-4 text-sm font-black text-garden-700 shadow-soft transition hover:text-wine-600"
          >
            <Maximize2 size={17} /> Enlarge image
          </button>
        </div>
        <div className="grid content-start gap-5 p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-clay-700">{product.category}</p>
              <h2 className="mt-2 font-display text-display-md leading-tight text-wine-800">{product.name}</h2>
            </div>
            <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-md border border-brass-200">
              <X size={18} />
            </button>
          </div>
          <div className="flex items-baseline gap-3">
            <strong className="text-2xl">{fmt(productPrice(product))}</strong>
            {product.salePrice && <del className="text-ink-600">{fmt(product.price)}</del>}
          </div>
          <p className="text-ink-700">{product.description}</p>
          <div className="grid gap-3 rounded-md border border-brass-200 bg-ink-100 p-4 text-sm">
            <InfoRow label="SKU" value={product.sku} />
            <InfoRow label="Collection" value={product.collection} />
            <InfoRow label="Reviews" value={`${product.rating}/5 boutique rating`} />
          </div>
          <label className="grid gap-2 text-sm font-bold text-ink-700">
            Size and color
            <select
              value={variantId}
              onChange={(event) => setVariantId(event.target.value)}
              className="h-11 rounded-md border border-brass-600 px-3"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id} disabled={!variant.stock}>
                  {variant.size} / {variant.color} - {variant.stock} available
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink-700">
            Quantity
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value || 1))}
              className="h-11 rounded-md border border-brass-600 px-3"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              onClick={() => onAdd(variantId, quantity)}
              disabled={!variantId}
              className="h-12 rounded-md bg-wine-600 px-5 font-bold text-white transition hover:bg-wine-700"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={onWish}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-brass-200 bg-ink-100 px-5 font-bold text-garden-700"
            >
              <Heart size={18} fill={wished ? "currentColor" : "none"} /> Wishlist
            </button>
          </div>
          <div className="border-t border-brass-200 pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-display text-display-sm text-wine-800">Catalogue view</h3>
              <button
                type="button"
                onClick={onEnlarge}
                className="inline-flex items-center gap-2 text-sm font-bold text-garden-700 transition hover:text-wine-600"
              >
                <Maximize2 size={16} /> Open larger
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {moreProducts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectProduct(item)}
                  className="group overflow-hidden rounded-md border border-brass-200 bg-ink-200 p-1 text-left transition hover:border-wine-600"
                  title={item.name}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-[3/4] w-full object-cover transition group-hover:scale-105"
                  />
                  <span className="mt-1 block truncate px-1 text-xs font-bold text-ink-700">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

function ImageCatalogueViewer({ product, products, onClose, onSelect, onViewProduct }) {
  const activeIndex = products.findIndex((item) => item.id === product.id);
  const previousProduct = products[(activeIndex - 1 + products.length) % products.length];
  const nextProduct = products[(activeIndex + 1) % products.length];

  function moveTo(nextItem) {
    if (nextItem) onSelect(nextItem);
  }

  return (
    <Overlay onClose={onClose}>
      <div className="grid max-h-[calc(100vh-2rem)] w-[min(1180px,calc(100vw-2rem))] overflow-hidden rounded-md border border-brass-200 bg-ink text-white shadow-soft lg:grid-cols-[1fr_310px]">
        <div className="relative grid min-h-[68vh] place-items-center bg-black">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[78vh] w-full object-contain"
          />
          <button
            type="button"
            onClick={() => moveTo(previousProduct)}
            className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-pearl/90 text-ink-900 shadow-soft transition hover:bg-white"
            aria-label="Previous product image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => moveTo(nextProduct)}
            className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-pearl/90 text-ink-900 shadow-soft transition hover:bg-white"
            aria-label="Next product image"
          >
            <ChevronRight size={22} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-pearl/90 text-ink-900 shadow-soft transition hover:bg-white"
            aria-label="Close image viewer"
          >
            <X size={18} />
          </button>
        </div>

        <aside className="grid max-h-[78vh] content-start gap-4 overflow-auto bg-ink-50 p-5 text-ink-900">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay-700">Catalogue image</p>
            <h2 className="mt-2 font-display text-display-sm text-wine-800">{product.name}</h2>
            <p className="mt-1 text-sm text-ink-600">
              {product.category} / {product.collection}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onViewProduct(product)}
            className="h-11 rounded-md bg-wine-600 px-4 text-sm font-bold text-white transition hover:bg-wine-700"
          >
            View product details
          </button>
          <div>
            <h3 className="mb-3 font-display text-display-sm text-wine-800">More products</h3>
            <div className="grid grid-cols-2 gap-2">
              {products.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={classNames(
                    "overflow-hidden rounded-md border bg-ink-200 p-1 text-left transition",
                    item.id === product.id ? "border-wine-600" : "border-brass-200 hover:border-wine-600",
                  )}
                >
                  <img src={item.image} alt={item.name} className="aspect-[3/4] w-full object-cover" />
                  <span className="mt-1 block truncate px-1 text-xs font-bold text-ink-700">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </Overlay>
  );
}

function CartDrawer({ open, cart, summary, couponCode, fmt, onClose, onQuantity, onCoupon, onCheckout }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 grid h-screen w-[min(430px,100vw)] grid-rows-[auto_1fr_auto] bg-ink-50 p-5 shadow-soft">
        <div className="flex items-center justify-between border-b border-brass-200 pb-4">
          <h2 className="font-display text-display-sm text-wine-800">Cart</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-md border border-brass-200">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-auto py-4">
          {cart.length ? (
            <div className="grid gap-4">
              {cart.map((line) => (
                <div key={line.id} className="grid grid-cols-[76px_1fr] gap-3 border-b border-brass-200 pb-4">
                  <img src={line.image} alt="" className="h-24 w-20 rounded object-cover" />
                  <div className="grid gap-1">
                    <strong>{line.name}</strong>
                    <span className="text-sm text-ink-600">
                      {line.size} / {line.color}
                    </span>
                    <span className="text-sm font-bold">{fmt(line.price * line.quantity)}</span>
                    {line.quantity > 1 && <span className="text-xs text-ink-600">{fmt(line.price)} each</span>}
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" onClick={() => onQuantity(line.id, -1)} className="grid h-8 w-8 place-items-center rounded border border-brass-200 transition hover:border-wine-600 hover:text-wine-600">
                        <Minus size={14} />
                      </button>
                      <span className="min-w-8 text-center font-bold">{line.quantity}</span>
                      <button type="button" onClick={() => onQuantity(line.id, 1)} className="grid h-8 w-8 place-items-center rounded border border-brass-200 transition hover:border-wine-600 hover:text-wine-600">
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuantity(line.id, -line.quantity)}
                        className="ml-2 grid h-8 w-8 place-items-center rounded border border-brass-200 text-ink-600 transition hover:border-wine-600 hover:text-wine-600"
                        title="Remove from cart"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Your cart is ready for the first piece." />
          )}
        </div>
        <div className="border-t border-brass-200 pt-4">
          <label className="grid gap-2 text-sm font-bold text-ink-700">
            Coupon
            <input
              value={couponCode}
              onChange={(event) => onCoupon(event.target.value)}
              placeholder="SIRKA10 or FREESHIP"
              className="h-11 rounded-md border border-brass-600 px-3"
            />
          </label>
          {summary.couponMessage && (
            <div
              className={classNames(
                "mt-3 rounded-md px-3 py-2 text-sm font-semibold",
                summary.couponValid
                  ? "bg-garden/10 text-garden-700"
                  : "bg-wine-50 text-wine-600",
              )}
            >
              {summary.couponMessage}
            </div>
          )}
          <SummaryRows summary={summary} fmt={fmt} />
          <button
            type="button"
            disabled={!cart.length}
            onClick={onCheckout}
            className="mt-4 h-12 w-full rounded-md bg-wine-600 font-bold text-white transition hover:bg-wine-700"
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}

function CheckoutModal({ cart, summary, settings, fmt, customer, onClose, onSubmit }) {
  const paymentMethodsList = splitLines(settings.paymentMethods);
  const deliveryOptionsList = splitLines(settings.deliveryOptions);
  const proofMethods = splitLines(settings.proofRequiredMethods);
  const autoMethods = splitLines(settings.autoConfirmMethods);
  const c = customer || {};
  const hasGateway = settings.paymentGateway && settings.paymentGateway !== "none";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodsList[0] || "");
  const [processing, setProcessing] = useState(false);
  const [cardFields, setCardFields] = useState({ number: "", expiry: "", cvc: "", holder: "" });

  const proofRequired = proofMethods.includes(paymentMethod);
  const isOnlinePayment = autoMethods.includes(paymentMethod);

  const stepLabels = ["Details", "Payment", "Confirm"];

  async function handleDetailsSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const proofFile = form.get("proofOfPayment");
    const proofUploaded = proofFile instanceof File && proofFile.size > 0;

    if (proofRequired && !proofUploaded) {
      return;
    }

    let proofOfPayment = null;
    if (proofUploaded) {
      proofOfPayment = {
        name: proofFile.name,
        type: proofFile.type,
        size: proofFile.size,
        dataUrl: await fileToDataUrl(proofFile),
        uploadedAt: new Date().toISOString(),
      };
    }

    setFormData({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      whatsapp: form.get("whatsapp"),
      city: form.get("city"),
      accountType: form.get("accountType"),
      delivery: form.get("delivery"),
      address: form.get("address"),
      payment: form.get("payment"),
      marketingOptIn: form.has("marketingOptIn"),
      proofOfPayment,
    });
    setStep(2);
  }

  function processOnlinePayment() {
    const { number, expiry, cvc, holder } = cardFields;
    if (!number.replace(/\s/g, "") || !expiry || !cvc || !holder.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setFormData((prev) => ({
        ...prev,
        gatewayResult: {
          status: "succeeded",
          paymentId: `pi_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
          gateway: settings.paymentGateway,
          mode: settings.gatewayMode,
          last4: number.replace(/\s/g, "").slice(-4),
          processedAt: new Date().toISOString(),
        },
      }));
      setStep(3);
    }, 2200);
  }

  function confirmOrder() {
    onSubmit({
      formData,
      gatewayResult: formData.gatewayResult || null,
    });
  }

  return (
    <Overlay onClose={onClose}>
      <div className="max-h-[calc(100vh-2rem)] w-[min(980px,calc(100vw-2rem))] overflow-auto rounded-md border border-brass-200 bg-ink-50 p-5 shadow-soft md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay-700">Secure checkout</p>
            <h2 className="mt-2 font-display text-display-md text-wine-800">
              {step === 1 ? "Your details" : step === 2 ? "Payment" : "Confirm order"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-md border border-brass-200">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {stepLabels.map((label, index) => (
            <div key={label} className="text-center">
              <span
                className={classNames(
                  "block h-2 rounded-full transition-colors",
                  index + 1 <= step ? "bg-wine-600" : "bg-brass/20",
                )}
              />
              <span className={classNames("mt-1 block text-xs font-bold", index + 1 <= step ? "text-wine-600" : "text-ink-600")}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            {step === 1 && (
              <form onSubmit={handleDetailsSubmit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput name="name" label="Full name" defaultValue={c.name || ""} required />
                  <TextInput name="email" type="email" label="Email" defaultValue={c.email || ""} required />
                  <TextInput name="phone" label="Phone" defaultValue={c.phone || ""} required />
                  <TextInput name="whatsapp" label="WhatsApp number" defaultValue={c.whatsapp || ""} />
                  <TextInput name="city" label="Town / city" defaultValue={c.city || settings.defaultCity || "Windhoek"} required />
                  <label className="grid gap-2 text-sm font-bold text-ink-700">
                    Customer type
                    <select name="accountType" className="h-11 rounded-md border border-brass-600 px-3">
                      <option value="registered">Register customer profile</option>
                      <option value="guest">Guest checkout</option>
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-ink-700">
                    Delivery option
                    <select name="delivery" className="h-11 rounded-md border border-brass-600 px-3">
                      {deliveryOptionsList.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-ink-700 sm:col-span-2">
                    Shipping address
                    <input name="address" required defaultValue={c.address || ""} placeholder="Street, suburb, town, country" className="h-11 rounded-md border border-brass-600 px-3" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-ink-700 sm:col-span-2">
                    Payment method
                    <select
                      name="payment"
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="h-11 rounded-md border border-brass-600 px-3"
                    >
                      {paymentMethodsList.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </label>
                  {proofRequired && (
                    <label className="grid gap-2 text-sm font-bold text-ink-700 sm:col-span-2">
                      Proof of payment
                      <input
                        name="proofOfPayment"
                        type="file"
                        accept="image/*,.pdf"
                        required
                        className="rounded-md border border-brass-600 bg-white px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-petal file:px-3 file:py-2 file:text-sm file:font-bold file:text-wine"
                      />
                      <span className="text-xs font-medium text-ink-600">
                        Required for {paymentMethod}. Upload a screenshot, photo, or PDF proof before checkout.
                      </span>
                    </label>
                  )}
                  <label className="flex items-center gap-2 text-sm font-bold text-ink-700 sm:col-span-2">
                    <input name="marketingOptIn" type="checkbox" className="h-4 w-4" />
                    Receive order updates and follow-up messages
                  </label>
                </div>
                <button type="submit" className="h-12 rounded-md bg-wine-600 font-bold text-white transition hover:bg-wine-700">
                  Continue to payment
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                {isOnlinePayment && hasGateway && (
                  <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <CreditCard size={20} className="text-wine-600" />
                      <h3 className="font-bold text-wine-800">Card payment</h3>
                      <span className="ml-auto rounded-full bg-brass/10 px-2 py-0.5 text-[10px] font-black uppercase text-ink-600">
                        {settings.paymentGateway} · {settings.gatewayMode}
                      </span>
                    </div>
                    <p className="mb-4 text-sm text-ink-600">
                      Enter your card details below. Your payment will be processed securely via {settings.paymentGateway}.
                    </p>
                    <div className="grid gap-3">
                      <label className="grid gap-2 text-sm font-bold text-ink-700">
                        Cardholder name
                        <input
                          value={cardFields.holder}
                          onChange={(e) => setCardFields((f) => ({ ...f, holder: e.target.value }))}
                          placeholder="Name on card"
                          className="h-11 rounded-md border border-brass-600 px-3"
                          required
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-bold text-ink-700">
                        Card number
                        <input
                          value={cardFields.number}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                            setCardFields((f) => ({ ...f, number: raw.replace(/(.{4})/g, "$1 ").trim() }));
                          }}
                          placeholder="4242 4242 4242 4242"
                          className="h-11 rounded-md border border-brass-600 px-3 font-mono tracking-wider"
                          required
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="grid gap-2 text-sm font-bold text-ink-700">
                          Expiry
                          <input
                            value={cardFields.expiry}
                            onChange={(e) => {
                              let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                              if (raw.length > 2) raw = raw.slice(0, 2) + "/" + raw.slice(2);
                              setCardFields((f) => ({ ...f, expiry: raw }));
                            }}
                            placeholder="MM/YY"
                            className="h-11 rounded-md border border-brass-600 px-3 font-mono"
                            required
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-bold text-ink-700">
                          CVC
                          <input
                            value={cardFields.cvc}
                            onChange={(e) => setCardFields((f) => ({ ...f, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                            placeholder="123"
                            className="h-11 rounded-md border border-brass-600 px-3 font-mono"
                            required
                          />
                        </label>
                      </div>
                    </div>
                    {settings.gatewayMode === "sandbox" && (
                      <p className="mt-3 rounded-md bg-marigold/10 px-3 py-2 text-xs text-ink-600">
                        <strong className="text-ink-800">Test mode:</strong> Use card number <span className="font-mono">4242 4242 4242 4242</span>, any future expiry, and any 3-digit CVC.
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={processing}
                      onClick={processOnlinePayment}
                      className="mt-4 h-12 w-full rounded-md bg-wine-600 font-bold text-white transition hover:bg-wine-700 disabled:opacity-60"
                    >
                      {processing ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Processing payment…
                        </span>
                      ) : (
                        `Pay ${fmt(summary.total)}`
                      )}
                    </button>
                  </div>
                )}

                {isOnlinePayment && !hasGateway && (
                  <div className="rounded-md border border-wine/20 bg-wine-50 p-5">
                    <h3 className="font-bold text-wine-600">Online payment unavailable</h3>
                    <p className="mt-2 text-sm text-ink-700">
                      No payment gateway is configured. Please go back and select a different payment method, or contact the store.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="mt-3 h-10 rounded-md border border-brass-200 px-4 font-bold text-ink-700 transition hover:border-wine-600"
                    >
                      Go back
                    </button>
                  </div>
                )}

                {!isOnlinePayment && paymentMethod.toLowerCase().includes("eft") && (
                  <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
                    <h3 className="font-bold text-wine-800">Bank / EFT transfer</h3>
                    <p className="mt-2 text-sm text-ink-700">
                      Please transfer <strong>{fmt(summary.total)}</strong> to the account below. Your order will be processed once payment is confirmed.
                    </p>
                    <div className="mt-3 rounded-md border border-brass-200 bg-white p-3 text-sm">
                      {settings.bankName && <InfoRow label="Bank" value={settings.bankName} />}
                      {settings.bankAccountName && <InfoRow label="Account name" value={settings.bankAccountName} />}
                      {settings.bankAccountNumber && <InfoRow label="Account number" value={settings.bankAccountNumber} />}
                      {settings.bankBranchCode && <InfoRow label="Branch code" value={settings.bankBranchCode} />}
                      <InfoRow label="Reference" value="Your order number (shown after placing)" />
                      {settings.bankReference && <p className="mt-2 text-xs text-ink-600">{settings.bankReference}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="mt-4 h-12 w-full rounded-md bg-wine-600 font-bold text-white transition hover:bg-wine-700"
                    >
                      I understand — place order
                    </button>
                  </div>
                )}

                {!isOnlinePayment && paymentMethod.toLowerCase().includes("wallet") && (
                  <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
                    <h3 className="font-bold text-wine-800">EWallet payment</h3>
                    <p className="mt-2 text-sm text-ink-700">
                      Send <strong>{fmt(summary.total)}</strong> to the number below.
                    </p>
                    <div className="mt-3 rounded-md border border-brass-200 bg-white p-3 text-sm">
                      {settings.ewalletProvider && <InfoRow label="Provider" value={settings.ewalletProvider} />}
                      {settings.ewalletNumber && <InfoRow label="Send to" value={settings.ewalletNumber} />}
                      <InfoRow label="Reference" value="Your order number (shown after placing)" />
                      {settings.ewalletInstructions && <p className="mt-2 text-xs text-ink-600">{settings.ewalletInstructions}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="mt-4 h-12 w-full rounded-md bg-wine-600 font-bold text-white transition hover:bg-wine-700"
                    >
                      I understand — place order
                    </button>
                  </div>
                )}

                {!isOnlinePayment && paymentMethod.toLowerCase().includes("delivery") && (
                  <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
                    <h3 className="font-bold text-wine-800">Pay upon delivery</h3>
                    <p className="mt-2 text-sm text-ink-700">
                      You will pay <strong>{fmt(summary.total)}</strong> when your order is delivered. Please have the exact amount ready.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="mt-4 h-12 w-full rounded-md bg-wine-600 font-bold text-white transition hover:bg-wine-700"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {!isOnlinePayment && !paymentMethod.toLowerCase().includes("eft") && !paymentMethod.toLowerCase().includes("wallet") && !paymentMethod.toLowerCase().includes("delivery") && (
                  <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
                    <h3 className="font-bold text-wine-800">{paymentMethod}</h3>
                    <p className="mt-2 text-sm text-ink-700">
                      Your order of <strong>{fmt(summary.total)}</strong> will be placed. Payment instructions will follow.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="mt-4 h-12 w-full rounded-md bg-wine-600 font-bold text-white transition hover:bg-wine-700"
                    >
                      Continue
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-10 rounded-md border border-brass-200 font-bold text-ink-600 transition hover:border-wine-600 hover:text-wine-600"
                >
                  ← Back to details
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4">
                <div className="rounded-md border border-brass-200 bg-ink-100 p-5">
                  <h3 className="font-bold text-wine-800">Review your order</h3>
                  <div className="mt-3 grid gap-2 text-sm">
                    <InfoRow label="Name" value={formData?.name} />
                    <InfoRow label="Email" value={formData?.email} />
                    <InfoRow label="Phone" value={formData?.phone} />
                    <InfoRow label="Delivery" value={formData?.delivery} />
                    <InfoRow label="Address" value={formData?.address} />
                    <InfoRow label="Payment" value={formData?.payment} />
                    {formData?.gatewayResult && (
                      <div className="flex items-center gap-2 rounded-md bg-garden/10 px-3 py-2 text-sm font-bold text-garden-700">
                        <Check size={16} />
                        Card ending {formData.gatewayResult.last4} — payment succeeded
                      </div>
                    )}
                    {formData?.proofOfPayment && (
                      <div className="flex items-center gap-2 rounded-md bg-garden/10 px-3 py-2 text-sm font-bold text-garden-700">
                        <Check size={16} />
                        Proof of payment attached
                      </div>
                    )}
                    {!formData?.gatewayResult && !formData?.proofOfPayment && !formData?.payment?.toLowerCase().includes("delivery") && (
                      <div className="rounded-md bg-wine-50 px-3 py-2 text-sm font-bold text-wine-600">
                        Payment pending — complete payment after placing your order.
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={confirmOrder}
                  className="h-12 rounded-md bg-wine-600 font-bold text-white transition hover:bg-wine-700"
                >
                  {formData?.gatewayResult ? "Confirm paid order" : "Place order"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="h-10 rounded-md border border-brass-200 font-bold text-ink-600 transition hover:border-wine-600 hover:text-wine-600"
                >
                  ← Back to payment
                </button>
              </div>
            )}
          </div>

          <div className="rounded-md border border-brass-200 bg-ink-100 p-4">
            <h3 className="font-display text-display-sm text-wine-800">Order review</h3>
            <div className="mt-4 grid gap-3">
              {cart.map((line) => (
                <InfoRow key={line.id} label={`${line.name} x ${line.quantity}`} value={fmt(line.price * line.quantity)} />
              ))}
            </div>
            <SummaryRows summary={summary} fmt={fmt} />
          </div>
        </div>
      </div>
    </Overlay>
  );
}

function OrderDetailModal({ order, settings, fmt, onClose }) {
  const steps = ["Pending Payment", "Processing", "Packed", "Shipped", "Delivered"];
  const activeIndex = Math.max(0, steps.indexOf(order.status));
  const isPaid = order.paymentStatus === "Paid";
  const proofMethods = splitLines(settings.proofRequiredMethods);
  const needsProof = proofMethods.includes(order.payment) && !isPaid;
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString() : "";

  return (
    <Overlay onClose={onClose}>
      <div className="max-h-[calc(100vh-2rem)] w-[min(920px,calc(100vw-2rem))] overflow-auto rounded-md border border-brass-200 bg-ink-50 p-5 shadow-soft md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay-700">Order confirmation</p>
            <h2 className="mt-2 font-display text-display-md text-wine-800">{order.orderNumber}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-md border border-brass-200">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span
            className={classNames(
              "rounded-full px-3 py-1 text-sm font-black",
              isPaid ? "bg-garden/10 text-garden-700" : "bg-wine-50 text-wine-600",
            )}
          >
            {order.paymentStatus}
          </span>
          <span className="rounded-full bg-brass/10 px-3 py-1 text-sm font-bold text-ink-700">
            {order.status}
          </span>
          <span className="text-sm text-ink-600">{dateStr}</span>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1">
          {steps.map((step, index) => (
            <div key={step} className="text-center">
              <span
                className={classNames("block h-2 rounded-full", index <= activeIndex ? "bg-garden-700" : "bg-brass/20")}
              />
              <span className={classNames("mt-1 block text-[10px]", index <= activeIndex ? "font-bold text-garden-700" : "text-ink-600")}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid gap-5">
            <div className="rounded-md border border-brass-200 bg-ink-100 p-4">
              <h3 className="font-bold text-wine-800">Order items</h3>
              <div className="mt-3 grid gap-3">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border-b border-brass-200 pb-3 last:border-b-0 last:pb-0">
                    <img src={item.image} alt="" className="h-16 w-12 rounded object-cover" />
                    <div className="flex-1">
                      <strong className="block text-sm">{item.name}</strong>
                      <span className="text-xs text-ink-600">{item.size} / {item.color} × {item.quantity}</span>
                    </div>
                    <strong className="text-sm">{fmt(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {!isPaid && (
              <div className="rounded-md border border-wine/20 bg-wine-50 p-4">
                <h3 className="font-bold text-wine-600">Payment required</h3>
                <p className="mt-1 text-sm text-ink-700">
                  Your order is confirmed but awaiting payment via <strong>{order.payment}</strong>.
                </p>

                {order.payment === "EFT bank transfer" || (proofMethods.includes(order.payment) && order.payment.toLowerCase().includes("eft")) ? (
                  <div className="mt-3 rounded-md border border-brass-200 bg-white p-3 text-sm">
                    <h4 className="font-bold">Bank / EFT details</h4>
                    <div className="mt-2 grid gap-1">
                      {settings.bankName && <InfoRow label="Bank" value={settings.bankName} />}
                      {settings.bankAccountName && <InfoRow label="Account name" value={settings.bankAccountName} />}
                      {settings.bankAccountNumber && <InfoRow label="Account number" value={settings.bankAccountNumber} />}
                      {settings.bankBranchCode && <InfoRow label="Branch code" value={settings.bankBranchCode} />}
                      <InfoRow label="Reference" value={order.orderNumber} />
                      {settings.bankReference && (
                        <p className="mt-2 text-xs text-ink-600">{settings.bankReference}</p>
                      )}
                    </div>
                  </div>
                ) : null}

                {order.payment === "EWallet transfer" || (proofMethods.includes(order.payment) && order.payment.toLowerCase().includes("wallet")) ? (
                  <div className="mt-3 rounded-md border border-brass-200 bg-white p-3 text-sm">
                    <h4 className="font-bold">EWallet details</h4>
                    <div className="mt-2 grid gap-1">
                      {settings.ewalletProvider && <InfoRow label="Provider" value={settings.ewalletProvider} />}
                      {settings.ewalletNumber && <InfoRow label="Send to" value={settings.ewalletNumber} />}
                      <InfoRow label="Reference" value={order.orderNumber} />
                      {settings.ewalletInstructions && (
                        <p className="mt-2 text-xs text-ink-600">{settings.ewalletInstructions}</p>
                      )}
                    </div>
                  </div>
                ) : null}

                {order.payment?.toLowerCase().includes("delivery") && (
                  <div className="mt-3 rounded-md border border-brass-200 bg-white p-3 text-sm">
                    <p className="text-ink-700">
                      Payment will be collected upon delivery. Please have <strong>{fmt(order.total)}</strong> ready.
                    </p>
                  </div>
                )}

                {needsProof && !order.proofOfPayment && (
                  <p className="mt-3 text-sm font-bold text-wine-600">
                    Please upload your proof of payment to expedite processing. Contact us at {settings.supportEmail || "support"} or WhatsApp {settings.whatsappNumber || ""}.
                  </p>
                )}

                {order.proofOfPayment && (
                  <div className="mt-3 flex items-center gap-2 rounded-md bg-garden/10 px-3 py-2 text-sm font-bold text-garden-700">
                    <Check size={16} />
                    Proof of payment uploaded — awaiting verification.
                  </div>
                )}
              </div>
            )}

            {isPaid && (
              <div className="flex items-center gap-2 rounded-md bg-garden/10 px-4 py-3 text-sm font-bold text-garden-700">
                <Check size={18} />
                Payment confirmed — your order is being processed.
              </div>
            )}
          </div>

          <div className="grid content-start gap-4">
            <div className="rounded-md border border-brass-200 bg-ink-100 p-4">
              <h3 className="font-bold text-wine-800">Order summary</h3>
              <div className="mt-3 grid gap-2 text-sm">
                <InfoRow label="Subtotal" value={fmt(order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0)} />
                {order.promotion && <InfoRow label={`Discount (${order.promotion.code})`} value={`-${fmt(order.promotion.discount)}`} />}
                <InfoRow label="Total" value={fmt(order.total)} />
              </div>
            </div>

            <div className="rounded-md border border-brass-200 bg-ink-100 p-4">
              <h3 className="font-bold text-wine-800">Details</h3>
              <div className="mt-3 grid gap-2 text-sm">
                <InfoRow label="Customer" value={order.customer} />
                <InfoRow label="Email" value={order.email} />
                <InfoRow label="Phone" value={order.phone || "—"} />
                <InfoRow label="Delivery" value={order.delivery} />
                <InfoRow label="Address" value={order.address || "—"} />
                <InfoRow label="Payment" value={order.payment} />
              </div>
            </div>

            {settings.whatsappNumber && (
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I have a question about order ${order.orderNumber}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-garden-700 px-4 font-bold text-white transition hover:bg-garden/90"
              >
                <MessageCircle size={18} /> Contact via WhatsApp
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-brass-200 px-4 font-bold text-ink-700 transition hover:border-wine-600 hover:text-wine-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

function OrderMini({ order, fmt, onClick }) {
  const steps = ["Pending Payment", "Processing", "Packed", "Shipped", "Delivered"];
  const activeIndex = Math.max(0, steps.indexOf(order.status));
  const isPaid = order.paymentStatus === "Paid";
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "";
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-brass-200 bg-ink-100 p-4 text-left transition hover:border-wine-600 hover:shadow-sm"
    >
      <div className="flex justify-between gap-4">
        <strong>{order.orderNumber}</strong>
        <strong>{fmt(order.total)}</strong>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-sm">
        <span className="text-ink-600">{dateStr}</span>
        <span
          className={classNames(
            "rounded-full px-2 py-0.5 text-xs font-black",
            isPaid ? "bg-garden/10 text-garden-700" : "bg-wine-50 text-wine-600",
          )}
        >
          {order.paymentStatus}
        </span>
      </div>
      <div className="mt-1 text-xs text-ink-600">
        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""} · {order.payment} · {order.status}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1">
        {steps.map((step, index) => (
          <span
            key={step}
            title={step}
            className={classNames("h-2 rounded-full", index <= activeIndex ? "bg-garden-700" : "bg-brass/20")}
          />
        ))}
      </div>
    </button>
  );
}

function CustomerAccountView({ store, customerEmail, fmt, onViewOrder, onLogout, onSelectProduct }) {
  const myOrders = store.orders.filter((o) => o.email === customerEmail);
  const myProfile = store.customers?.find((c) => c.email === customerEmail);
  const paidOrders = myOrders.filter((o) => o.paymentStatus === "Paid");
  const pendingOrders = myOrders.filter((o) => o.paymentStatus !== "Paid");
  const totalSpent = paidOrders.reduce((s, o) => s + Number(o.total || 0), 0);

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[.85fr_1.15fr_1fr]">
      <div className="rounded-md border border-brass-200 bg-ink-50 p-5 shadow-sm">
        <User className="mb-4 text-wine-600" size={24} />
        <h3 className="font-display text-display-sm text-wine-800">My account</h3>
        <div className="mt-3 grid gap-2 text-sm">
          <InfoRow label="Name" value={myProfile?.name || "—"} />
          <InfoRow label="Email" value={customerEmail} />
          <InfoRow label="Phone" value={myProfile?.phone || "—"} />
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          <InfoRow label="Orders placed" value={myOrders.length} />
          <InfoRow label="Paid" value={paidOrders.length} />
          <InfoRow label="Awaiting payment" value={pendingOrders.length} />
          <InfoRow label="Total spent" value={fmt(totalSpent)} />
          <InfoRow label="Wishlist" value={store.wishlist.length} />
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-brass-200 text-sm font-bold text-ink-600 transition hover:border-wine-600 hover:text-wine-600"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <div className="rounded-md border border-brass-200 bg-ink-50 p-5 shadow-sm">
        <h3 className="font-display text-display-sm text-wine-800">My orders</h3>
        <div className="mt-4 grid gap-3 max-h-[460px] overflow-y-auto pr-1">
          {myOrders.length ? (
            myOrders.map((order) => (
              <OrderMini
                key={order.id}
                order={order}
                fmt={fmt}
                onClick={() => onViewOrder(order)}
              />
            ))
          ) : (
            <div className="rounded-md border border-brass-200 bg-ink-100 p-4 text-center text-sm text-ink-600">
              No orders found for {customerEmail}. Place an order to see it here.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border border-brass-200 bg-ink-50 p-5 shadow-sm">
        <h3 className="font-display text-display-sm text-wine-800">Wishlist</h3>
        <div className="mt-4 grid gap-3">
          {store.wishlist.length ? (
            store.wishlist
              .map((id) => store.products.find((product) => product.id === id))
              .filter(Boolean)
              .map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="flex items-center gap-3 rounded-md border border-brass-200 bg-white p-2 text-left transition hover:border-wine-600"
                >
                  <img src={product.image} alt="" className="h-16 w-12 rounded object-cover" />
                  <span>
                    <strong className="block">{product.name}</strong>
                    <span className="text-sm text-ink-600">{fmt(productPrice(product))}</span>
                  </span>
                </button>
              ))
          ) : (
            <EmptyState text="Save products to build your wishlist." />
          )}
        </div>
      </div>
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

function SummaryRows({ summary, fmt }) {
  return (
    <div className="mt-4 grid gap-2 text-sm">
      <InfoRow label="Subtotal" value={fmt(summary.subtotal)} />
      <InfoRow label="Discount" value={`-${fmt(summary.discount)}`} />
      <InfoRow label="Shipping" value={summary.shipping ? fmt(summary.shipping) : "Free"} />
      <InfoRow label="Estimated tax" value={fmt(summary.tax)} />
      <div className="flex items-center justify-between gap-4 border-t border-brass-200 pt-3 text-lg">
        <span className="font-bold">Total</span>
        <strong>{fmt(summary.total)}</strong>
      </div>
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

function Overlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" onMouseDown={onClose}>
      <div onMouseDown={(event) => event.stopPropagation()}>{children}</div>
    </div>
  );
}
