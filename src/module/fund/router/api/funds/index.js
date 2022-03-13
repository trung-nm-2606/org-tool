const express = require('express');
const session = require('../../../../../shared/session');
const ApiView = require('../../../../base/apiView');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');
const UserController = require('../../../../user/controller');
const Validator = require('../../../validator');

const fundsRouter = express.Router();

fundsRouter.post('/:organizationPk', [
  ApiView.api,
  session.authenticateUser,
  Controller.createFund,
  BaseController.render
]);

fundsRouter.get('/:organizationPk/get-all', [
  ApiView.api,
  session.authenticateUser,
  Controller.getFunds,
  BaseController.render
]);

fundsRouter.delete('/:organizationPk/:fundPk/delete', [
  ApiView.api,
  session.authenticateUser,
  Controller.deleteFund,
  BaseController.render
]);

module.exports = fundsRouter;
