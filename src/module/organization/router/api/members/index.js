const express = require('express');
const session = require('../../../../../shared/session');
const ApiView = require('../../../apiView');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');

const membersRouter = express.Router();

membersRouter.get('/:organizationPk/get-all', [
  ApiView.api,
  session.authenticateUser,
  Controller.getMembers,
  BaseController.render
]);

module.exports = membersRouter;
