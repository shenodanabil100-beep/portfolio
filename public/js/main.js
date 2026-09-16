/* ==========================================================================
   SoDak Sweet Tooth — Shared Site Behavior
   Handles navigation, wishlist, product-card rendering, home/shop rendering,
   forms, and small UI utilities used across every page.
   ========================================================================== */

/* ---------------- Utilities ---------------- */
function formatPrice(n) {
  return "$" + Number(n).toFixed(2);
}

function starString(rating) {
  const full = Math.round(rating);
  return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("sst_wishlist") || "[]");
}
function saveWishlist(list) {
  localStorage.setItem("sst_wishlist", JSON.stringify(list));
}
function isWishlisted(id) {
  return getWishlist().includes(Number(id));
}
function toggleWishlist(id) {
  id = Number(id);
  let list = getWishlist();
  if (list.includes(id)) {
    list = list.filter((x) => x !== id);
  } else {
    list.push(id);
    showToast("Added to your wishlist");
  }
  saveWishlist(list);
  return list.includes(id);
}

/* ---------------- Toast ---------------- */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerHTML = '<span class="icon-wrap">✓</span><span class="toast-msg"></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector(".toast-msg").textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------------- Header: nav toggle + search ---------------- */
function initHeader() {
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const searchToggle = document.querySelector(".search-toggle");
  const searchForm = document.querySelector(".header-search-form");
  if (searchToggle && searchForm) {
    searchToggle.addEventListener("click", () => {
      const open = searchForm.classList.toggle("open");
      if (open) searchForm.querySelector("input").focus();
    });
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = searchForm.querySelector("input").value.trim();
      window.location.href = "shop.html" + (q ? "?search=" + encodeURIComponent(q) : "");
    });
  }

  updateCartBadge();
}

/* ---------------- Product card rendering ---------------- */
function categoryLabel(cat) {
  const map = {
    chocolate: "Chocolate",
    gummies: "Gummies",
    "hard-candy": "Hard Candy",
    "gift-box": "Gift Boxes"
  };
  return map[cat] || cat;
}

