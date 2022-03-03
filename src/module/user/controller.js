const encryption = require('../../../shared/encryption');
const Reponse = require('../../model/Response');
const BaseController = require('../base/controller');
const Dao = require('./dao');
const Service = require('./service');

const Controller = {};

Controller.signUserUp = async (req, res, next) => {
  const { email, password } = req.body;
  const { view: { resp } } = res.locals;

  try {
    const encryptedPassword = await encryption.encrypt(password);
    const insertedUser = await Dao.createUser(email, encryptedPassword);
    if (insertedUser) {
      await Service.createUserActivation(email);
      resp.setOperMessage(`An email has been sent to your email(${email}) to verify and activate your account`);
    } else {
      resp.setOperStatus(Reponse.OperStatus.FAILED);
      resp.setOperMessage(`Cannot register a new account for email(${email})`);
    }
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

module.exports = Controller;
