const express = require('express');
const apiRouter = require('./api');
const ssrRouter = require('./ssr');

const userRouter = express.Router();

userRouter.use('/', ssrRouter);
userRouter.use('/api', apiRouter);

module.exports = userRouter;