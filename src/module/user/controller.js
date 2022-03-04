const encryption = require('../../../shared/encryption');
const session = require('../../../shared/session');
const BadRequestError = require('../../model/error/BadRequestError');
const Response = require('../../model/Response');
const BaseController = require('../base/controller');
const Dao = require('./dao');
const Service = require('./service');
const OrganizationDao = require('../organization/dao');
const NotFoundError = require('../../model/error/NotFoundError');

const Controller = {};

Controller.createUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const encryptedPassword = await encryption.encrypt(password);
    await Dao.createUser(email, encryptedPassword);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.generateUserActivation = async (req, res, next) => {
  const { email } = req.body;
  const { view: { resp } } = res.locals;
  const activationCode = Service.generateUserActivationCode();
  const activationToken = Service.generateUserActivationToken(email, activationCode);

  try {
    await Dao.createUserActivation(email, activationCode);
    Service.sendUserActivationEmail(email, activationToken);

    resp.setOperMessage(`An email has been sent to your email(${email}) to verify and activate your account`);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.activateUser = async (req, res, next) => {
  const { userActivation, view: { resp } } = res.locals;

  if (userActivation.status === 'processed') {
    resp.setOperMessage(`Your account was already activated`);
    resp.setOperCode('UserActivationCode.Processed');
    next();
    return;
  }

  try {
    await Dao.updateUserActivation(userActivation.pk, { status: 'processed' });
    await Dao.updateUser(userActivation.user_pk, { status: 'active' });
    resp.setOperMessage('Your account is activated successfully');
    resp.setOperCode('UserActivationCode.Processed');
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.renewUserActivation = async (req, res, next) => {
  const { email } = req.query;
  const { user, userActivation, view: { resp } } = res.locals;

  if (userActivation) {
    const activationCode = Service.generateUserActivationCode();
    const activationToken = Service.generateUserActivationToken(email, activationCode);

    try {
      await Dao.updateUserActivation(userActivation.pk, {
        activation_code: activationCode,
        retry_count: 0,
        status: 'pending',
        renew_count: userActivation.renew_count + 1
      });
      await Dao.updateUser(user.pk, { status: 'demo' });
      Service.sendUserActivationEmail(email, activationToken, 'Renew');

      resp.setOperMessage(`An email has been sent to your email(${email}) to verify and activate your account`);
    } catch (e) {
      next(e);
      return;
    }
  } else {
    req.body.email = email;
    Controller.generateUserActivation(req, res, next);
    return;
  }

  next();
};

Controller.handleFailedActivation = async (err, req, res, next) => {
  const { userActivation, needHandleFailedActivation } = res.locals;

  if (userActivation && needHandleFailedActivation) {
    try {
      await Dao.updateUserActivation(userActivation.pk, {
        retry_count: userActivation.retry_count + 1,
        status: (userActivation.retry_count + 1) >= 3 ? 'cancelled' : userActivation.status
      });
    } catch (e) {
      BaseController.logError(e);
    }
  }

  next(err);
};

Controller.logUserIn = async (req, res, next) => {
  const { email, password } = req.body;
  const { view: { resp } } = res.locals;

  try {
    const user = await Dao.findUserByEmail(email);
    const matched = await encryption.compare(password, user.encrypted_password);

    if (matched) {
      session.storeAuthenticatedUser(user, req);
      res.redirect('/'); // Specially here only
      return;
    }

    resp.setOperStatus(Response.OperStatus.FAILED);
    resp.setOperMessage(`Wrong email/password`);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

Controller.logUserOut = (req, res) => {
  session.removeAuthenticatedUser(req);
  res.redirect('/login'); // Specially here only
};

Controller.getInviation = async (req, res, next) => {
  const { token } = req.query;
  const { view: { resp } } = res.locals;

  if (!token) {
    // Specially here only
    // This is too simple to split to a separate validator
    next(new BadRequestError('Invalid invitation token'));
    return;
  }

  const { organizationPk } = Service.parseUserInvitationToken(token);
  let organization = {};
  try {
    organization = await OrganizationDao.findOrganizationByPk(organizationPk);
  } catch (e) {
    BaseController.logError(e);
  }

  resp.setOperStatus(Response.OperStatus.SUCCESS);
  resp.setPayload({ token, groupName: organization.name });

  next();
};

Controller.inviteUser = async (req, res, next) => {
  const { user, organization, view: { resp } } = res.locals;
  const { pk: organizationPk, name } = organization;
  const { pk: userPk, email, status: userStatus } = user;

  if (userStatus === 'demo') {
    try {
      const userActication = await Dao.findUserActivationByEmail(email);
      if (!userActication) throw new NotFoundError(`User activation with email(${email}) is not found to remind activation`);

      const { activation_code: activationCode } = userActication;
      const activationToken = Service.generateUserActivationToken(email, activationCode);
      Service.sendUserActivationEmail(email, activationToken, 'Remind');
    } catch (e) {
      BaseController.logError(e);
    }
  }

  try {
    const [member] = await OrganizationDao.findMembersByOrganizationPk(organizationPk, userPk);
    if (member) {
      resp.setOperMessage(`User with email(${email}) is already a member of group(${name})`);
      next();
      return;
    }
  } catch (e) {
    BaseController.logError(e);
  }

  try {
    await OrganizationDao.addUserToOrganization(organizationPk, userPk);
    resp.setOperMessage(`User with email(${email}) has been added to be a member of group(${name})`);
  } catch (e) {
    next(e);
    return;
  }

  next();
};

module.exports = Controller;
