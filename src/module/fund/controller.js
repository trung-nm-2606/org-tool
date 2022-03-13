const Controller = {};

Controller.createFund = async (req, res) => {};

Controller.getFunds = async (req, res) => {};

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
