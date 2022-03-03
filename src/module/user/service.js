const encryption = require('../../shared/encryption');
const mailer = require('../../shared/mailer');
const Dao = require('./dao');

const Service = {};

Service.createUserActivation = async (email, activationCode) => {
  const code = activationCode || `${Math.round(Math.random() * 1E9)}`;
  const activationToken = encryption.createToken({ email }, code);
  const content = `<p>Click <a href="http://localhost:8080/users/activation?token=${activationToken}&email=${email}">this link</a> to activate your account</p>`;

  try {
    await Dao.createUserActivation(email, code);
    await mailer.sendMail(email, 'User Activation', content);
  } catch (e) {
    throw e;
  }
};

module.exports = Service;
