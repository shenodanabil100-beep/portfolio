/* ==========================================================================
   SoDak Sweet Tooth — Cart & Checkout
   Cart persists in localStorage as an array of { id, qty }.
   cart.html holds three states in one page: cart review, checkout form,
   and order confirmation. This file drives all three.
   ========================================================================== */

const CART_KEY = "sst_cart";
const FREE_SHIPPING_THRESHOLD = 35;
const SHIPPING_FLAT_RATE = 5.99;
const TAX_RATE = 0.065; // South Dakota state sales tax rate

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(id, qty) {
  id = Number(id);
  qty = Math.max(1, Number(qty) || 1);
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
}
function updateCartQty(id, qty) {
  id = Number(id);
  qty = Math.max(1, Number(qty) || 1);
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty = qty;
  saveCart(cart);
}
function removeFromCart(id) {
  id = Number(id);
  saveCart(getCart().filter((i) => i.id !== id));
}
function clearCart() {
  saveCart([]);
}
function cartItemCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}
function cartLines() {
  return getCart()
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return null;
      return { product, qty: item.qty, lineTotal: product.price * item.qty };
    })
    .filter(Boolean);
}
function cartSubtotal() {
  return cartLines().reduce((sum, line) => sum + line.lineTotal, 0);
}
function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    const count = cartItemCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

/* Promo codes: simple front-end demo discounts */
const PROMO_CODES = {
  SWEET10: 0.1,
  SODAK15: 0.15
};

function computeTotals(promoCode) {
  const subtotal = cartSubtotal();
  const discountRate = promoCode && PROMO_CODES[promoCode.toUpperCase()] ? PROMO_CODES[promoCode.toUpperCase()] : 0;
  const discount = subtotal * discountRate;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const taxable = subtotal - discount;
  const tax = taxable > 0 ? taxable * TAX_RATE : 0;
  const total = taxable + shipping + tax;
  return { subtotal, discount, shipping, tax, total };
}

function summaryRowsHTML(totals) {
  return `
    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(totals.subtotal)}</span></div>
    ${totals.discount > 0 ? `<div class="summary-row"><span>Discount</span><span>-${formatPrice(totals.discount)}</span></div>` : ""}
    <div class="summary-row"><span>Shipping</span><span>${totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</span></div>
    <div class="summary-row"><span>Estimated tax</span><span>${formatPrice(totals.tax)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatPrice(totals.total)}</span></div>
  `;
}

