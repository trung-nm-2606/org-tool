const BadRequestError = require('../../model/error/BadRequestError');
const UnprocessableEntityError = require('../../model/error/UnprocessableEntityError');
const Dao = require('./dao');

const Validator = {};

Validator.validateExistingInitialTransaction = async (req, res, next) => {
  const { organizationPk } = req.params;

  try {
    const organization = await Dao.findInitialTransactionByOrganizationPk(organizationPk);
    if (organization) {
      next(new UnprocessableEntityError(`Initial transaction for group(${organizationPk}) is already existed`));
      return;
    }
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Validator.validateRequiredParameters = (req, res, next) => {
  const {
    changes,
    description,
    unit,
    type,
    personal
  } = req.body;

  if (!changes || !description || !unit || !type || !personal) {
    next(new BadRequestError('Transaction parameters are missing'));
    return;
  }

  next();
};

module.exports = Validator;
