const express = require('express');

const usersRouter = express.Router();

usersRouter.get('/get-all', (req, res) => res.json({ message: 'Welcome' }));

module.exports = usersRouter;
