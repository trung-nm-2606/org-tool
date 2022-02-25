const express = require('express');
const session = require('../shared/session');

const api = express.Router();

const pingAuth = (req, res) => res.send(!!session.getAuthenticatedUser(req));

api.get('/ping-auth', session.authenticateUser, pingAuth);

module.exports = api;
