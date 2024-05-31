// Custom error handler class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Middleware to handle errors
export const errorMiddleware = (err, req, res, next) => {
  // Setting default error message and status code if not provided
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handling CastError specifically
  if (err.name === "CastError") {
    const message = `Resource not found ${err.path}`;
    err = new ErrorHandler(message, 400); // Corrected assignment to err
  }

  // Sending error response with status code and message
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
