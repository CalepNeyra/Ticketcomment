const errorHandler = (err, req, res, next) => {
  console.error("❌ Error capturado en el Middleware Global:", err.message);

  const status = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(status).json({
    status: "error",
    statusCode: status,
    message: err.message || "Error interno del servidor",
  });
};

module.exports = errorHandler;