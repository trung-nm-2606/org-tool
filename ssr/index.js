const express = require('express');

const api = express.Router();

const userActivation = (req, res) => {
  res.render('user_activation', { title: 'User Activation' });
};

api.get('/user/activation', userActivation);

module.exports = api;
