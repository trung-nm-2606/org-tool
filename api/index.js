const express = require('express');
const appApi = require('./app');
const usersApi = require('./users');
const organizationsApi = require('./organizations');

const api = express.Router();

api.use('/users', usersApi);
api.use('/groups', organizationsApi);
api.use('/app', appApi);
api.use('*', (req, res) => res.status(500).json({ message: 'Invalid API endpoint' }));

module.exports = api;
