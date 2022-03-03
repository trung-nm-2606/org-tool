const BaseError = require('./BaseError');

class ConflictError extends BaseError {
  constructor(message, originalError) {
    super(message, true, 409, originalError);
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