/* ---------------- Combined Cart / Checkout page ---------------- */
function initCartPage() {
  const root = document.querySelector("#cart-page-root");
  if (!root) return;

  const cartStep = document.querySelector("#cart-step");
  const checkoutStep = document.querySelector("#checkout-step");
  const confirmation = document.querySelector("#order-confirmation");
  const cartLayout = document.querySelector("#cart-layout");
  const emptyEl = document.querySelector("#cart-empty");
  const tableEl = document.querySelector("#cart-table");
  const summaryEl = document.querySelector("#cart-summary");
  const checkoutSummaryEl = document.querySelector("#checkout-summary");
  let promoCode = sessionStorage.getItem("sst_promo") || "";

  function renderCartStep() {
    const lines = cartLines();
    if (!lines.length) {
      cartLayout.style.display = "none";
      emptyEl.style.display = "block";
      return;
    }
    cartLayout.style.display = "grid";
    emptyEl.style.display = "none";

    tableEl.innerHTML = lines
      .map(
        (line) => `
      <div class="cart-row" data-id="${line.product.id}">
        <img src="${line.product.thumb}" alt="${line.product.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${line.product.name}</div>
          <div class="cart-item-cat">${categoryLabel(line.product.category)} · ${formatPrice(line.product.price)} each</div>
        </div>
        <div class="qty-control">
          <button type="button" aria-label="Decrease quantity" data-decrease="${line.product.id}">−</button>
          <input type="number" min="1" value="${line.qty}" aria-label="Quantity for ${line.product.name}" data-qty-input="${line.product.id}">
          <button type="button" aria-label="Increase quantity" data-increase="${line.product.id}">+</button>
        </div>
        <div class="cart-line-total">${formatPrice(line.lineTotal)}</div>
        <button type="button" class="cart-remove" data-remove="${line.product.id}" aria-label="Remove ${line.product.name} from cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>
        </button>
      </div>`
      )
      .join("");

    const totals = computeTotals(promoCode);
    summaryEl.innerHTML = `
      <h3>Order Summary</h3>
      ${summaryRowsHTML(totals)}
      <form class="promo-row" id="promo-form">
        <label for="promo-input" class="visually-hidden">Promo code</label>
        <input type="text" id="promo-input" placeholder="Promo code (try SWEET10)">
        <button type="submit" class="btn btn-secondary btn-sm">Apply</button>
      </form>
      <button type="button" class="btn btn-primary btn-block" id="proceed-to-checkout" style="margin-top:6px;">Proceed to Checkout</button>
      <a href="shop.html" class="btn btn-secondary btn-block" style="margin-top:12px;">Continue Shopping</a>
    `;

    tableEl.querySelectorAll("[data-increase]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-increase");
        const line = cartLines().find((l) => l.product.id === Number(id));
        updateCartQty(id, line.qty + 1);
        renderCartStep();
      })
    );
    tableEl.querySelectorAll("[data-decrease]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-decrease");
        const line = cartLines().find((l) => l.product.id === Number(id));
        if (line.qty <= 1) return;
        updateCartQty(id, line.qty - 1);
        renderCartStep();
      })
    );
    tableEl.querySelectorAll("[data-qty-input]").forEach((input) =>
      input.addEventListener("change", () => {
        updateCartQty(input.getAttribute("data-qty-input"), input.value);
        renderCartStep();
      })
    );
    tableEl.querySelectorAll("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", () => {
        removeFromCart(btn.getAttribute("data-remove"));
        showToast("Item removed from cart");
        renderCartStep();
      })
    );

    document.querySelector("#promo-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const value = document.querySelector("#promo-input").value.trim();
      if (PROMO_CODES[value.toUpperCase()]) {
        promoCode = value;
        sessionStorage.setItem("sst_promo", promoCode);
        showToast("Promo code applied");
      } else {
        showToast("That promo code isn't valid");
      }
      renderCartStep();
    });

    document.querySelector("#proceed-to-checkout").addEventListener("click", () => {
      if (!cartLines().length) return;
      cartStep.style.display = "none";
      checkoutStep.style.display = "block";
      renderCheckoutSummary();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function renderCheckoutSummary() {
    const lines = cartLines();
    const totals = computeTotals(promoCode);
    const itemsHTML = lines
      .map((line) => `<div class="summary-row"><span>${line.product.name} × ${line.qty}</span><span>${formatPrice(line.lineTotal)}</span></div>`)
      .join("");
    checkoutSummaryEl.innerHTML = `<h3>Order Summary</h3>${itemsHTML}<hr style="border:none;border-top:1px solid var(--bording_color);margin:14px 0;">${summaryRowsHTML(totals)}`;
  }

  /* Back link from checkout to cart step */
  const backToCart = document.querySelector("#back-to-cart");
  if (backToCart) {
    backToCart.addEventListener("click", (e) => {
      e.preventDefault();
      checkoutStep.style.display = "none";
      cartStep.style.display = "block";
      renderCartStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Payment method toggle */
  const paymentOptions = document.querySelectorAll(".payment-option");
  const cardFields = document.querySelector("#card-fields");
  paymentOptions.forEach((opt) => {
    const input = opt.querySelector("input");
    opt.addEventListener("click", () => {
      input.checked = true;
      paymentOptions.forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      cardFields.classList.toggle("show", input.value === "card");
    });
  });

  /* Checkout form validation + submit */
  const form = document.querySelector("#checkout-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const wrapper = field.closest(".field");
        if (!wrapper) return;
        let fieldValid = field.value.trim() !== "";
        if (field.type === "email" && fieldValid) fieldValid = isValidEmail(field.value);
        if (field.id === "zip" && fieldValid) fieldValid = /^\d{5}(-\d{4})?$/.test(field.value.trim());
        if (field.id === "phone" && fieldValid) fieldValid = /^[\d\s()+-]{7,}$/.test(field.value.trim());
        wrapper.classList.toggle("has-error", !fieldValid);
        if (!fieldValid) valid = false;
      });

      const selectedPayment = form.querySelector("input[name='payment']:checked");
      if (selectedPayment && selectedPayment.value === "card") {
        ["card-number", "card-expiry", "card-cvc"].forEach((id) => {
          const field = document.querySelector("#" + id);
          if (!field) return;
          const wrapper = field.closest(".field");
          const fieldValid = field.value.trim() !== "";
          wrapper.classList.toggle("has-error", !fieldValid);
          if (!fieldValid) valid = false;
        });
      }

      if (!valid) {
        const firstError = form.querySelector(".has-error");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      /* Build the order payload for the backend. Card details are only sent
         so the API can confirm the shape/last 4 digits — the server never
         stores a full card number (see src/controllers/orders.controller.js). */
      const payload = {
        customer: {
          fullName: document.querySelector("#full-name").value.trim(),
          email: document.querySelector("#email").value.trim(),
          phone: document.querySelector("#phone").value.trim(),
          address: document.querySelector("#address").value.trim(),
          city: document.querySelector("#city").value.trim(),
          state: document.querySelector("#state").value.trim(),
          zip: document.querySelector("#zip").value.trim()
        },
        payment: { method: selectedPayment ? selectedPayment.value : "card" },
        items: getCart(),
        promoCode: promoCode || undefined
      };
      if (payload.payment.method === "card") {
        payload.payment.cardNumber = document.querySelector("#card-number").value.trim();
        payload.payment.cardExpiry = document.querySelector("#card-expiry").value.trim();
        payload.payment.cardCvc = document.querySelector("#card-cvc").value.trim();
      }

      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          showToast(
            (body.fields && Object.values(body.fields)[0]) || body.message || "We couldn't place your order. Please check your details."
          );
          return;
        }

        const { orderNumber, customer, totals } = body.data;
        document.querySelector("#confirm-name").textContent = customer.firstName || "there";
        document.querySelector("#confirm-order-number").textContent = orderNumber;
        document.querySelector("#confirm-email").textContent = customer.email;
        document.querySelector("#confirm-total").textContent = formatPrice(totals.total);

        checkoutStep.style.display = "none";
        confirmation.classList.add("show");
        window.scrollTo({ top: 0, behavior: "smooth" });
        sessionStorage.removeItem("sst_promo");
        clearCart();
      } catch (err) {
        showToast("Something went wrong placing your order. Please try again.");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  renderCartStep();
}
