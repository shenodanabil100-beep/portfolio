const express = require("express");
const { getCartTotals, validatePromo } = require("../controllers/cart.controller");

const router = express.Router();

router.post("/cart/totals", getCartTotals);
router.post("/cart/promo/validate", validatePromo);

module.exports = router;
