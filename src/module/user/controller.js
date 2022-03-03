const encryption = require('../../../shared/encryption');
const Reponse = require('../../model/Response');
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

module.exports = Controller;
