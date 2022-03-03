const View = require('../../model/View');

const SsrView = {};

SsrView.signup = (req, res, next) => {
  res.locals.view = new View(true, 'signup');
  next();
};

module.exports = SsrView;
