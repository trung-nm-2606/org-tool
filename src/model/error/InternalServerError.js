const BaseError = require('./BaseError');

class InternalServerError extends BaseError {
  constructor(message, originalError) {
    super(message, true, 500, originalError);
    this.name = 'InternalServerError';
  }
}

module.exports = InternalServerError;
