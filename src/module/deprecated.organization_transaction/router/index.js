const express = require('express');
const apiRouter = require('./api');

const organizationRouter = express.Router();

organizationRouter.use('/api', apiRouter);

module.exports = organizationRouter;