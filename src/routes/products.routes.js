const express = require("express");
const {
  listProducts,
  getProduct,
  getRelatedProducts,
  getProductReviews,
  listCategories,
} = require("../controllers/products.controller");

const router = express.Router();

router.get("/categories", listCategories);
router.get("/products", listProducts);
router.get("/products/:id", getProduct);
router.get("/products/:id/related", getRelatedProducts);
router.get("/products/:id/reviews", getProductReviews);

module.exports = router;
