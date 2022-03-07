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
  Controller.initGroupTransaction,
  BaseController.render
]);

module.exports = groupTransactionRouter;
