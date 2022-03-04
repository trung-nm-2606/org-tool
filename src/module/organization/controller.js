const session = require('../../../shared/session');
const Dao = require('./dao');

const Controller = {};

Controller.getOrganizations = async (req, res, next) => {
  const authenticatedUser = session.getAuthenticatedUser(req);
  const { view: { resp } } = res.locals;

  try {
    const organizations = await Dao.findOrganizationsByUserPk(authenticatedUser.pk);
    resp.setPayload(organizations);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.createOrganization = async (req, res, next) => {
  const { name, description } = req.body;
  const { view: { resp } } = res.locals;
  const authenticatedUser = session.getAuthenticatedUser(req);

  try {
    await Dao.createOrganization(name, description, authenticatedUser);
    resp.setPayload({ name, description });
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.updateOrganization = async (req, res, next) => {
  const { organizationPk } = req.params;
  const { name, description } = req.body;
  const { view: { resp } } = res.locals;
  const authenticatedUser = session.getAuthenticatedUser(req);

  try {
    await Dao.updateOrganization(organizationPk, authenticatedUser.pk, { name, description });
    resp.setPayload({ pk: organizationPk, name, description });
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.deleteOrganization = async (req, res, next) => {
  const { organizationPk } = req.params;
  const { view: { resp } } = res.locals;

  try {
    await Dao.deleteOrganization(organizationPk);
    resp.setPayload({ pk: organizationPk });
    res.json(resp);
  } catch (e) {
    next(e);
    return;
  }
};

Controller.getMembers = async (req, res, next) => {
  const { organizationPk } = req.params;
  const { view: { resp } } = res.locals;

  try {
    const members = await Dao.findMembersByOrganizationPk(organizationPk);
    resp.setPayload(members);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

module.exports = Controller;
