const BadRequestError = require("../../model/error/BadRequestError");
const ConflictError = require("../../model/error/ConflictError");
const NotFoundError = require("../../model/error/NotFoundError");
const UnprocessibleEntityError = require("../../model/error/UnprocessableEntityError");
const encryption = require("../../shared/encryption");
const Dao = require('./dao');
const OrganizationDao = require('../organization/dao');

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

Validator.validateLoginForm = Validator.validateSignupForm;

Validator.validateLogin = async (req, res, next) => {
  const body = req.body;
  const { email } = body;

  try {
    const user = await Dao.findUserByEmail(email);
    if (!user) {
      next(new NotFoundError(`User with email(${email}) is not found`));
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
      err = new UnprocessibleEntityError(`Your account with email(${email}) is banned or archived. Please contact CS team`);
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
      err = new UnprocessibleEntityError(`User activation with email(${email}) is exceeding retries`);
      err.operCode = 'UserActivationCode.Cancelled';

      next(err);
      return;
    }

    const { email: uEmail, activationCode } = encryption.verifyToken(token, userActivation.activation_code);

    if (userActivation.activation_code !== activationCode) {
      err = new UnprocessibleEntityError(`User activation with email(${email}) is expired`);
      err.operCode = 'UserActivationCode.Old';

      next(err);
      return;
    }

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

Validator.validateRenewActivationRequest = (req, res, next) => {
  const { email } = req.query;
  if (!email) {
    next(new BadRequestError('Email is missing'));
    return;
  }

  next();
};

Validator.validateRenewUserActivation = async (req, res, next) => {
  const { email } = req.query;
  let user, userActivation;
  let err;

  try {
    user = await Dao.findUserByEmail(email);
    if (!user) {
      err = new NotFoundError(`Account with email(${email}) is not found`);
      err.operCode = 'UserActivationCode.Renew.UserNotFound';

      next(err);
      return;
    }

    if (['banned', 'archived'].includes(user.status)) {
      err = new UnprocessibleEntityError(`Your account with email(${email}) is banned or archived. Please contact CS team`);
      err.operCode = 'UserActivationCode.End';

      next(err);
      return;
    }

    userActivation = await Dao.findUserActivationByEmail(email);
  } catch (e) {
    next(e);
    return;
  }

  res.locals.user = user;
  res.locals.userActivation = userActivation;
  next();
};

Validator.validateInvitationToken = async (req, res, next) => {
  const { 'invitation-token': token, email } = req.body;
  let user, invitationData, organization;

  try {
    invitationData = encryption.verifyToken(token, 'ac7iva7i0nC0d3');

    const {
      organizationOwnerPk,
      organizationOwnerEmail,
      organizationPk
    } = invitationData;

    const ownerUser = await Dao.findUserByEmail(organizationOwnerEmail);
    if (!ownerUser) {
      next(new NotFoundError('Invalid invitation token. Invitation owner user is not found'));
      return;
    }

    if (ownerUser.pk !== organizationOwnerPk) {
      next(new BadRequestError('Invalid invitation token. Invitation owner user is incorrect'));
      return;
    }

    const organizations = await OrganizationDao.findOrganizationsOwnedByUserPk(ownerUser.pk);
    organization = organizations.find(({ pk }) => +pk === +organizationPk);
    if (!organization) {
      const err = new NotFoundError('Invalid invitation token. Group is not found');
      err.operCode = 'group.notfound';
      next(err);
      return;
    }

    user = await Dao.findUserByEmail(email);
    if (!user) {
      const err = new NotFoundError(`Invalid invitation token. User with email(${email}) is not found`);
      err.operCode = 'user.notfound';
      next(err);
      return;
    }
  } catch (e) {
    next(e);
    return;
  }

  res.locals.invitationData = invitationData;
  res.locals.user = user;
  res.locals.organization = organization;
  next();
};

Validator.validateAddingMember = (req, res, next) => {
  const { user } = res.locals;

  if (['banned', 'archived'].includes(user.status)) {
    next(new UnprocessibleEntityError(`User with email(${user.email}) is banned or archived. Please contact CS team`))
    return;
  }

  next();
};

module.exports = Validator;
