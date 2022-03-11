const express = require('express');
const session = require('../../../../../shared/session');
const ApiView = require('../../../../base/apiView');
const BaseController = require('../../../../base/controller');
const Controller = require('../../../controller');
const UserController = require('../../../../user/controller');
const Validator = require('../../../validator');

const fundsRouter = express.Router();

module.exports = fundsRouter;
