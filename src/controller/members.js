const session = require('../../shared/session');
const Response = require('../../shared/Response');
const userRepo = require('../../repo/users');
const organizationRepo = require('../../repo/organizations');
const encryption = require('../../shared/encryption');
const mailer = require('../../shared/mailer');

const getMembers = async (req, res) => {
  try {
    const { organizationPk } = req.params;
    const members = await organizationRepo.findMembersByOrganizationPk(organizationPk);
    const resp = new Response();
    resp.setPayload(members);
    res.json(resp);
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[GetMembers]: Internal Server Error');
    res.status(500).json(resp);
  }
};

const organizationValidator = async (req, res, next) => {
  const { organizationPk } = req.params;
  if (!organizationPk || +organizationPk <= 0) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[InviteMember.Validation]: Invalid group');
    res.status(404).json(resp);
    return;
  }

  const organization = await organizationRepo.findOrganizationByPk(organizationPk);
  if (!organization) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[InviteMember.Validation]: Group Not found');
    res.status(404).json(resp);
    return;
  }

  next();
};

const organizationOwnerValidator = async (req, res, next) => {
  const { organizationPk, memberPk } = req.params;
  const organization = await organizationRepo.findOrganizationByPk(organizationPk);
  if (!organization) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[MemberOperation.Validation]: Group Not found');
    res.status(404).json(resp);
    return;
  }

  const authenticatedUser = session.getAuthenticatedUser(req);
  if (organization.created_by !== authenticatedUser.pk) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[MemberOperation.Validation]: Cannot operate on group you did not create');
    res.status(403).json(resp);
    return;
  }

  if (memberPk !== undefined && +memberPk === authenticatedUser.pk) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[RemoveMember]: Cannot remove yourself from group');
    res.status(422).json(resp);
    return;
  }

  next();
};

const emailValidator = (req, res, next) => {
  const body = req.body;
  const { email } = body;

  if (!email) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[InviteMember.Validation]: Invalid email');
    res.status(400).json(resp);
    return;
  }

  next();
};

const createUserActivation = async (email) => {
  try {
    const activationCode = `${Math.round(Math.random() * 1E9)}`;
    const activationToken = encryption.createToken({ email }, activationCode);
    await userRepo.createUserActivation(email, activationCode);
    const content = `<p>Click <a href="http://localhost:8080/users/activation?token=${activationToken}&email=${email}">this link</a> to activate your account</p>`;
    await mailer.sendMail(email, 'User Activation', content);
  } catch (e) {
    console.log(`[InviteMember]: Cannot create user activation(email=${email}). ${e.message}`);
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

const invitationValidator = async (req, res, next) => {
  const body = req.body;
  const { email } = body;
  const { organizationPk } = req.params;

  try {
    const user = await userRepo.findUserByEmail(email);
    if (user) {
      let resp;
      // User with given email already existed
      // Check user status and add member

      const authenticatedUser = session.getAuthenticatedUser(req);
      if (user.pk === authenticatedUser.pk) {
        resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage('[InviteMember]: Cannot add yourself to group');
        res.json(resp);
        return;
      }

      if (['banned', 'archived'].includes(user.status)) {
        resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage('[InviteMember]: Inviting member is invalid to add');
        res.json(resp);
        return
      }

      if (user.status === 'demo') {
        const userActication = await userRepo.findUserActivationByEmail(email);
        await remindUserActivation(email, userActication.activation_code);
      }

      const success = organizationRepo.addUserToOrganization(organizationPk, user.pk);
      if (!success) {
        resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage('[InviteMember]: Cannot add member to the group');
        res.json(resp);
        return;
      }

      resp = new Response();
      resp.setOperMessage(`[InviteMember]: Member invitation sent`);
      res.json(resp);
      return;
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[InviteMember]: Internal Server Error');
    res.json(resp);
    return
  }

  next();
};

const postInviteMember = async (req, res) => {
  /**
   * Base on `postSignup`
   * with default password as 12345678
   * TODO: refactor to re-use from `ssr/index.js`
   */
  const password = '12345678';
  const body = req.body;
  const { email } = body;
  const { organizationPk } = req.params;

  try {
    const encryptedPassword = await encryption.encrypt(password);
    const success = await userRepo.createUser(email, encryptedPassword);
    if (success) {
      createUserActivation(email);

      const user = await userRepo.findUserByEmail(email);
      const success = organizationRepo.addUserToOrganization(organizationPk, user.pk);
      if (!success) {
        resp = new Response();
        resp.setOperStatus(Response.OperStatus.FAILED);
        resp.setOperMessage('[InviteMember]: Cannot add member to the group');
        res.json(resp);
        return;
      }

      const resp = new Response();
      resp.setOperMessage(`[InviteMember]: An email has been sent to the email(${email}) to verify and activate the account`);
      res.json(resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[InviteMember]: Cannot invite member');
      res.json(resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[InviteMember]: Internal Server Error');
    res.render(resp);
  }
};

const removeMember = async (req, res) => {
  try {
    const { organizationPk, memberPk } = req.params;
    const success = await organizationRepo.removeUserFromOrganization(organizationPk, memberPk);
    if (success) {
      const resp = new Response();
      resp.setOperMessage(`[RemoveMember]: Member removed from group successullfy`);
      res.json(resp);
    } else {
      const resp = new Response();
      resp.setOperStatus(Response.OperStatus.FAILED);
      resp.setOperMessage('[RemoveMember]: Cannot remove member from group');
      res.json(resp);
    }
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[RemoveMember]: Internal Server Error');
    res.render(resp);
  }
};

const postInvitationToken = async (req, res) => {
  try {
    const { organizationPk } = req.params;
    const authenticatedUser = session.getAuthenticatedUser(req);
    const token = encryption.createToken({
      organizationOwnerPk: authenticatedUser.pk,
      organizationOwnerEmail: authenticatedUser.email,
      organizationPk
    }, 'ac7iva7i0nC0d3');
    const invitationTokenUrl = `http://localhost:8080/users/invitation?token=${token}`;
    const resp = new Response();
    resp.setPayload(invitationTokenUrl);
    res.json(resp);
  } catch (e) {
    const resp = new Response();
    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage('[InvitationToken]: Internal Server Error');
    res.render(resp);
  }
};

const controller = {};

controller.getMembers = [session.authenticateUser, getMembers];
controller.postInviteMember = [session.authenticateUser, emailValidator, organizationValidator, organizationOwnerValidator, invitationValidator, postInviteMember];
controller.removeMember = [session.authenticateUser, organizationOwnerValidator, removeMember];
controller.postInvitationToken = [session.authenticateUser, organizationOwnerValidator, postInvitationToken];

module.exports = controller;
