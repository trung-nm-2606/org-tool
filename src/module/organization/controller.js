const session = require('../../../shared/session');
const Dao = require('./dao');

const Controller = {};

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

module.exports = Controller;
