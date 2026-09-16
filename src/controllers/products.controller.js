const PRODUCTS = require("../data/products");
const { REVIEWS, FALLBACK_REVIEWS } = require("../data/reviews");

const VALID_CATEGORIES = ["chocolate", "gummies", "hard-candy", "gift-box"];
const VALID_SORTS = ["featured", "price-low", "price-high", "newest"];

function findById(id) {
  const numId = Number(id);
  return PRODUCTS.find((p) => p.id === numId) || null;
}

function getRelated(product, limit = 4) {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

/* GET /api/products
   Query params:
     category   comma-separated list, e.g. chocolate,gummies
     maxPrice   number, upper bound inclusive
     search     case-insensitive match against name/shortDescription
     sort       featured | price-low | price-high | newest
     page       1-based page number (default 1)
     limit      page size (default 12, max 48)
*/
function listProducts(req, res) {
  const { category, maxPrice, search, sort = "featured" } = req.query;

  if (sort && !VALID_SORTS.includes(sort)) {
    return res.status(400).json({
      error: "invalid_sort",
      message: `sort must be one of: ${VALID_SORTS.join(", ")}`,
    });
  }

  let results = [...PRODUCTS];

  if (category) {
    const categories = String(category)
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    const invalid = categories.filter((c) => !VALID_CATEGORIES.includes(c));
    if (invalid.length) {
      return res.status(400).json({
        error: "invalid_category",
        message: `Unknown category value(s): ${invalid.join(", ")}. Valid: ${VALID_CATEGORIES.join(", ")}`,
      });
    }
    results = results.filter((p) => categories.includes(p.category));
  }

  if (maxPrice !== undefined) {
    const max = Number(maxPrice);
    if (Number.isNaN(max) || max < 0) {
      return res.status(400).json({ error: "invalid_max_price", message: "maxPrice must be a non-negative number" });
    }
    results = results.filter((p) => p.price <= max);
  }

  if (search) {
    const q = String(search).trim().toLowerCase();
    if (q) {
      results = results.filter(
        (p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      );
    }
  }

  switch (sort) {
    case "price-low":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      results.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      results.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      break;
    default:
      // "featured": bestsellers first, then rating desc, stable-ish
      results.sort((a, b) => {
        const aFeatured = a.badge === "bestseller" ? 1 : 0;
        const bFeatured = b.badge === "bestseller" ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        return b.rating - a.rating;
      });
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(48, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const pageItems = results.slice(start, start + limit);

  res.json({
    data: pageItems,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  });
}

/* GET /api/products/:id */
function getProduct(req, res) {
  const product = findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "not_found", message: `No product with id ${req.params.id}` });
  }
  res.json({ data: product });
}

/* GET /api/products/:id/related */
function getRelatedProducts(req, res) {
  const product = findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "not_found", message: `No product with id ${req.params.id}` });
  }
  const limit = Math.min(12, Math.max(1, parseInt(req.query.limit, 10) || 4));
  res.json({ data: getRelated(product, limit) });
}

/* GET /api/products/:id/reviews */
function getProductReviews(req, res) {
  const product = findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "not_found", message: `No product with id ${req.params.id}` });
  }
  const data = REVIEWS[product.id] || FALLBACK_REVIEWS;
  res.json({
    data,
    meta: { averageRating: product.rating, reviewCount: product.reviews },
  });
}

/* GET /api/categories */
function listCategories(req, res) {
  res.json({ data: VALID_CATEGORIES });
}

module.exports = {
  listProducts,
  getProduct,
  getRelatedProducts,
  getProductReviews,
  listCategories,
  findById, // exported for reuse by cart/orders controllers
  VALID_CATEGORIES,
  VALID_SORTS,
};
