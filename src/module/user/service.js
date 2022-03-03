const encryption = require('../../shared/encryption');
const mailer = require('../../shared/mailer');

const Service = {};

Service.generateUserActivationCode = () => `${Math.round(Math.random() * 1E9)}`;

Service.generateUserActivationToken = (email, activationCode) => {
  return encryption.createToken({ email, activationCode }, activationCode);
}

Service.sendUserActivationEmail = (email, activationToken, subjectSuffix) => {
  const subject = subjectSuffix ? `User Activation - ${subjectSuffix}` : 'User Activation';
  const content = `<p>Click <a href="http://localhost:8080/users/activate?token=${activationToken}&email=${email}">this link</a> to activate your account</p>`;

  try {
    mailer.sendMail(email, subject, content);
  } catch (e) {
    throw e;
  }
};

module.exports = Service;
