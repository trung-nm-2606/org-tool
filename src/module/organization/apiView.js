const View = require('../../model/View');

const SsrView = {};

SsrView.createOrganization = (req, res, next) => {
  res.locals.view = new View();
  next();
};

module.exports = SsrView;
