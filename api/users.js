const express = require('express');
const Response = require('../shared/Response');
const userRepo = require('../repo/users');
const encryption = require('../shared/encryption');

const signupValidator = async (req, res, next) => {
  const body = req.body;
  const { email, password } = body;

  if (!email || !password) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[Signup]: Invalid email/password');
    res.status(400).json(resp);
    return;
  }

  try {
    const user = await userRepo.findUserByEmail(email);
    if (user) {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[Signup]: Given email already existed');
      res.status(409).json(resp);
      return;
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[Signup]: Internal Server Error');
    res.status(500).json(resp);
    return
  }

  next();
};

/**
 * This API is used to signup a new user to the system.
 *
 * The API requires the following fields to signup:
 * - A unique email from `req.body.email`
 * - A password from `req.body.password`
 *
 * @param {*} req
 * @param {*} res
 */
const signup = async (req, res) => {
  const body = req.body;
  const { email, password } = body;

  try {
    const encryptedPassword = await encryption.encrypt(password);
    const success = await userRepo.createUser(email, encryptedPassword);
    if (success) {
      const resp = new Response();
      resp.setPayload({ email, password });
      res.json(resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[Signup]: Cannot sign you up');
      res.json(resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[Signup]: Internal Server Error');
    res.status(500).json(resp);
  }
};

const api = express.Router();
api.post('/signup', signupValidator, signup);

module.exports = api;
