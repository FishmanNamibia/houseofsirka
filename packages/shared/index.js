/**
 * Vocabulary and money handling shared by the storefront and the backend.
 *
 * These are the values that silently drift when each side keeps its own copy:
 * a currency symbol, a rounding rule, the exact spelling of an order status.
 * Divergence here shows up as a customer being quoted one total and charged
 * another, or an order whose status the storefront cannot render.
 */

export const CURRENCY = {
  /** ISO 4217. Medusa, Google structured data and any gateway want this. */
  code: "NAD",
  /** What a Namibian shopper actually reads. */
  symbol: "N$",
  locale: "en-NA",
  /** Namibian dollar is a two-decimal currency. */
  minorUnits: 2,
};

/**
 * Money is held in minor units — cents — as integers.
 *
 * Floating point cannot represent most decimal fractions exactly, so
 * accumulating prices as floats produces totals that are a cent off and
 * irreproducible. Medusa itself stores decimals in major units, so anything
 * comparing a Medusa total against a bank statement must convert to minor
 * units first and compare integers.
 */
export function toMinorUnits(majorAmount) {
  return Math.round(Number(majorAmount || 0) * 10 ** CURRENCY.minorUnits);
}

export function fromMinorUnits(minorAmount) {
  return Number(minorAmount || 0) / 10 ** CURRENCY.minorUnits;
}

/** Formats a major-unit amount for display, e.g. 1290 -> "N$1,290.00". */
export function formatMoney(majorAmount) {
  const value = Number(majorAmount || 0).toLocaleString(CURRENCY.locale, {
    minimumFractionDigits: CURRENCY.minorUnits,
    maximumFractionDigits: CURRENCY.minorUnits,
  });
  return `${CURRENCY.symbol}${value}`;
}

/** Formats a minor-unit integer for display, e.g. 129000 -> "N$1,290.00". */
export function formatMinorUnits(minorAmount) {
  return formatMoney(fromMinorUnits(minorAmount));
}

/**
 * Order lifecycle. The storefront renders these and the backend writes them,
 * so the spelling has to come from one place.
 */
export const ORDER_STATUS = {
  PENDING_PAYMENT: "Pending Payment",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

/** Display order for progress trackers — not every status, just the happy path. */
export const ORDER_PROGRESSION = [
  ORDER_STATUS.PENDING_PAYMENT,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
];

export const PAYMENT_STATUS = {
  AWAITING_PROOF: "Awaiting proof of payment",
  AWAITING_CONFIRMATION: "Awaiting confirmation",
  PAID: "Paid",
  DUE_ON_DELIVERY: "Payment due on delivery",
  REFUNDED: "Refunded",
};

/**
 * Payment rails, all manual: the customer transfers or sends a wallet payment
 * and uploads proof, which the shop confirms by hand. No card details are
 * collected anywhere, which keeps PCI scope at its lightest.
 */
export const PAYMENT_METHODS = [
  { id: "eft", label: "EFT bank transfer", requiresProof: true },
  { id: "fnb-ewallet", label: "FNB eWallet", requiresProof: true },
  { id: "paypulse", label: "PayPulse / BlueVoucher (Standard Bank)", requiresProof: true },
  { id: "easywallet", label: "EasyWallet (Bank Windhoek)", requiresProof: true },
  { id: "nedbank-send-money", label: "Send Money (Nedbank)", requiresProof: true },
  { id: "pay2cell", label: "FNB Pay2Cell", requiresProof: true },
  { id: "cod", label: "Pay on delivery", requiresProof: false },
];

export function paymentMethodById(id) {
  return PAYMENT_METHODS.find((m) => m.id === id) || null;
}

export function requiresProofOfPayment(label) {
  return PAYMENT_METHODS.some((m) => m.label === label && m.requiresProof);
}
