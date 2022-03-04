const express = require('express');

const apiRouter = express.Router();

apiRouter.get('/get-all', (req, res) => res.json({ message: 'Welcome' }));

module.exports = apiRouter;
