const express = require('express');
const session = require('../../../../../../shared/session');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');
const ApiView = require('../../../apiView');

const groupsRouter = express.Router();

groupsRouter.post('/new', [
  session.authenticateUser,
  ApiView.createOrganization,
  Controller.createOrganization,
  BaseController.render
]);

module.exports = groupsRouter;
