const session = require('../../shared/session');
const Service = require('../user/service');
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
  const { isActive } = req.query;
  const { view: { resp } } = res.locals;
  const authenticatedUser = session.getAuthenticatedUser(req);

  try {
    await Dao.deleteOrganization(organizationPk, isActive === '1', authenticatedUser.pk);
    resp.setPayload({ pk: organizationPk });
    res.json(resp);
  } catch (e) {
    next(e);
    return;
  }

  next();
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

Controller.removeMember = async (req, res, next) => {
  const { view: { resp } } = res.locals;
  const { organizationPk, memberPk } = req.params;

  try {
    await Dao.removeUserFromOrganization(organizationPk, memberPk);
    resp.setOperMessage(`Member removed from group successullfy`);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.leaveGroup = async (req, res, next) => {
  const { view: { resp } } = res.locals;
  const { organizationPk } = req.params;
  const authenticatedUser = session.getAuthenticatedUser(req);

  try {
    await Dao.removeUserFromOrganization(organizationPk, authenticatedUser.pk);
    resp.setOperMessage(`Member removed from group successullfy`);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.generateInvitationLink = (req, res, next) => {
  const { organizationPk } = req.params;
  const { view: { resp } } = res.locals;
  const authenticatedUser = session.getAuthenticatedUser(req);

  try {
    const token = Service.generateUserInvitationToken(
      authenticatedUser.pk,
      authenticatedUser.email,
      organizationPk
    );
    resp.setPayload(`http://localhost:8080/users/invitation?token=${token}`);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.setActiveGroup = async (req, res, next) => {
  const { organizationPk } = req.params;
  const { view: { resp } } = res.locals;
  const authenticatedUser = session.getAuthenticatedUser(req);

  try {
    await Dao.setActiveGroup(organizationPk, authenticatedUser.pk);
    resp.setOperMessage(`Set active group successullfy`);
    res.json(resp);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

module.exports = Controller;
