const express = require("express");
const { placeOrder, getOrderByNumber } = require("../controllers/orders.controller");

const router = express.Router();

router.post("/orders", placeOrder);
router.get("/orders/:orderNumber", getOrderByNumber);

module.exports = router;
