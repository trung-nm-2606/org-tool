const express = require('express');
const groupsRouter = require('./groups');
const membersRouter = require('./members');

const apiRouter = express.Router();

apiRouter.use('/groups', groupsRouter);
apiRouter.use('/members', membersRouter);

module.exports = apiRouter;
