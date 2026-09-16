const { resolveLines, validateItemsPayload } = require("./cart.controller");
const { computeTotals } = require("../utils/pricing");
const { createOrder, getOrder, isValidPromoCode } = require("../data/store");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;
const PHONE_RE = /^[\d\s()+-]{7,}$/;
const VALID_PAYMENT_METHODS = ["card", "paypal", "cod"];

function validateCheckoutPayload(body) {
  const errors = {};
  const { customer, payment, items } = body || {};

  const itemsError = validateItemsPayload(items);
  if (itemsError) errors.items = itemsError;

  if (!customer || typeof customer !== "object") {
    errors.customer = "customer details are required";
  } else {
    if (!customer.fullName || !String(customer.fullName).trim()) {
      errors["customer.fullName"] = "Full name is required.";
    }
    if (!customer.email || !EMAIL_RE.test(String(customer.email).trim())) {
      errors["customer.email"] = "A valid email address is required.";
    }
    if (!customer.phone || !PHONE_RE.test(String(customer.phone).trim())) {
      errors["customer.phone"] = "A valid phone number is required.";
    }
    if (!customer.address || !String(customer.address).trim()) {
      errors["customer.address"] = "Shipping address is required.";
    }
    if (!customer.city || !String(customer.city).trim()) {
      errors["customer.city"] = "City is required.";
    }
    if (!customer.state || !String(customer.state).trim()) {
      errors["customer.state"] = "State is required.";
    }
    if (!customer.zip || !ZIP_RE.test(String(customer.zip).trim())) {
      errors["customer.zip"] = "A valid ZIP code is required.";
    }
  }

  if (!payment || typeof payment !== "object" || !payment.method) {
    errors["payment.method"] = "Payment method is required.";
  } else if (!VALID_PAYMENT_METHODS.includes(payment.method)) {
    errors["payment.method"] = `Payment method must be one of: ${VALID_PAYMENT_METHODS.join(", ")}`;
  } else if (payment.method === "card") {
    /* Front-end only: we never store real card data. We just confirm the
       shape of what would be sent to a real payment processor. */
    if (!payment.cardNumber || String(payment.cardNumber).replace(/\s/g, "").length < 12) {
      errors["payment.cardNumber"] = "A valid card number is required.";
    }
    if (!payment.cardExpiry) {
      errors["payment.cardExpiry"] = "Card expiry is required.";
    }
    if (!payment.cardCvc) {
      errors["payment.cardCvc"] = "Card CVC is required.";
    }
  }

  if (body && body.promoCode && !isValidPromoCode(body.promoCode)) {
    errors.promoCode = "That promo code isn't valid.";
  }

  return Object.keys(errors).length ? errors : null;
}

/* POST /api/orders
   Body: { customer: {...}, payment: {...}, items: [{id,qty}], promoCode? }
*/
function placeOrder(req, res) {
  const errors = validateCheckoutPayload(req.body);
  if (errors) {
    return res.status(400).json({ error: "validation_failed", fields: errors });
  }

  const { customer, payment, items, promoCode } = req.body;
  const { lines, invalidIds } = resolveLines(items);

  if (!lines.length) {
    return res.status(400).json({
      error: "empty_cart",
      message: "No valid items were found in the cart.",
      invalidIds,
    });
  }

  const totals = computeTotals(lines, promoCode);

  /* Never persist raw card data, even in this demo store. */
  const safePayment = {
    method: payment.method,
    ...(payment.method === "card" ? { cardLast4: String(payment.cardNumber).replace(/\s/g, "").slice(-4) } : {}),
  };

  const order = createOrder({
    customer: {
      fullName: customer.fullName.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      city: customer.city.trim(),
      state: customer.state.trim(),
      zip: customer.zip.trim(),
    },
    payment: safePayment,
    items: lines,
    promoCode: promoCode || null,
    totals,
  });

  res.status(201).json({
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      customer: { firstName: order.customer.fullName.split(" ")[0] || "there", email: order.customer.email },
      items: order.items,
      totals: order.totals,
    },
    ...(invalidIds.length ? { warnings: { droppedInvalidIds: invalidIds } } : {}),
  });
}

/* GET /api/orders/:orderNumber */
function getOrderByNumber(req, res) {
  const order = getOrder(req.params.orderNumber);
  if (!order) {
    return res.status(404).json({ error: "not_found", message: `No order with number ${req.params.orderNumber}` });
  }
  res.json({ data: order });
}

module.exports = { placeOrder, getOrderByNumber, validateCheckoutPayload };
