const InternalServerError = require('./InternalServerError');

class DaoError extends InternalServerError {
  constructor(message, originalError) {
    super(message, originalError);
    this.name = 'DaoError';
  }
}

module.exports = DaoError;
