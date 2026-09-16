/* ==========================================================================
   SoDak Sweet Tooth — In-memory "database"
   This is a demo-grade store: everything lives in process memory and resets
   on restart. Swap this module for a real DB layer (Mongo/Postgres/etc.)
   without touching the controllers, which only call these functions.
   ========================================================================== */

const { randomUUID } = require("crypto");

const orders = new Map(); // orderNumber -> order
const contactMessages = [];
const newsletterSubscribers = new Set();

const PROMO_CODES = {
  SWEET10: 0.1,
  SODAK15: 0.15,
};

function generateOrderNumber() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `SST-${num}`;
}

function createOrder(orderData) {
  let orderNumber = generateOrderNumber();
  while (orders.has(orderNumber)) {
    orderNumber = generateOrderNumber();
  }
  const order = {
    id: randomUUID(),
    orderNumber,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    ...orderData,
  };
  orders.set(orderNumber, order);
  return order;
}

function getOrder(orderNumber) {
  return orders.get(orderNumber) || null;
}

function addContactMessage(message) {
  const entry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...message,
  };
  contactMessages.push(entry);
  return entry;
}

function addNewsletterSubscriber(email) {
  const normalized = email.trim().toLowerCase();
  const alreadySubscribed = newsletterSubscribers.has(normalized);
  newsletterSubscribers.add(normalized);
  return { email: normalized, alreadySubscribed };
}

function isValidPromoCode(code) {
  return Boolean(code && PROMO_CODES[code.toUpperCase()]);
}

function getPromoDiscountRate(code) {
  if (!code) return 0;
  return PROMO_CODES[code.toUpperCase()] || 0;
}

/* Test-only helper: resets all in-memory state between test files/suites. */
function _resetStoreForTests() {
  orders.clear();
  contactMessages.length = 0;
  newsletterSubscribers.clear();
}

module.exports = {
  PROMO_CODES,
  createOrder,
  getOrder,
  addContactMessage,
  addNewsletterSubscriber,
  isValidPromoCode,
  getPromoDiscountRate,
  _resetStoreForTests,
  _contactMessages: contactMessages,
  _newsletterSubscribers: newsletterSubscribers,
};
