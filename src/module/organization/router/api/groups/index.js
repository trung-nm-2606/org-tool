const express = require('express');
const session = require('../../../../../shared/session');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');
const ApiView = require('../../../../base/apiView');
const Validation = require('../../../validator');

const groupsRouter = express.Router();

groupsRouter.get('/get-all', [
  ApiView.api,
  session.authenticateUser,
  Controller.getOrganizations,
  BaseController.render
]);

groupsRouter.post('/new', [
  ApiView.api,
  session.authenticateUser,
  Validation.validateNewOrganizationForm,
  Controller.createOrganization,
  BaseController.render
]);

groupsRouter.put('/:organizationPk/update', [
  ApiView.api,
  session.authenticateUser,
  Validation.validateUpdateOrganizationForm,
  Validation.validateOrganizationOwner,
  Controller.updateOrganization,
  BaseController.render
]);

groupsRouter.delete('/:organizationPk/delete', [
  ApiView.api,
  session.authenticateUser,
  Validation.validateOrganizationOwner,
  Controller.deleteOrganization,
  BaseController.render
]);

module.exports = groupsRouter;
