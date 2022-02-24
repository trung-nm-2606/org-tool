const express = require('express');
const userSsr = require('./users');

const ssr = express.Router();
ssr.use('/users', userSsr);

module.exports = ssr;
