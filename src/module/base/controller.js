const BaseError = require('../../model/error/BaseError');
const Response = require('../../model/Response');

const BaseController = {};

BaseController.logError = (err) => {
  if (err.originalError) console.log(err.originalError);
  console.log(err);
};

BaseController.handleError = (err, req, res, next) => {
  if (!(err instanceof BaseError)) {
    next(err);
    return;
  }

  BaseController.logError(err);

  const resp = new Response();
  resp.setOperStatus(Response.OperStatus.FAILED);
  resp.setOperMessage(err.message);
  resp.setOperCode(err.operCode);

  const { view } = res.locals;
  view.resp = resp;
  view.httpCode = err.httpCode || 500;
  BaseController.render(req, res);
};

BaseController.render = (req, res) => {
  const { view } = res.locals;
  let responder = res;
  if (view.httpCode) responder = res.status(view.httpCode);

  if (view.isSsr) {
    responder.render(view.template, view.resp);
  } else {
    responder.json(view.resp);
  }
};

module.exports = BaseController;
