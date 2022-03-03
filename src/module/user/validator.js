const BadRequestError = require("../../model/error/BadRequestError");
const ConflictError = require("../../model/error/ConflictError");
const Dao = require('./dao');

const Validator = {};

Validator.validateSignupForm = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Email or password is missing'));
    return;
  }

  next();
};

Validator.validateSignup = async (req, res, next) => {
  const body = req.body;
  const { email } = body;

  try {
    console.log(this);
    const user = await Dao.findUserByEmail(email);
    if (user) {
      next(new ConflictError(`Email(${email}) is already registered for another account`));
      return;
    }
  } catch (e) {
    next(e);
    return;
  }

  next();
};

module.exports = Validator;
