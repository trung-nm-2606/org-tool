const BaseError = require('./BaseError');

class BadRequestError extends BaseError {
  constructor(message, originalError) {
    super(message, true, 400, originalError);
    this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;
