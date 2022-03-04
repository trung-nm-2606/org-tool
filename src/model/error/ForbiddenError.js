const BaseError = require('./BaseError');

class ForbiddenError extends BaseError {
  constructor(message, originalError) {
    super(message, true, 404, originalError);
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
