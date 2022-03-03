const BaseError = require('./BaseError');

class UnprocessableEntityError extends BaseError {
  constructor(message, originalError) {
    super(message, true, 422, originalError);
    this.name = 'UnprocessableEntityError';
  }
}

module.exports = UnprocessableEntityError;
