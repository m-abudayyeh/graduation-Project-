/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }
  
    // Structure the error response
    const errorResponse = {
      error: {
        message: err.message || 'Internal Server Error',
        status: statusCode
      }
    };
  
    // Add error details for development environment
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = err.stack;
      
      // Add validation errors if available
      if (err.errors) {
        errorResponse.error.details = err.errors;
      }
    }
  
    // Send error response
    res.status(statusCode).json(errorResponse);
  };
  
  module.exports = errorHandler;