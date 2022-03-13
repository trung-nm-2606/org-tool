const express = require('express');
const session = require('../../../../../shared/session');
const ApiView = require('../../../../base/apiView');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');
const UserController = require('../../../../user/controller');
const Validator = require('../../../validator');

const fundEventsRouter = express.Router();

fundEventsRouter.post('/new', [
  ApiView.api,
  session.authenticateUser,
  Controller.createFundEvent,
  BaseController.render
]);

fundEventsRouter.get('/:fundPk/get-all', [
  ApiView.api,
  session.authenticateUser,
  Controller.getFundEvents,
  BaseController.render
]);

fundEventsRouter.put('/:fundPk/archive', [
  ApiView.api,
  session.authenticateUser,
  Controller.archiveFundEvent,
  BaseController.render
]);

fundEventsRouter.put('/:fundPk/cancel', [
  ApiView.api,
  session.authenticateUser,
  Controller.cancelFundEvent,
  BaseController.render
]);

module.exports = fundEventsRouter;
