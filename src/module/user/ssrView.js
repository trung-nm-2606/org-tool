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

SsrView.login = (req, res, next) => {
  res.locals.view = new View(true, 'login');
  next();
};

SsrView.invite = (req, res, next) => {
  res.locals.view = new View(true, 'invitation');
  next();
};

module.exports = SsrView;
