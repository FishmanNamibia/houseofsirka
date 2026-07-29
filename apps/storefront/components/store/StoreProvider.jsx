"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { evaluatePromotion, incrementPromotionUsage } from "@/lib/promotions";
import { CUSTOMER_KEY, STORAGE_KEY, initialStore, normalizeStore } from "@/lib/catalog";
import { money, productPrice, splitLines, uid } from "@/lib/format";

const StoreContext = createContext(null);

/**
 * Owns the persisted storefront state so every route shares one cart, wishlist
 * and customer session.
 *
 * Deliberately NOT mounted in the root layout: /admin keeps its own state and
 * its own writer for the same localStorage key, and two live writers in one tab
 * would clobber each other. Storefront routes opt in by wrapping themselves.
 */
export function StoreProvider({ children, products }) {
  const [store, setStore] = useState(
    products ? { ...initialStore, products } : initialStore,
  );
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [notice, setNotice] = useState("");
  const persistedProducts = useRef(initialStore.products);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const restored = normalizeStore(JSON.parse(saved));
        persistedProducts.current = restored.products;
        // The server's catalogue outranks whatever this browser saved.
        //
        // This is the fix for a bug that bit three times — content, then
        // settings, then products — where a returning visitor kept seeing an
        // old catalogue because their localStorage copy shadowed the new one.
        // The root cause was making the visitor's browser the source of truth
        // for data the shop owns. Now the shop owns it: prices, stock and
        // copy come down with the page, and localStorage is demoted to what it
        // is actually for — this person's cart and wishlist.
        setStore(products ? { ...restored, products } : restored);
      } catch {
        setStore(products ? { ...initialStore, products } : initialStore);
      }
    }
    const savedCustomer = window.localStorage.getItem(CUSTOMER_KEY);
    if (savedCustomer) setCustomerEmail(savedCustomer);
    setHydrated(true);
    // Runs once. Product changes are handled by the effect below, so that
    // navigating between routes does not re-read localStorage and stamp over
    // a cart change made a moment ago.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each route supplies its own server-rendered catalogue; adopt it on arrival.
  useEffect(() => {
    if (!products) return;
    setStore((current) => (current.products === products ? current : { ...current, products }));
  }, [products]);

  useEffect(() => {
    if (!hydrated) return;
    // Persist everything except the catalogue. The catalogue now arrives with
    // the page from Medusa, so writing it back would (a) grow this key with
    // data we no longer read and (b) overwrite the separate catalogue the
    // legacy /admin keeps under the same key, which is still the only way to
    // edit copy, settings and orders. Whatever /admin saved is written back
    // untouched.
    const json = JSON.stringify({ ...store, products: persistedProducts.current });
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
          const incoming = normalizeStore(JSON.parse(event.newValue));
          persistedProducts.current = incoming.products;
          // Another tab may still be running the legacy /admin, which writes
          // its own catalogue to this key. Take its cart and wishlist, keep
          // the catalogue this page was served with.
          setStore((current) => ({ ...incoming, products: current.products }));
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

    // The receipt is its own page now, so no modal is opened here; the
    // checkout route navigates to /checkout/confirmation after this returns.
    setCheckoutOpen(false);
    setCartOpen(false);
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
  const value = {
    store, setStore, hydrated, publishedProducts,
    cfg, fmt, cartSummary, cartCount,
    cartOpen, setCartOpen,
    checkoutOpen, setCheckoutOpen,
    viewingOrder, setViewingOrder,
    customerEmail, customerLogin, customerLogout,
    notice, show,
    setStorePatch, updateProduct,
    addToCart, changeCartQuantity, toggleWishlist, placeOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
