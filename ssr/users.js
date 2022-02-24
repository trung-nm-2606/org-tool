const express = require('express');
response = require('../shared/Response');
const userRepo = require('../repo/users');
const encryption = require('../shared/encryption');

const userActivation = async (req, res) => {
  const { c: activationCode, email } = req.query;
  try {
    let resp;
    let success;
    const userActivation = await userRepo.findUserActivationByEmail(email);
    if (!userActivation) {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[UserActivation]: Cannot proceed user activation');
      res.render('user_activation', { title: 'User Activation', ...resp });
      return;
    }

    if (userActivation.status === 'processed') {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.SUCCESS);
      resp.setOperMessage('[UserActivation]: Your account was already activated');
      res.render('user_activation', { title: 'User Activation', ...resp });
      return;
    }

    if (userActivation.status === 'cancelled') {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[UserActivation]: Expired user activation code');
      res.render('user_activation', { title: 'User Activation', ...resp });
      return;
    }

    if (userActivation.retry_count >= 3) {
      success = await userRepo.updateUserActivation(userActivation.pk, { status: 'cancelled' });
      if (!success) {
        console.log('[UserActivation]: cannot update user activation status to cancelled after activation expiry');
      }

      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[UserActivation]: Expired user activation code');
      res.render('user_activation', { title: 'User Activation', ...resp });
      return;
    }

    const matched = await encryption.compare(activationCode, userActivation.activation_code);
    if (!matched) {
      await userRepo.updateUserActivation(userActivation.pk, { retry_count: userActivation.retry_count + 1 });
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[UserActivation]: Wrong ser activation code');
      res.render('user_activation', { title: 'User Activation', ...resp });
      return;
    }

    success = await userRepo.updateUserActivation(userActivation.pk, { status: 'processed' });
    if (!success) {
      console.log('[UserActivation]: cannot update user activation status to processed after activation');
    }
    success = await userRepo.updateUser(userActivation.user_pk, { status: 'active' });
    if (!success) {
      console.log('[UserActivation]: cannot update user status to active after activation');
    }
    resp = new Response();
    resp.setOperStatus(Response.OperStatus.SUCCESS);
    resp.setOperMessage('[UserActivation]: Your account is activated successfully');
    res.render('user_activation', { title: 'User Activation', ...resp });
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[UserActivation]: Internal Server Error');
    res.render('user_activation', { title: 'User Activation', ...resp });
  }
};

const ssr = express.Router();
ssr.get('/activation', userActivation);

module.exports = ssr;
