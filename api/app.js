const express = require('express');
const session = require('../shared/session');

const api = express.Router();

const pingAuth = (req, res) => {
  const { pk, name } = session.getAuthenticatedUser(req)
  res.json({ pk, name });
};

api.get('/ping-auth', session.authenticateUser, pingAuth);

module.exports = api;