function productCardHTML(p) {
  const wished = isWishlisted(p.id);
  const badge = p.badge
    ? `<span class="badge ${p.badge}">${p.badge === "sale" ? "Sale" : p.badge === "new" ? "New" : "Best Seller"}</span>`
    : "";
  const oldPrice = p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : "";
  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-media">
      ${badge}
      <button class="wishlist-btn ${wished ? "active" : ""}" data-wishlist="${p.id}" aria-pressed="${wished}" aria-label="Add ${p.name} to wishlist">
        <svg viewBox="0 0 24 24" fill="${wished ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
      </button>
      <a href="product.html?id=${p.id}" aria-label="View ${p.name}">
        <img src="${p.thumb}" alt="${p.name}, ${categoryLabel(p.category)} from SoDak Sweet Tooth" loading="lazy" width="500" height="500">
      </a>
    </div>
    <div class="product-info">
      <span class="product-cat">${categoryLabel(p.category)}</span>
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="product-desc">${p.shortDescription}</p>
      <div class="rating">
        <span class="stars" aria-hidden="true">${starString(p.rating)}</span>
        <span>${p.rating} (${p.reviews})</span>
      </div>
      <div class="price-row">
        <span class="price">${formatPrice(p.price)}</span>
        ${oldPrice}
      </div>
      <div class="product-actions">
        <button class="btn btn-primary btn-block btn-sm add-to-cart-btn" data-add="${p.id}">Add to Cart</button>
      </div>
    </div>
  </article>`;
}

function bindProductCardEvents(scope) {
  scope.querySelectorAll("[data-wishlist]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-wishlist");
      const active = toggleWishlist(id);
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active);
      const svg = btn.querySelector("svg");
      svg.setAttribute("fill", active ? "currentColor" : "none");
    });
  });
  scope.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-add");
      addToCart(id, 1);
      const product = getProductById(id);
      showToast(`${product.name} added to cart`);
    });
  });
}

/* ---------------- Home page ---------------- */
function initHomePage() {
  const bestSellersGrid = document.querySelector("#best-sellers-grid");
  if (bestSellersGrid) {
    const bestSellers = PRODUCTS.filter((p) => p.badge === "bestseller" || p.rating >= 4.7).slice(0, 8);
    bestSellersGrid.innerHTML = bestSellers.map(productCardHTML).join("");
    bindProductCardEvents(bestSellersGrid);
  }

  const reviews = [
    { name: "Megan T.", location: "Sioux Falls, SD", quote: "The chocolate fudge bites did not last a week in our house. Fast shipping and everything arrived in perfect shape.", rating: 5 },
    { name: "Carter B.", location: "Rapid City, SD", quote: "Ordered the Deluxe Gift Box for my mom's birthday. She said it was the nicest candy box she's gotten in years.", rating: 5 },
    { name: "Priya S.", location: "Sioux Falls, SD", quote: "Rainbow Gummies are now a standing order at our office. Everyone asks where they're from.", rating: 4 }
  ];
  const reviewGrid = document.querySelector("#review-grid");
  if (reviewGrid) {
    reviewGrid.innerHTML = reviews
      .map(
        (r) => `
      <div class="review-card">
        <div class="stars" aria-hidden="true">${starString(r.rating)}</div>
        <p class="quote">"${r.quote}"</p>
        <div class="review-person">
          <img class="review-avatar" src="https://ui-avatars.com/api/?background=fff1e2&color=ff8716&bold=true&name=${encodeURIComponent(r.name)}" alt="${r.name}">
          <div>
            <strong>${r.name}</strong>
            <span>${r.location}</span>
          </div>
        </div>
      </div>`
      )
      .join("");
  }
}

/* ---------------- Shop page ---------------- */
function initShopPage() {
  const grid = document.querySelector("#shop-grid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const state = {
    search: params.get("search") || "",
    categories: params.get("category") ? [params.get("category")] : [],
    maxPrice: 40,
    sort: "featured",
    page: 1,
    perPage: 8
  };

  const searchInput = document.querySelector("#shop-search-input");
  const categoryInputs = document.querySelectorAll("[data-filter-category]");
  const priceRange = document.querySelector("#price-range");
  const priceValue = document.querySelector("#price-range-value");
  const sortSelect = document.querySelector("#sort-select");
  const resultsCount = document.querySelector("#results-count");
  const clearFiltersBtn = document.querySelector("#clear-filters");
  const pagination = document.querySelector("#pagination");

  if (searchInput) searchInput.value = state.search;
  if (state.categories.length) {
    categoryInputs.forEach((input) => {
      if (state.categories.includes(input.value)) input.checked = true;
    });
  }

  function getFiltered() {
    let list = PRODUCTS.slice();
    if (state.search) {
      const q = state.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
    }
    if (state.categories.length) {
      list = list.filter((p) => state.categories.includes(p.category));
    }
    list = list.filter((p) => p.price <= state.maxPrice);

    switch (state.sort) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      default:
        list.sort((a, b) => (b.badge === "bestseller") - (a.badge === "bestseller") || b.rating - a.rating);
    }
    return list;
  }

  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.perPage;
    const pageItems = filtered.slice(start, start + state.perPage);

    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length ? start + 1 : 0}–${Math.min(start + state.perPage, filtered.length)} of ${filtered.length} products`;
    }

    if (!filtered.length) {
      grid.innerHTML = `<div class="empty-state">
        <h3>No products match your search</h3>
        <p>Try clearing your filters or searching a different term.</p>
        <button class="btn btn-outline btn-sm" id="empty-clear">Clear filters</button>
      </div>`;
      const clr = document.querySelector("#empty-clear");
      if (clr) clr.addEventListener("click", resetFilters);
    } else {
      grid.innerHTML = pageItems.map(productCardHTML).join("");
      bindProductCardEvents(grid);
    }

    if (pagination) {
      pagination.innerHTML = "";
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("button");
          btn.textContent = i;
          if (i === state.page) btn.classList.add("active");
          btn.addEventListener("click", () => {
            state.page = i;
            render();
            grid.scrollIntoView({ behavior: "smooth", block: "start" });
          });
          pagination.appendChild(btn);
        }
      }
    }
  }

  function resetFilters() {
    state.search = "";
    state.categories = [];
    state.maxPrice = 40;
    state.sort = "featured";
    state.page = 1;
    if (searchInput) searchInput.value = "";
    categoryInputs.forEach((i) => (i.checked = false));
    if (priceRange) priceRange.value = 40;
    if (priceValue) priceValue.textContent = "Up to $40";
    if (sortSelect) sortSelect.value = "featured";
    render();
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.search = searchInput.value;
      state.page = 1;
      render();
    });
  }
  categoryInputs.forEach((input) => {
    input.addEventListener("change", () => {
      state.categories = Array.from(categoryInputs)
        .filter((i) => i.checked)
        .map((i) => i.value);
      state.page = 1;
      render();
    });
  });
  if (priceRange) {
    priceRange.addEventListener("input", () => {
      state.maxPrice = Number(priceRange.value);
      priceValue.textContent = state.maxPrice >= 40 ? "Up to $40" : "Up to $" + state.maxPrice;
      state.page = 1;
      render();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      render();
    });
  }
  if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", resetFilters);

  const filterToggle = document.querySelector("#mobile-filter-toggle");
  const filterPanel = document.querySelector(".filter-panel");
  const filterOverlay = document.querySelector("#filter-overlay");
  const filterClose = document.querySelector("#filter-panel-close");
  function closeFilterPanel() {
    filterPanel.classList.remove("open");
    filterOverlay.classList.remove("open");
  }
  if (filterToggle && filterPanel && filterOverlay) {
    filterToggle.addEventListener("click", () => {
      filterPanel.classList.add("open");
      filterOverlay.classList.add("open");
    });
    filterOverlay.addEventListener("click", closeFilterPanel);
    if (filterClose) filterClose.addEventListener("click", closeFilterPanel);
  }

  render();
}

