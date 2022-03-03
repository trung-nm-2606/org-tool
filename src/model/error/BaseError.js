class BaseError extends Error {
  constructor(message, isOperational, httpCode, originalError) {
    super(message);
    this.isOperational = isOperational;
    this.httpCode = httpCode;
    this.operCode = '';
    this.originalError = originalError;
  }
}

module.exports = BaseError;
