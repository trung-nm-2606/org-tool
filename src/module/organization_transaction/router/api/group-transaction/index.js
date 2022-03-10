const express = require('express');
const session = require('../../../../../shared/session');
const ApiView = require('../../../../base/apiView');
const BaseController = require('../../../../base/controller');
const OrganizationValidator = require('../../../../organization/validator');
const Validator = require('../../../validator');
const Controller = require('../../../controller');

const groupTransactionRouter = express.Router();

groupTransactionRouter.post('/:organizationPk/init', [
  ApiView.api,
  session.authenticateUser,
  OrganizationValidator.validateOrganizationOwner,
  Validator.validateExistingInitialTransaction,
  Controller.initTransaction,
  BaseController.render
]);

groupTransactionRouter.get('/:organizationPk/get-current-balance', [
  ApiView.api,
  session.authenticateUser,
  OrganizationValidator.validateOrganizationOwner,
  Controller.getCurrentBalance,
  BaseController.render
]);

groupTransactionRouter.post('/:organizationPk/create', [
  ApiView.api,
  session.authenticateUser,
  OrganizationValidator.validateOrganizationOwner,
  Validator.validateRequiredParameters,
  Controller.createTransaction,
  BaseController.render
]);

module.exports = groupTransactionRouter;
