const BadRequestError = require('../../model/error/BadRequestError');
const NotFoundError = require('../../model/error/NotFoundError');
const ForbiddenError = require('../../model/error/ForbiddenError');
const UnprocessableEntityError = require('../../model/error/UnprocessableEntityError');
const Dao = require('./dao');
const UserDao = require('../user/dao');
const session = require('../../../shared/session');

const Validator = {};

Validator.validateNewOrganizationForm = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    next(new BadRequestError('Email or password is missing'));
    return;
  }

  next();
};

Validator.validateUpdateOrganizationForm = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    next(new BadRequestError('Email or password is missing'));
    return;
  }

  const { organizationPk } = req.params;
  if (req.method === 'PUT' && (!organizationPk || +organizationPk <= 0)) {
    next(new BadRequestError('Target group is missing'));
    return;
  }

  next();
};

Validator.validateOrganizationOwner = async (req, res, next) => {
  const { organizationPk } = req.params;
  let organization;

  try {
    organization = await Dao.findOrganizationByPk(organizationPk);
    if (!organization) {
      next(new NotFoundError('Group Not found'));
      return;
    }

    const authenticatedUser = session.getAuthenticatedUser(req);
    if (organization.created_by !== authenticatedUser.pk) {
      next(new ForbiddenError(`You are not the owner of the group(${organizationPk}) to operate`))
      return;
    }
  } catch (e) {
    next(e);
    return;
  }

  res.locals.organization = organization;
  next();
};

Validator.validateMemberEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    next(new BadRequestError('Member email is missing'));
    return;
  }

  next();
};

Validator.validateOrganization = async (req, res, next) => {
  const { organizationPk } = req.params;

  if (!organizationPk || +organizationPk <= 0) {
    next(new BadRequestError('Target group is missing'));
    return;
  }

  next();
};

Validator.validateInvitation = async (req, res, next) => {
  const { email } = req.body;
  let user, userActivation;
  let err;

  try {
    user = await UserDao.findUserByEmail(email);
    if (!user) {
      err = new NotFoundError(`Member user with email(${email}) is not found`);
      next(err);
      return;
    }

    if (['banned', 'archived'].includes(user.status)) {
      err = new UnprocessableEntityError(`Member user with email(${email}) is banned or archived`);
      next(err);
      return;
    }

    userActivation = await UserDao.findUserActivationByEmail(email);
  } catch (e) {
    next(e);
    return;
  }

  res.locals.user = user;
  res.locals.userActivation = userActivation;
  next();
};

Validator.validateRemovingMember = (req, res, next) => {
  const { memberPk } = req.params;
  const { organization } = res.locals;

  if (!memberPk || +memberPk <= 0) {
    next(new BadRequestError('Target member is missing'));
    return;
  }

  if (+organization.created_by === +memberPk) {
    next(new UnprocessableEntityError('You are the owner of the group to not be removed'));
    return;
  }

  next();
};

module.exports = Validator;
