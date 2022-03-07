const session = require('../../shared/session');
const Dao = require('./dao');

const Controller = {};

Controller.initGroupTransaction = async (req, res, next) => {
  const { organizationPk } = req.params;
  const { view: { resp } } = res.locals;
  const authenticatedUser = session.getAuthenticatedUser(req);

  const transaction = {
    organization_pk:organizationPk,
    changes: 0,
    value_before: 0,
    description: 'This is an inital transaction of a group',
    created_by: authenticatedUser.pk,
    updated_by: authenticatedUser.pk
  };

  try {
    await Dao.createTransaction(transaction);
    resp.setOperMessage(`Group transaction is initialized successfully`);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

module.exports = Controller;