/* ---------------- Product detail page ---------------- */
function initProductDetailPage() {
  const wrap = document.querySelector("#product-detail-root");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get("id")) || PRODUCTS[0];

  document.title = `${product.name} | SoDak Sweet Tooth`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", product.shortDescription);

  document.querySelector("#breadcrumb-product").textContent = product.name;
  document.querySelector("#detail-category").textContent = categoryLabel(product.category);
  document.querySelector("#detail-name").textContent = product.name;
  document.querySelector("#detail-stars").textContent = starString(product.rating);
  document.querySelector("#detail-rating-text").textContent = `${product.rating} (${product.reviews} reviews)`;
  document.querySelector("#detail-price").textContent = formatPrice(product.price);
  const oldPriceEl = document.querySelector("#detail-old-price");
  if (product.oldPrice) {
    oldPriceEl.textContent = formatPrice(product.oldPrice);
    oldPriceEl.style.display = "inline";
  } else {
    oldPriceEl.style.display = "none";
  }
  document.querySelector("#detail-description").textContent = product.description;
  document.querySelector("#detail-ingredients").textContent = product.ingredients;

  const stockPill = document.querySelector("#detail-stock");
  if (product.stock === "low-stock") {
    stockPill.textContent = "Low stock — order soon";
    stockPill.classList.add("low");
  } else {
    stockPill.textContent = "In stock, ready to ship";
  }

  const mainImage = document.querySelector("#main-product-image");
  mainImage.src = product.image;
  mainImage.alt = product.name;
  const thumbRow = document.querySelector("#thumb-row");
  thumbRow.innerHTML = product.gallery
    .map(
      (src, i) => `<button class="${i === 0 ? "active" : ""}" data-thumb="${src}" aria-label="View image ${i + 1} of ${product.name}"><img src="${src}" alt=""></button>`
    )
    .join("");
  thumbRow.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      mainImage.src = btn.getAttribute("data-thumb");
      thumbRow.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const wishlistBtn = document.querySelector("#detail-wishlist-btn");
  const wished = isWishlisted(product.id);
  wishlistBtn.classList.toggle("active", wished);
  wishlistBtn.querySelector("svg").setAttribute("fill", wished ? "currentColor" : "none");
  wishlistBtn.addEventListener("click", () => {
    const active = toggleWishlist(product.id);
    wishlistBtn.classList.toggle("active", active);
    wishlistBtn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
  });

  const qtyInput = document.querySelector("#detail-qty");
  document.querySelector("#qty-minus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.querySelector("#qty-plus").addEventListener("click", () => {
    qtyInput.value = Number(qtyInput.value) + 1;
  });

  document.querySelector("#add-to-cart-detail").addEventListener("click", () => {
    addToCart(product.id, Number(qtyInput.value));
    showToast(`${product.name} added to cart`);
  });
  document.querySelector("#buy-now-detail").addEventListener("click", () => {
    addToCart(product.id, Number(qtyInput.value));
    window.location.href = "cart.html";
  });

  const tabButtons = document.querySelectorAll(".tab-buttons button");
  const tabPanels = document.querySelectorAll(".tab-panel");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector("#" + btn.getAttribute("data-tab")).classList.add("active");
    });
  });

  const sampleReviews = [
    { name: "Dana R.", quote: "Exactly as described and packed really well for shipping. Will order again.", rating: 5 },
    { name: "Tyler M.", quote: "Great flavor, a little smaller portion than I expected but still worth it.", rating: 4 },
    { name: "Ashley K.", quote: "Bought this as a gift and my sister loved it. Arrived earlier than the estimate.", rating: 5 }
  ];
  document.querySelector("#detail-reviews-list").innerHTML = sampleReviews
    .map(
      (r) => `<div class="review-item">
        <div class="stars" aria-hidden="true">${starString(r.rating)}</div>
        <p style="margin:6px 0;color:var(--color_heading);font-weight:600;">${r.name}</p>
        <p style="margin:0;">${r.quote}</p>
      </div>`
    )
    .join("");

  const relatedGrid = document.querySelector("#related-products-grid");
  const related = getRelatedProducts(product);
  relatedGrid.innerHTML = related.map(productCardHTML).join("");
  bindProductCardEvents(relatedGrid);
}

