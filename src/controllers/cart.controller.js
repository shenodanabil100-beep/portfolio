const { findById } = require("./products.controller");
const { computeTotals, FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE, TAX_RATE } = require("../utils/pricing");
const { isValidPromoCode, getPromoDiscountRate } = require("../data/store");

/**
 * Resolve a raw items array [{ id, qty }] from the client into priced
 * lines, and report any ids that don't exist so the client can drop them.
 */
function resolveLines(items) {
  const lines = [];
  const invalidIds = [];

  for (const raw of items) {
    const id = Number(raw.id);
    const qty = Math.max(1, Math.floor(Number(raw.qty)) || 1);
    const product = findById(id);
    if (!product) {
      invalidIds.push(raw.id);
      continue;
    }
    lines.push({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        thumb: product.thumb,
        category: product.category,
      },
      qty,
      lineTotal: Math.round(product.price * qty * 100) / 100,
    });
  }

  return { lines, invalidIds };
}

function validateItemsPayload(items) {
  if (!Array.isArray(items)) return "items must be an array";
  if (items.length === 0) return "items must not be empty";
  for (const item of items) {
    if (item == null || typeof item !== "object") return "each item must be an object with id and qty";
    if (item.id === undefined || item.id === null || Number.isNaN(Number(item.id))) {
      return "each item must include a numeric id";
    }
    if (item.qty !== undefined && (Number.isNaN(Number(item.qty)) || Number(item.qty) < 1)) {
      return "qty must be a positive number when provided";
    }
  }
  return null;
}

/* POST /api/cart/totals
   Body: { items: [{ id, qty }], promoCode?: string }
*/
function getCartTotals(req, res) {
  const { items, promoCode } = req.body || {};

  const validationError = validateItemsPayload(items);
  if (validationError) {
    return res.status(400).json({ error: "invalid_items", message: validationError });
  }

  if (promoCode !== undefined && promoCode !== "" && !isValidPromoCode(promoCode)) {
    return res.status(400).json({ error: "invalid_promo_code", message: "That promo code isn't valid." });
  }

  const { lines, invalidIds } = resolveLines(items);
  const totals = computeTotals(lines, promoCode);

  res.json({
    data: {
      lines,
      invalidIds,
      totals,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      shippingFlatRate: SHIPPING_FLAT_RATE,
      taxRate: TAX_RATE,
    },
  });
}

/* POST /api/cart/promo/validate
   Body: { code: string }
*/
function validatePromo(req, res) {
  const { code } = req.body || {};
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "invalid_request", message: "code is required" });
  }
  const valid = isValidPromoCode(code);
  res.json({
    data: {
      code: code.toUpperCase(),
      valid,
      discountRate: valid ? getPromoDiscountRate(code) : 0,
    },
  });
}

module.exports = { getCartTotals, validatePromo, resolveLines, validateItemsPayload };
