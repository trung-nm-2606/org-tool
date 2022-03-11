const express = require('express');
const apiRouter = require('./api');

const fundRouter = express.Router();

fundRouter.use('/api', apiRouter);

module.exports = fundRouter;