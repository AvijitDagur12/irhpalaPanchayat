/**
 * Centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Express Error:", err.stack || err.message);

  // Handle Multer upload errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File size limit exceeded. Maximum allowed size is 5MB.",
      });
    }
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ error: messages.join(", ") });
  }

  // Handle Mongoose duplicate key errors (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(400).json({
      error: `An entry with this ${field || "value"} already exists. Please use a unique value.`,
    });
  }

  // Generic internal server error
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error. Please try again later.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
