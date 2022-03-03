const BaseError = require('./BaseError');

class NotFoundError extends BaseError {
  constructor(message, originalError) {
    super(message, true, 404, originalError);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
