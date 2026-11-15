/**
 * Centralized error-handling middleware for the Student Management REST API.
 */

// Handles 404 for unknown endpoints
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
}

// Global error handler
export function errorHandler(err, req, res, next) {
  // Catch malformed JSON payload error thrown by express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload. Please ensure request body is valid JSON.'
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.status || err.statusCode || 500;

  // Log server errors internally
  if (statusCode >= 500) {
    console.error('Unhandled server error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: statusCode >= 500 && isProduction
      ? 'An unexpected internal server error occurred.'
      : err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack })
  });
}
