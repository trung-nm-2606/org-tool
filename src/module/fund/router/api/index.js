const express = require('express');
const fundEventsRouter = require('./fund-events');
const fundsRouter = require('./funds');

const apiRouter = express.Router();

apiRouter.use('/funds', fundsRouter);
apiRouter.use('/fund-events', fundEventsRouter);

module.exports = apiRouter;
