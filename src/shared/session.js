const Response = require('./Response');

const session = {};

session.storeAuthenticatedUser = (user, req) => req.session.authenticatedUser = user;

session.getAuthenticatedUser = req => req.session.authenticatedUser;

session.removeAuthenticatedUser = req => req.session.authenticatedUser = null;

session.authenticateUser = (req, res, next) => {
  const { forForm } = req.query;

  if (!!session.getAuthenticatedUser(req)) {
    next();
  } else {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[Validation]: User not authenticated');

    if (forForm === 'true') {
      res.redirect('/login');
    } else {
      res.status(401).json(resp);
    }
  }
};

module.exports = session;
