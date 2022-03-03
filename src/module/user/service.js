const encryption = require('../../shared/encryption');
const mailer = require('../../shared/mailer');

const Service = {};

Service.generateUserActivationCode = () => `${Math.round(Math.random() * 1E9)}`;

Service.generateUserActivationToken = (email, activationCode) => {
  return encryption.createToken({ email, activationCode }, activationCode);
}

Service.sendUserActivationEmail = async (email, activationToken) => {
  const content = `<p>Click <a href="http://localhost:8080/users/activate?token=${activationToken}&email=${email}">this link</a> to activate your account</p>`;
  try {
    await mailer.sendMail(email, 'User Activation', content);
  } catch (e) {
    throw e;
  }
};

module.exports = Service;
