const encryption = require('../../shared/encryption');
const mailer = require('../../shared/mailer');

const Service = {};

Service.generateUserActivationCode = () => `${Math.round(Math.random() * 1E9)}`;

Service.generateUserActivationToken = (email, activationCode) => {
  return encryption.createToken({ email, activationCode }, activationCode);
}

Service.parseUserActivationToken = (token, activationCode) => {
  return encryption.verifyToken(token, activationCode);
};

Service.sendUserActivationEmail = (email, activationToken, subjectSuffix) => {
  const subject = subjectSuffix ? `User Activation - ${subjectSuffix}` : 'User Activation';
  const content = `<p>Click <a href="http://localhost:8080/users/activate?token=${activationToken}&email=${email}">this link</a> to activate your account</p>`;

  try {
    mailer.sendMail(email, subject, content);
  } catch (e) {
    throw e;
  }
};

Service.generateUserInvitationToken = (organizationOwnerPk, organizationOwnerEmail, organizationPk) => {
  return encryption.createToken({
    organizationOwnerPk,
    organizationOwnerEmail,
    organizationPk
  }, 'ac7iva7i0nC0d3');
};

Service.parseUserInvitationToken = (token) => {
  return encryption.verifyToken(token, 'ac7iva7i0nC0d3');
};

module.exports = Service;
