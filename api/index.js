const express = require('express');
const userApi = require('./users');

const api = express.Router();

api.use('/users', userApi);
api.use('*', (req, res) => res.status(500).json({ message: 'Invalid API endpoint' }));

module.exports = api;
