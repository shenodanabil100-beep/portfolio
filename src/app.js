const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const productsRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");
const contactRoutes = require("./routes/contact.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api", productsRoutes);
  app.use("/api", cartRoutes);
  app.use("/api", ordersRoutes);
  app.use("/api", contactRoutes);
  app.use("/api", newsletterRoutes);

  // The full storefront (index.html, shop.html, product.html, cart.html,
  // about-contact.html + css/js) lives in /public and is served as-is.
  const publicDir = path.join(__dirname, "..", "public");
  app.use(express.static(publicDir));

  // Any /api/* path that didn't match a route above is a real 404.
  app.use("/api", notFoundHandler);

  // Anything else (a page path with no matching static file) falls back to
  // index.html so direct navigation/refreshes on the site still work.
  // (Plain middleware, not a "*" route pattern — Express 5's router no
  // longer accepts a bare wildcard path string.)
  app.use((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return res.status(404).json({ error: "not_found", message: `Cannot ${req.method} ${req.originalUrl}` });
    }
    res.sendFile(path.join(publicDir, "index.html"));
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
