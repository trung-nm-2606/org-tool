const express = require('express');
const Response = require('../shared/Response');
const userRepo = require('../repo/users');
const organizationRepo = require('../repo/organizations');
const encryption = require('../shared/encryption');
const mailer = require('../shared/mailer');

const createUserActivation = async (email) => {
  try {
    const activationCode = `${Math.round(Math.random() * 1E9)}`;
    const activationToken = encryption.createToken({ email }, activationCode);
    await userRepo.createUserActivation(email, activationCode);
    const content = `<p>Click <a href="http://localhost:8080/users/activation?token=${activationToken}&email=${email}">this link</a> to activate your account</p>`;
    await mailer.sendMail(email, 'User Activation', content);
    return true;
  } catch (e) {
    console.log(`[UserActivation.Renew]: Cannot renew activation(email=${email}). ${e.message}`);
    return false;
  }
};

const renewUserActivation = async (userActivation) => {
  let success;
  try {
    const activationCode = `${Math.round(Math.random() * 1E9)}`;
    const activationToken = encryption.createToken({ email: userActivation.email }, activationCode);

    success = await userRepo.updateUserActivation(userActivation.pk, {
      activation_code: activationCode,
      retry_count: 0,
      status: 'pending',
      renew_count: userActivation.renew_count + 1
    });

    if (!success) {
      console.log(`[UserActivation.Renew]: Cannot update user activation(email=${userActivation.email})`);
      return false;
    }

    const content = `<p>Click <a href="http://localhost:8080/users/activation?token=${activationToken}&email=${userActivation.email}">this link</a> to activate your account</p>`;
    success = await mailer.sendMail(userActivation.email, 'User Activation - Renew', content);

    if (!success) {
      console.log(`[UserActivation.Renew]: Cannot send renew user activation mail(to=${userActivation.email})`);
      return false;
    }

    return true;
  } catch (e) {
    console.log(`[UserActivation.Renew]: Cannot update user activation(email=${userActivation.email}). ${e.message}`);
    return false;
  }
};

const userActivationValidator = (req, res, next) => {
  const { token, email } = req.query;
  if (!token || !email) {
    res.redirect('/login');
  }

  next();
};

