const express = require('express');
const session = require('../../../../../shared/session');
const ApiView = require('../../../../base/apiView');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');

const usersRouter = express.Router();

usersRouter.put('/self/update', [
  ApiView.api,
  session.authenticateUser,
  Controller.updateUser,
  BaseController.render
]);

usersRouter.get('/ping-auth', session.authenticateUser, (req, res) => {
  const { pk, name } = session.getAuthenticatedUser(req)
  res.json({ pk, name }); // Specially here only
});

module.exports = usersRouter;
