const express = require('express');

const api = express.Router();

api.use('*', (req, res) => res.status(500).json({ message: 'Invalid API endpoint' }));

module.exports = api;
