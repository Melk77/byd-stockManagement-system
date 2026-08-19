// Global error handler — mount LAST in server.js, after all routes.
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error.",
  });
};

module.exports = errorHandler;
