const { getPromoDiscountRate } = require("../data/store");

const FREE_SHIPPING_THRESHOLD = 35;
const SHIPPING_FLAT_RATE = 5.99;
const TAX_RATE = 0.065; // South Dakota state sales tax rate

/**
 * Given resolved cart lines ([{ product, qty, lineTotal }]) and an optional
 * promo code, compute the same totals the frontend cart page shows.
 */
function computeTotals(lines, promoCode) {
  const subtotal = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const discountRate = getPromoDiscountRate(promoCode);
  const discount = round2(subtotal * discountRate);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const taxable = Math.max(0, subtotal - discount);
  const tax = round2(taxable * TAX_RATE);
  const total = round2(taxable + shipping + tax);

  return { subtotal, discount, shipping, tax, total, discountRate };
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

module.exports = {
  computeTotals,
  round2,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT_RATE,
  TAX_RATE,
};