const userActivation = async (req, res) => {
  const { token, email } = req.query;
  try {
    let resp;
    let success;
    const userActivation = await userRepo.findUserActivationByEmail(email);
    if (!userActivation) {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[UserActivation]:  User(${email}) not found to proceed activation`);
      resp.setOperStatusCode('UserActivationCode.NotFound');
      res.render('user_activation', { title: 'User Activation', ...resp });
      return;
    }

    if (userActivation.status === 'processed') {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.SUCCESS);
      resp.setOperMessage('[UserActivation]: Your account was already activated');
      resp.setOperStatusCode('UserActivationCode.Processed');
      res.render('user_activation', { title: 'User Activation', ...resp });
      return;
    }

    if (userActivation.status === 'cancelled') {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[UserActivation]: Expired user activation code');
      resp.setOperStatusCode('UserActivationCode.Cancelled');
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
      resp.setOperStatusCode('UserActivationCode.Cancelled');
      res.render('user_activation', { title: 'User Activation', ...resp });
      return;
    }

    const { email: uEmail } = encryption.verifyToken(token, userActivation.activation_code);
    const matched = uEmail === email;
    if (!matched) {
      await userRepo.updateUserActivation(userActivation.pk, { retry_count: userActivation.retry_count + 1 });
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[UserActivation]: Wrong user activation code');
      resp.setOperStatusCode('UserActivationCode.Mismatched');
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
    resp.setOperStatusCode('UserActivationCode.Processed');
    res.render('user_activation', { title: 'User Activation', ...resp });
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[UserActivation]: Internal Server Error');
    res.render('user_activation', { title: 'User Activation', ...resp });
  }
};

const getRenew = async (req, res) => {
  const { email } = req.query;
  let resp, success;

  if (!email) {
    resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[UserActivation.Renew]: Email not found');
    res.render('user_activation_renew', resp);
    return;
  }

  try {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[UserActivation.Renew]: User(${email}) not found to renew activation`);
      resp.setOperStatusCode('UserActivationCode.Renew.UserNotFound');
      res.render('user_activation_renew', resp);
      return;
    }

    const userActivation = await userRepo.findUserActivationByEmail(email);
    if (!userActivation) {
      success = await createUserActivation(email);
      if (!success) {
        resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage(`[UserActivation.Renew]: Cannot renew user activation`);
        resp.setOperStatusCode('UserActivationCode.Renew.MailNotSent');
        res.render('user_activation_renew', resp);
        console.log('[UserActivation.Renew]: cannot create user activation and send email to user');
        return;
      }

      success = await userRepo.updateUser(user.pk, { status: 'demo' });
      if (!success) {
        resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage(`[UserActivation.Renew]: Cannot renew user activation`);
        resp.setOperStatusCode('UserActivationCode.Renew.UserNotUpdated');
        res.render('user_activation_renew', resp);
        console.log('[UserActivation.Renew]: cannot update user activation status to demo after renew');
        return;
      }

      resp = new Response();
      resp.setOperMessage(`[UserActivation.Renew]: An email has been sent to your email(${email}) to verify and activate your account`);
      res.render('user_activation_renew', resp);
      return;
    }

    if (userActivation.status === 'processed') {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.SUCCESS);
      resp.setOperMessage('[UserActivation.Renew]: Your account is activated successfully. No more renew request');
      resp.setOperStatusCode('UserActivationCode.Renew.Processed');
      res.render('user_activation_renew', resp);
      return;
    }

    if (userActivation.status === 'pending') {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.SUCCESS);
      resp.setOperMessage(`[UserActivation.Renew]: Check your latest user activation email(${email}) to verify and activate your account`);
      resp.setOperStatusCode('UserActivationCode.Renew.Pending');
      res.render('user_activation_renew', resp);
      return;
    }

    success = await renewUserActivation(userActivation);
    if (!success) {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[UserActivation.Renew]: Cannot renew user activation`);
      res.render('user_activation_renew', resp);
      return;
    }

    success = await userRepo.updateUser(user.pk, { status: 'demo' });
    if (!success) {
      resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage(`[UserActivation.Renew]: Cannot renew user activation`);
      resp.setOperStatusCode('UserActivationCode.Renew.UserNotUpdated');
      res.render('user_activation_renew', resp);
      console.log('[UserActivation.Renew]: cannot update user activation status to demo after renew');
      return;
    }

    resp = new Response();
    resp.setOperMessage(`[Signup]: An email has been sent to your email(${email}) to verify and activate your account`);
    res.render('user_activation_renew', resp);
    return;
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[UserActivation.Renew]: Internal Server Error');
    res.render('user_activation_renew', resp);
    return;
  }
};

const getInvitation = (req, res) => {
  const { token } = req.query;
  if (!token) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[MemberInvitation]: Invalid invitation token');
    res.render('invitation', resp);
    return;
  }

  const resp = new Response();
  resp.setOperStatus(Response.OperStatus.SUCCESS);
  resp.setPayload(token);
  res.render('invitation', resp);
};

const invitationTokenValidator = async (req, res, next) => {
  try {
    const { 'invitation-token': token } = req.body;
    const {
      organizationOwnerPk,
      organizationOwnerEmail,
      organizationPk
    } = encryption.verifyToken(token, 'ac7iva7i0nC0d3');

    const user = await userRepo.findUserByEmail(organizationOwnerEmail);
    if (!user) {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[MemberInvitation.Validator]: Invalid invitation token');
      res.render('invitation', resp);
      return;
    }

    if (user.pk !== organizationOwnerPk) {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[MemberInvitation.Validator]: Invalid invitation token');
      res.render('invitation', resp);
      return;
    }

    const organizations = await organizationRepo.findOrganizationsOwnedByUserPk(user.pk);
    const organization = organizations.find(({ pk }) => +pk === +organizationPk);
    if (!organization) {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[MemberInvitation.Validator]: Group Not found');
      res.render('invitation', resp);
      return;
    }

    next();
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[MemberInvitation.Validator]: Internal Server Error');
    resp.setOperStack(e.stack);
    res.render('invitation', resp);
  }
};

const signupAndAddMemberToOrganization = async (req, res) => {
  /**
   * Base on `postSignup`
   * with default password as 12345678
   * TODO: refactor to re-use from `ssr/index.js`
   */

  try {
    const password = '12345678';
    const body = req.body;
    const { 'invitation-token': token, email } = body;
    const { organizationPk } = encryption.verifyToken(token, 'ac7iva7i0nC0d3');

    const encryptedPassword = await encryption.encrypt(password);
    const success = await userRepo.createUser(email, encryptedPassword);
    if (success) {
      createUserActivation(email);

      const user = await userRepo.findUserByEmail(email);
      const success = await organizationRepo.addUserToOrganization(organizationPk, user.pk);
      if (!success) {
        resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage('[InviteMember]: Cannot add member to the group');
        res.render('invitation', resp);
        return;
      }

      const resp = new Response();
      resp.setOperMessage(`[InviteMember]: An email has been sent to the email(${email}) to verify and activate the account`);
      res.render('invitation', resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[InviteMember]: Cannot invite member');
      res.render('invitation', resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[InviteMember]: Internal Server Error');
    resp.setOperStack(e.stack);
    res.render('invitation', resp);
  }
};

const remindUserActivation = async (email, activationCode) => {
  try {
    const activationToken = encryption.createToken({ email }, activationCode);
    const content = `<p>Click <a href="http://localhost:8080/users/activation?token=${activationToken}&email=${email}">this link</a> to activate your account</p>`;
    await mailer.sendMail(email, 'Reminder - User Activation', content);
  } catch (e) {
    console.log(`[InviteMember]: Cannot remind user activation(email=${email}). ${e.message}`);
  }
};

const postInvitation = async (req, res, next) => {
  try {
    const { 'invitation-token': token, email } = req.body;
    const { organizationPk } = encryption.verifyToken(token, 'ac7iva7i0nC0d3');
    let resp;

    // Check user valid or not => signup with default password
    const user = await userRepo.findUserByEmail(email);
    console.log(email);
    if (user) {
      if (['banned', 'archived'].includes(user.status)) {
        resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage('[InviteMember]: Inviting member is invalid to add');
        res.render('invitation', resp);
        return
      }

      if (user.status === 'demo') {
        const userActication = await userRepo.findUserActivationByEmail(email);
        await remindUserActivation(email, userActication.activation_code);
      }

      const success = await organizationRepo.addUserToOrganization(organizationPk, user.pk);
      if (!success) {
        resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage('[InviteMember]: Cannot add member to the group');
        res.render('invitation', resp);
        return;
      }

      resp = new Response();
      resp.setOperMessage(`[InviteMember]: Member invitation sent`);
      res.render('invitation', resp);
      return;
    }

    next();
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[InviteMember]: Internal Server Error');
    resp.setOperStack(e.stack);
    res.render('invitation', resp);
  }
};

const ssr = express.Router();
ssr.get('/deprecated-activation', userActivationValidator, userActivation);
ssr.get('/activation/renew', getRenew);
ssr.get('/invitation', getInvitation);
ssr.post('/invitation', invitationTokenValidator, postInvitation, signupAndAddMemberToOrganization);

module.exports = ssr;
