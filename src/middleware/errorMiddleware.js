export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value", details: err.keyValue });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier" });
  }

  const status = err.statusCode || 500;
  return res.status(status).json({
    message: err.message || "Server error",
  });
}
