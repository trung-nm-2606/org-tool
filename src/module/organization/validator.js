const BadRequestError = require('../../model/error/BadRequestError');
const NotFoundError = require('../../model/error/NotFoundError');
const ForbiddenError = require('../../model/error/ForbiddenError');
const Dao = require('./dao');
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

  try {
    const organization = await Dao.findOrganizationByPk(organizationPk);
    if (!organization) {
      next(new NotFoundError('Group Not found'));
      return;
    }

    const authenticatedUser = session.getAuthenticatedUser(req);
    if (organization.created_by !== authenticatedUser.pk) {
      next(new ForbiddenError(`You are not the owner of the group(${organizationPk}) to delete`))
      return;
    }
  } catch (e) {
    next(e);
    return;
  }

  next();
};

module.exports = Validator;
