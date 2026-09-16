/* 404 handler for any route that didn't match */
function notFoundHandler(req, res) {
  res.status(404).json({ error: "not_found", message: `Cannot ${req.method} ${req.originalUrl}` });
}

/* Catches JSON body-parser errors and anything thrown/next(err)'d downstream.
   Kept last in the middleware chain (4-arg signature is required by Express
   to be recognized as an error handler). */
function errorHandler(err, req, res, _next) {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "invalid_json", message: "Request body must be valid JSON." });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: "internal_error",
    message: status === 500 ? "Something went wrong on our end." : err.message,
  });
}

module.exports = { notFoundHandler, errorHandler };
