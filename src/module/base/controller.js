const Response = require('../../model/Response');

const BaseController = {};

BaseController.logError = (err) => {
  if (err.originalError) console.log(err.originalError);
  console.log(err);
};

BaseController.handleError = (err, req, res, next) => {
  if (!err.isOperational) {
    next(err);
    return;
  }

  BaseController.logError(err);

  const resp = new Response();
  resp.setOperStatus(Response.OperStatus.FAILED);
  resp.setOperMessage(err.message);

  const { view } = res.locals;
  view.resp = resp;
  view.httpStatusCode = err.httpStatusCode || 500;
  BaseController.render(req, res);
};

BaseController.render = (req, res) => {
  const { view } = res.locals;
  let responder = res;
  if (view.httpStatusCode) responder = res.status(view.httpStatusCode);

  if (view.isSsr) {
    responder.render(view.template, view.resp);
  } else {
    responder.json(view.resp);
  }
};

module.exports = BaseController;
