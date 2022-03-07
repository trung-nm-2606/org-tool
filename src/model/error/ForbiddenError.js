const BaseError = require('./BaseError');

class ForbiddenError extends BaseError {
  constructor(message, originalError) {
    super(message, true, 403, originalError);
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
