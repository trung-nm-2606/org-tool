const UnprocessableEntityError = require('../../model/error/UnprocessableEntityError');
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

Controller.getCurrentBalance = async (req, res, next) => {
  const { organizationPk } = req.params;
  const { view: { resp } } = res.locals;

  try {
    const latestTransaction = await Dao.getLatestTransactionByOrganization(organizationPk);
    if (!latestTransaction) {
      next(new UnprocessableEntityError(`Cannot get current balance of group(${organizationPk})`));
      return;
    }

    resp.setOperMessage({
      pk: organizationPk,
      current_balance: latestTransaction.value_before + latestTransaction.changes
    });
  } catch (e) {
    next(e);
    return;
  }

  next();
};

module.exports = Controller;
