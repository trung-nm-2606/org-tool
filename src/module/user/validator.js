const BadRequestError = require("../../model/error/BadRequestError");
const ConflictError = require("../../model/error/ConflictError");
const NotFoundError = require("../../model/error/NotFoundError");
const UnprocessibleEntityError = require("../../model/error/UnprocessableEntityError");
const encryption = require("../../shared/encryption");
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

Validator.validateActivationRequest = (req, res, next) => {
  const { token, email } = req.query;
  if (!token || !email) {
    next(new BadRequestError('Token or Email is missing'));
    return;
  }

  next();
};

Validator.validateUserActivation = async (req, res, next) => {
  const { token, email } = req.query;
  let user, userActivation;
  let err;

  try {
    user = await Dao.findUserByEmail(email);
    if (!user) {
      err = new NotFoundError(`User with email(${email}) is not found`);
      err.operCode = 'UserActivationCode.NotFound';

      next(err);
      return;
    }

    if (['banned', 'archived'].includes(user.status)) {
      err = new UnprocessibleEntityError(`Your account is banned or archived. Please contact CS team`);
      err.operCode = 'UserActivationCode.End';

      next(err);
      return;
    }

    userActivation = await Dao.findUserActivationByEmail(email);

    if (!userActivation) {
      err = new NotFoundError(`User activation with email(${email}) is not found`);
      err.operCode = 'UserActivationCode.NotFound';

      next(err);
      return;
    }

    if (userActivation.status === 'cancelled' || userActivation.retry_count >= 3) {
      err = new UnprocessibleEntityError(`User activation with email(${email}) is expired`);
      err.operCode = 'UserActivationCode.Cancelled';

      next(err);
      return;
    }

    const { email: uEmail } = encryption.verifyToken(token, userActivation.activation_code);
    if (uEmail !== email) {
      err = new BadRequestError(`User activation code is incorrect`);
      err.operCode = 'UserActivationCode.Mismatched';

      // To be used next for activating user, handling failure
      res.locals.needHandleFailedActivation = true;
      res.locals.userActivation = userActivation;

      next(err);
      return;
    }
  } catch (e) {
    next(e);
    return;
  }

  res.locals.userActivation = userActivation;
  next();
};

module.exports = Validator;