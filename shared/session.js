const session = {};

session.storeAuthenticatedUser = (user, req) => req.session.authenticatedUser = user;

session.getAuthenticatedUser = req => req.authenticatedUser;

session.removeAuthenticatedUser = req => req.authenticatedUser = null;

module.exports = session;
