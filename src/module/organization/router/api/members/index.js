const express = require('express');
const session = require('../../../../../shared/session');
const ApiView = require('../../../apiView');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');
const UserController = require('../../../../user/controller');
const Validator = require('../../../validator');

const membersRouter = express.Router();

membersRouter.get('/:organizationPk/get-all', [
  ApiView.api,
  session.authenticateUser,
  Controller.getMembers,
  BaseController.render
]);

membersRouter.post('/:organizationPk/invite', [
  ApiView.api,
  session.authenticateUser,
  Validator.validateMemberEmail,
  Validator.validateOrganization,
  Validator.validateOrganizationOwner,
  Validator.validateInvitation,
  UserController.inviteUser,
  BaseController.render
]);

module.exports = membersRouter;