/* ---------------- Newsletter + contact forms ---------------- */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function initNewsletterForm() {
  const form = document.querySelector("#newsletter-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='email']");
    if (!isValidEmail(input.value)) {
      showToast("Please enter a valid email address");
      return;
    }
    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value.trim() })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast((body.fields && body.fields.email) || "Please enter a valid email address");
        return;
      }
      form.style.display = "none";
      document.querySelector("#newsletter-success").classList.add("show");
    } catch (err) {
      showToast("Something went wrong. Please try again.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const wrapper = field.closest(".field");
      let fieldValid = field.value.trim() !== "";
      if (field.type === "email" && fieldValid) fieldValid = isValidEmail(field.value);
      wrapper.classList.toggle("has-error", !fieldValid);
      if (!fieldValid) valid = false;
    });
    if (!valid) return;

    const payload = {
      name: document.querySelector("#contact-name").value.trim(),
      email: document.querySelector("#contact-email").value.trim(),
      subject: document.querySelector("#contact-subject").value.trim(),
      message: document.querySelector("#contact-message").value.trim()
    };

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Surface server-side validation errors on the matching fields.
        Object.keys(body.fields || {}).forEach((key) => {
          const field = form.querySelector(`[name="${key}"]`);
          if (field) field.closest(".field").classList.add("has-error");
        });
        showToast("Please check the highlighted fields");
        return;
      }
      form.reset();
      document.querySelector("#contact-success").classList.add("show");
      document.querySelector("#contact-success").scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      showToast("Something went wrong sending your message. Please try again.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initHomePage();
  initShopPage();
  initProductDetailPage();
  initNewsletterForm();
  initContactForm();
  if (typeof initCartPage === "function") initCartPage();
  if (typeof initCheckoutPage === "function") initCheckoutPage();

  // Highlight active nav link based on current page
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a, .mobile-nav a").forEach((link) => {
    const href = link.getAttribute("href").split("?")[0];
    if (href === path) link.classList.add("active");
  });
});
