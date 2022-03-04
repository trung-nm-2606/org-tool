const express = require('express');
const session = require('../../../../../../shared/session');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');
const ApiView = require('../../../apiView');
const Validation = require('../../../validator');

const groupsRouter = express.Router();

groupsRouter.post('/new', [
  session.authenticateUser,
  ApiView.api,
  Validation.validateNewOrganizationForm,
  Controller.createOrganization,
  BaseController.render
]);

groupsRouter.put('/:organizationPk/update', [
  session.authenticateUser,
  ApiView.api,
  Validation.validateUpdateOrganizationForm,
  Validation.validateOrganizationOwner,
  Controller.updateOrganization,
  BaseController.render
]);

module.exports = groupsRouter;
