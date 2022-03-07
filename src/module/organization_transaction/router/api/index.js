const express = require('express');
const groupTransactionRouter = require('./group-transaction');

const apiRouter = express.Router();

apiRouter.use('/group-transaction', groupTransactionRouter);

module.exports = apiRouter;
