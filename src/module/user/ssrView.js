const View = require('../../model/View');

const SsrView = {};

SsrView.signup = (req, res, next) => {
  res.locals.view = new View(true, 'signup');
  next();
};

SsrView.activation = (req, res, next) => {
  res.locals.view = new View(true, 'user_activation');
  next();
};

SsrView.renewActivation = (req, res, next) => {
  res.locals.view = new View(true, 'user_activation_renew');
  next();
};

module.exports = SsrView;
