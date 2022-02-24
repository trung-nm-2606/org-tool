const express = require('express');
const Response = require('../shared/Response');
const userRepo = require('../repo/users');
const encryption = require('../shared/encryption');

const userActivation = async (req, res) => {
  const { c: activationCode, email } = req.query;
  try {
    const userActivation = await userRepo.findUserActivationByEmail(email);
    if (userActivation) {
      if (userActivation.retry_count >= 3) {
        const success = await userRepo.updateUserActivation(userActivation.pk, { status: 'cancelled' });
        if (!success) {
          console.log('[UserActivation]: cannot update user activation status to cancelled after activation expiry');
        }

        const resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage('[UserActivation]: Expired user activation code');
        res.render('user_activation', { title: 'User Activation', ...resp });
        return;
      }

      const matched = await encryption.compare(activationCode, userActivation.activation_code);
      if (matched) {
        let success = false;
        success = await userRepo.updateUserActivation(userActivation.pk, { status: 'processed' });
        if (!success) {
          console.log('[UserActivation]: cannot update user activation status to processed after activation');
        }
        success = await userRepo.updateUser(userActivation.user_pk, { status: 'active' });
        if (!success) {
          console.log('[UserActivation]: cannot update user status to active after activation');
        }
        res.render('user_activation', { title: 'User Activation' });
      } else {
        await userRepo.updateUserActivation(userActivation.pk, { retry_count: userActivation.retry_count + 1 });
        const resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage('[UserActivation]: Wrong ser activation code');
        res.render('user_activation', { title: 'User Activation', ...resp });
      }
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[UserActivation]: Cannot proceed user activation');
      res.render('user_activation', { title: 'User Activation', ...resp });
    }
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
