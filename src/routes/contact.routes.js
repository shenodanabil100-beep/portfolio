const express = require("express");
const { submitContactForm } = require("../controllers/contact.controller");

const router = express.Router();

router.post("/contact", submitContactForm);

module.exports = router;
