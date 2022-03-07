const UnprocessableEntityError = require("../../model/error/UnprocessableEntityError");
const Dao = require("./dao");

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

module.exports = Validator;
