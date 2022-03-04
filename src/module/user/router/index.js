const express = require('express');
const apiRouter = require('./api');
const ssrRouter = require('./ssr');

const userRouter = express.Router();

userRouter.use('/users', ssrRouter);
userRouter.use('/api/users', apiRouter);

module.exports = userRouter;