/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object|Array} data - Response data
 * @returns {Object} Response object
 */
exports.success = (res, statusCode = 200, message = 'Success', data = null) => {
    const response = {
      success: true,
      message
    };
  
    if (data !== null) {
      response.data = data;
    }
  
    return res.status(statusCode).json(response);
  };
  
  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Error message
   * @param {Object} errors - Additional error details
   * @returns {Object} Response object
   */
  exports.error = (res, statusCode = 400, message = 'Error', errors = null) => {
    const response = {
      success: false,
      message
    };
  
    if (errors !== null) {
      response.errors = errors;
    }
  
    return res.status(statusCode).json(response);
  };
  
  /**
   * Pagination response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Success message
   * @param {Object} data - Response data with pagination
   * @returns {Object} Response object
   */
  exports.paginate = (res, statusCode = 200, message = 'Success', data) => {
    const { count, rows, limit = 10, page = 1 } = data;
    
    const totalPages = Math.ceil(count / limit);
    
    const paginationData = {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page),
      itemsPerPage: parseInt(limit),
      items: rows
    };
    
    return this.success(res, statusCode, message, paginationData);
  };