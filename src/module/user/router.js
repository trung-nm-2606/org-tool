const express = require('express');
const BaseController = require('../base/controller');
const SsrView = require('./ssrView');
const Validator = require('./validator');
const Controller = require('./controller');

const userRouter = express.Router();

userRouter.get('/signup', [
  SsrView.signup,
  BaseController.render
]);

userRouter.post('/signup', [
  SsrView.signup,
  Validator.validateSignupForm,
  Validator.validateSignup,
  Controller.createUser,
  Controller.generateUserActivation,
  BaseController.render
]);

userRouter.get('/activate', [
  SsrView.activation,
  Validator.validateActivationRequest,
  Validator.validateUserActivation,
  Controller.activateUser,
  BaseController.render,
  Controller.handleFailedActivation,
]);

userRouter.get('/renew-activation', [
  SsrView.renewActivation,
  Validator.validateRenewActivationRequest,
  Validator.validateRenewUserActivation,
  Controller.renewUserActivation,
  BaseController.render
]);

userRouter.get('/login', [
  SsrView.login,
  BaseController.render
]);

userRouter.post('/login', [
  SsrView.login,
  Validator.validateLoginForm,
  Validator.validateLogin,
  Controller.logUserIn,
  BaseController.render
]);

userRouter.get('/logout', [
  Controller.logUserOut
]);

userRouter.get('/invitation', [
  SsrView.invite,
  Controller.getInviation,
  BaseController.render
]);

userRouter.post('/invitation', [
  SsrView.invite,
  Validator.validateInvitationToken,
  Validator.validateAddingMember,
  Controller.inviteUser,
  BaseController.render
]);

userRouter.use(BaseController.handleError);

module.exports = userRouter;