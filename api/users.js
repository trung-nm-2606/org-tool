const express = require('express');
const Response = require('../shared/Response');
const userRepo = require('../repo/users');
const encryption = require('../shared/encryption');
const session = require('../shared/session');
const mailer = require('../shared/mailer');

const emailPasswordValidator = (req, res, next) => {
  const body = req.body;
  const { email, password } = body;

  if (!email || !password) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[Validation]: Invalid email/password');
    res.status(400).json(resp);
    return;
  }

  next();
};

const signupValidator = async (req, res, next) => {
  const body = req.body;
  const { email } = body;

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

const createUserActivation = async (email) => {
  try {
    const activationCode = `${Math.round(Math.random() * 1E9)}`;
    const encryptedActivationCode = await encryption.encrypt(activationCode);
    await userRepo.createUserActivation(email, encryptedActivationCode);
    const content = `<p>Click <a href="http://localhost:8080/users/activation?c=${activationCode}&email=${email}">this link</a> to activate your account</p>`;
    await mailer.sendMail(email, 'User Activation', content);
  } catch (e) {
    console.log(`[Signup]: Cannot create user activation(email=${email}). ${e.message}`);
  }
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
      createUserActivation(email);
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

const login = async (req, res) => {
  const body = req.body;
  const { email, password } = body;
  const { forForm } = req.query;

  try {
    const user = await userRepo.findUserByEmail(email);
    if (user) {
      const matched = await encryption.compare(password, user.encrypted_password);
      if (matched) {
        session.storeAuthenticatedUser(user, req);
        const resp = new Response();
        resp.setPayload(true);

        if (forForm === 'true') {
          res.redirect('/');
        } else {
          res.json(resp);
        }
      } else {
        const resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage(`[Login]: Wrong email/password`);
        if (forForm === 'true') {
          res.render('login', resp);
        } else {
          res.json(resp);
        }
      }
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[Login]: User(${email}) not found`);
      if (forForm === 'true') {
        res.render('login', resp);
      } else {
        res.json(resp);
      }
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[Login]: Internal Server Error');
    if (forForm === 'true') {
      res.render('login', resp);
    } else {
      res.status(500).json(resp);
    }
  }
};

const logout = (req, res) => {
  session.removeAuthenticatedUser(req);

  const { forForm } = req.query;
  if (forForm === 'true') {
    res.redirect('/login');
  } else {
    const resp = new Response();
    resp.setPayload(true);
    res.json(resp);
  }
};

const update = async (req, res) => {
  const { userPk } = req.params;
  const { name, fullName } = req.body;

  try {
    const success = await userRepo.updateUser(userPk, { name, fullName });
    if (success) {
      const resp = new Response();
      resp.setPayload({ name, fullName });
      res.json(resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[UpdateUser]: Cannot update user`);
      res.json(resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[UpdateUser]: Internal Server Error');
    res.status(500).json(resp);
  }
};

const api = express.Router();
api.post('/signup', emailPasswordValidator, signupValidator, signup);
api.post('/login', emailPasswordValidator, login);
api.post('/logout', logout);
api.post('/:userPk/update', session.authenticateUser, update);

module.exports = api;
