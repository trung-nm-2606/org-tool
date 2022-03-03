const express = require('express');
const userSsr = require('./users');
const userRepo = require('../repo/users');
const Response = require('../shared/Response');
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
    if (req.originalUrl === '/login') {
      res.render('login', resp);
    } else if (req.originalUrl === '/signup') {
      res.render('signup', resp);
    } else {
      res.status(400).json(resp);
    }
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
      res.render('signup', resp);
      return;
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[Signup]: Internal Server Error');
    res.render('signup', resp);
    return
  }

  next();
};

const createUserActivation = async (email) => {
  try {
    const activationCode = `${Math.round(Math.random() * 1E9)}`;
    const activationToken = encryption.createActivationToken({ email }, activationCode);
    await userRepo.createUserActivation(email, activationCode);
    const content = `<p>Click <a href="http://localhost:8080/users/activation?token=${activationToken}&email=${email}">this link</a> to activate your account</p>`;
    await mailer.sendMail(email, 'User Activation', content);
  } catch (e) {
    console.log(`[Signup]: Cannot create user activation(email=${email}). ${e.message}`);
  }
};

const getSignup = (req, res) => res.render('signup');

const postSignup = async (req, res) => {
  const body = req.body;
  const { email, password } = body;

  try {
    const encryptedPassword = await encryption.encrypt(password);
    const success = await userRepo.createUser(email, encryptedPassword);
    if (success) {
      createUserActivation(email);
      const resp = new Response();
      resp.setOperMessage(`[Signup]: An email has been sent to your email(${email}) to verify and activate your account`);
      res.render('signup', resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[Signup]: Cannot sign you up');
      res.render('signup', resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[Signup]: Internal Server Error');
    res.render('signup', resp);
  }
};

const getLogin = (req, res) => {
  if (session.getAuthenticatedUser(req)) {
    res.redirect('/');
    return;
  }
  res.render('login');
};

const postLogin = async (req, res) => {
  const body = req.body;
  const { email, password } = body;

  try {
    const user = await userRepo.findUserByEmail(email);
    if (user) {
      const matched = await encryption.compare(password, user.encrypted_password);
      if (matched) {
        session.storeAuthenticatedUser(user, req);
        res.redirect('/');
      } else {
        const resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage(`[Login]: Wrong email/password`);
        res.render('login', resp);
      }
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[Login]: User(${email}) not found`);
      res.render('login', resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[Login]: Internal Server Error');
    res.render('login', resp);
  }
};


const logout = (req, res) => {
  session.removeAuthenticatedUser(req);
  res.redirect('/login');
};

const ssr = express.Router();

// ssr.get('/signup', getSignup);
// ssr.post('/signup', emailPasswordValidator, signupValidator, postSignup);

// ssr.get('/login', getLogin);
// ssr.post('/login', emailPasswordValidator, postLogin);

ssr.get('/logout', logout);

ssr.use('/users', userSsr);

module.exports = ssr;
