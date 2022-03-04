const View = require('../../model/View');

const ApiView = {};

ApiView.api = (req, res, next) => {
  res.locals.view = new View();
  next();
};

module.exports = ApiView;
