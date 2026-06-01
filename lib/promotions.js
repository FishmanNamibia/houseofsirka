export const PROMOTION_TYPES = ["percentage", "fixed", "free-shipping"];
export const PROMOTION_SCOPES = ["all", "category", "collection", "product"];

export function createSeedPromotions() {
  return [
    {
      id: "promo-sirka10",
      name: "Sirka welcome offer",
      code: "SIRKA10",
      type: "percentage",
      value: 10,
      minSubtotal: 800,
      scope: "all",
      scopeValue: "",
      startsAt: "2026-01-01",
      endsAt: "2026-12-31",
      usageLimit: 0,
      usageCount: 0,
      status: "active",
    },
    {
      id: "promo-freeship",
      name: "Free delivery",
      code: "FREESHIP",
      type: "free-shipping",
      value: 0,
      minSubtotal: 0,
      scope: "all",
      scopeValue: "",
      startsAt: "2026-01-01",
      endsAt: "2026-12-31",
      usageLimit: 0,
      usageCount: 0,
      status: "active",
    },
  ];
}

export function normalizePromotions(promotions) {
  const source = Array.isArray(promotions) ? promotions : createSeedPromotions();
  return source.map((promotion) => ({
    id: promotion.id,
    name: promotion.name || promotion.code || "Promotion",
    code: String(promotion.code || "").trim().toUpperCase(),
    type: PROMOTION_TYPES.includes(promotion.type) ? promotion.type : "percentage",
    value: Number(promotion.value || 0),
    minSubtotal: Number(promotion.minSubtotal || 0),
    scope: PROMOTION_SCOPES.includes(promotion.scope) ? promotion.scope : "all",
    scopeValue: String(promotion.scopeValue || "").trim(),
    startsAt: promotion.startsAt || "",
    endsAt: promotion.endsAt || "",
    usageLimit: Number(promotion.usageLimit || 0),
    usageCount: Number(promotion.usageCount || 0),
    status: promotion.status === "inactive" ? "inactive" : "active",
  }));
}

export function promotionTargetLabel(promotion) {
  if (promotion.scope === "all") return "All products";
  if (!promotion.scopeValue) return capitalizeWords(promotion.scope);
  return `${capitalizeWords(promotion.scope)}: ${promotion.scopeValue}`;
}

export function evaluatePromotion({ cart = [], couponCode = "", promotions = [], products = [], config = {} }) {
  const deliveryFee = Number(config.deliveryFee ?? 95);
  const freeDeliveryThreshold = Number(config.freeDeliveryThreshold ?? 1500);
  const taxRate = Number(config.taxRate ?? 15) / 100;
  const currency = config.currency || "N$";
  const normalizedPromotions = normalizePromotions(promotions);
  const subtotal = cart.reduce((sum, line) => sum + Number(line.price || 0) * Number(line.quantity || 0), 0);
  const code = String(couponCode || "").trim().toUpperCase();
  const baseShipping = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;

  if (!code) {
    return buildSummary({
      subtotal,
      discount: 0,
      shipping: baseShipping,
      appliedPromotion: null,
      couponCode: "",
      couponMessage: "",
      valid: false,
      taxRate,
      currency,
    });
  }

  const promotion = normalizedPromotions.find((item) => item.code === code);
  if (!promotion) {
    return buildSummary({
      subtotal,
      discount: 0,
      shipping: baseShipping,
      appliedPromotion: null,
      couponCode: code,
      couponMessage: "That promotion code was not found.",
      valid: false,
      taxRate,
      currency,
    });
  }

  const eligibleSubtotal = getEligibleSubtotal(cart, products, promotion);
  const validation = validatePromotion(promotion, { subtotal, eligibleSubtotal, currency });

  if (!validation.ok) {
    return buildSummary({
      subtotal,
      discount: 0,
      shipping: baseShipping,
      appliedPromotion: null,
      couponCode: code,
      couponMessage: validation.message,
      valid: false,
      taxRate,
      currency,
    });
  }

  const discount =
    promotion.type === "percentage"
      ? eligibleSubtotal * (promotion.value / 100)
      : promotion.type === "fixed"
        ? Math.min(promotion.value, eligibleSubtotal)
        : 0;
  const shipping = promotion.type === "free-shipping" ? 0 : baseShipping;

  return buildSummary({
    subtotal,
    discount,
    shipping,
    appliedPromotion: promotion,
    couponCode: code,
    couponMessage: `${promotion.code} applied.`,
    valid: true,
    taxRate,
    currency,
  });
}

export function incrementPromotionUsage(promotions, promotionId) {
  return normalizePromotions(promotions).map((promotion) =>
    promotion.id === promotionId
      ? { ...promotion, usageCount: Number(promotion.usageCount || 0) + 1 }
      : promotion,
  );
}

function buildSummary({ subtotal, discount, shipping, appliedPromotion, couponCode, couponMessage, valid, taxRate = 0.15, currency = "N$" }) {
  const tax = Math.max(0, (subtotal - discount) * taxRate);
  return {
    subtotal,
    discount,
    shipping,
    tax,
    total: Math.max(0, subtotal - discount + shipping + tax),
    appliedPromotion,
    couponCode,
    couponMessage,
    couponValid: valid,
    currency,
  };
}

function validatePromotion(promotion, { subtotal, eligibleSubtotal, currency = "N$" }) {
  const today = new Date().toISOString().slice(0, 10);

  if (promotion.status !== "active") {
    return { ok: false, message: "This promotion is not active right now." };
  }

  if (promotion.startsAt && today < promotion.startsAt) {
    return { ok: false, message: "This promotion has not started yet." };
  }

  if (promotion.endsAt && today > promotion.endsAt) {
    return { ok: false, message: "This promotion has ended." };
  }

  if (promotion.usageLimit > 0 && promotion.usageCount >= promotion.usageLimit) {
    return { ok: false, message: "This promotion has reached its usage limit." };
  }

  if (subtotal < promotion.minSubtotal) {
    return { ok: false, message: `Minimum order for this promotion is ${moneyFmt(promotion.minSubtotal, currency)}.` };
  }

  if (eligibleSubtotal <= 0) {
    return { ok: false, message: "This promotion does not apply to items in your cart." };
  }

  return { ok: true, message: "Promotion applied." };
}

function getEligibleSubtotal(cart, products, promotion) {
  return cart
    .filter((line) => {
      const product = products.find((item) => item.id === line.productId);
      if (!product) return promotion.scope === "all";
      if (promotion.scope === "all") return true;
      if (promotion.scope === "category") return product.category === promotion.scopeValue;
      if (promotion.scope === "collection") return product.collection === promotion.scopeValue;
      if (promotion.scope === "product") return product.id === promotion.scopeValue || product.name === promotion.scopeValue;
      return false;
    })
    .reduce((sum, line) => sum + Number(line.price || 0) * Number(line.quantity || 0), 0);
}

function moneyFmt(value, currency = "N$") {
  return `${currency}${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function capitalizeWords(value) {
  return String(value || "")
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
