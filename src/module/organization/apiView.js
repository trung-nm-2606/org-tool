const View = require('../../model/View');

const SsrView = {};

SsrView.api = (req, res, next) => {
  res.locals.view = new View();
  next();
};

module.exports = SsrView;
