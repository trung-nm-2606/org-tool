const session = require('../../shared/session');
const Dao = require('./dao');

const Controller = {};

Controller.createFund = async (req, res, next) => {
  const { organizationPk } = req.params;
  const { view: { resp } } = res.locals;
  const authenticatedUser = session.getAuthenticatedUser(req);
  const { name, description, currency = 'vnd'  } = req.body;

  try {
    await Dao.createFund(organizationPk, { name, description, currency }, authenticatedUser.pk);
    resp.setPayload({ name, description, currency });
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.getFunds = async (req, res, next) => {
  const { organizationPk } = req.params;
  const { view: { resp } } = res.locals;

  try {
    const funds = await Dao.findFundsByOrganizationPk(organizationPk);
    resp.setPayload(funds);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.deleteFund = async (req, res) => {};

Controller.createFundEvent = async (req, res) => {
  // Optionally create initial transactions for all members of the group to which the fund event belongs
};

Controller.getFundEvents = async (req, res) => {};

Controller.archiveFundEvent = async (req, res) => {};

Controller.cancelFundEvent = async (req, res) => {};

Controller.createTransaction = async (req, res) => {};

Controller.markTransactionPaid = async (req, res) => {};

module.exports = Controller;
