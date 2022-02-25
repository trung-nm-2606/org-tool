const express = require('express');
const appApi = require('./app');
const usersApi = require('./users');
const organizationsApi = require('./organizations');

const api = express.Router();

api.use('/users', usersApi);
api.use('/groups', organizationsApi);
api.use('/app', appApi);
api.use('*', (req, res) => res.status(404).json({ oper: { status: 'failed', message: 'API endpoint Not found' } }));

module.exports = api;
