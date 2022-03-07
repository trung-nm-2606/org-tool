const express = require('express');
const session = require('../../../../../shared/session');
const ApiView = require('../../../../base/apiView');
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


membersRouter.delete('/:organizationPk/:memberPk/remove', [
  ApiView.api,
  session.authenticateUser,
  Validator.validateOrganization,
  Validator.validateOrganizationOwner,
  Validator.validateRemovingMember,
  Controller.removeMember,
  BaseController.render
]);

membersRouter.put('/:organizationPk/leave', [
  ApiView.api,
  session.authenticateUser,
  Validator.validateOrganization,
  Validator.validateLeavingMember,
  Controller.leaveGroup,
  BaseController.render
]);

membersRouter.get('/:organizationPk/get-invitation-link', [
  ApiView.api,
  session.authenticateUser,
  Validator.validateOrganization,
  Validator.validateOrganizationOwner,
  Controller.generateInvitationLink,
  BaseController.render
]);

module.exports = membersRouter;
