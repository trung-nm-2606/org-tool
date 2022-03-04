const express = require('express');
const BaseController = require('../../base/controller');
const SsrView = require('../ssrView');
const Validator = require('../validator');
const Controller = require('../controller');

const ssrRouter = express.Router();

ssrRouter.get('/signup', [
  SsrView.signup,
  BaseController.render
]);

ssrRouter.post('/signup', [
  SsrView.signup,
  Validator.validateSignupForm,
  Validator.validateSignup,
  Controller.createUser,
  Controller.generateUserActivation,
  BaseController.render
]);

ssrRouter.get('/activate', [
  SsrView.activation,
  Validator.validateActivationRequest,
  Validator.validateUserActivation,
  Controller.activateUser,
  BaseController.render,
  Controller.handleFailedActivation,
]);

ssrRouter.get('/renew-activation', [
  SsrView.renewActivation,
  Validator.validateRenewActivationRequest,
  Validator.validateRenewUserActivation,
  Controller.renewUserActivation,
  BaseController.render
]);

ssrRouter.get('/login', [
  SsrView.login,
  BaseController.render
]);

ssrRouter.post('/login', [
  SsrView.login,
  Validator.validateLoginForm,
  Validator.validateLogin,
  Controller.logUserIn,
  BaseController.render
]);

ssrRouter.get('/logout', [
  Controller.logUserOut
]);

ssrRouter.get('/invitation', [
  SsrView.invite,
  Controller.getInviation,
  BaseController.render
]);

ssrRouter.post('/invitation', [
  SsrView.invite,
  Validator.validateInvitationToken,
  Validator.validateAddingMember,
  Controller.inviteUser,
  BaseController.render
]);

ssrRouter.use(BaseController.handleError);

module.exports = ssrRouter;
