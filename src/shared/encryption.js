const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const encryption = {};

encryption.encrypt = async (value) => {
  const salt = await bcrypt.genSalt(10);
  const encryptedValue = await bcrypt.hash(value, salt);
  return encryptedValue;
};

encryption.compare = async (value, encryptedValue) => {
  const matched = await bcrypt.compare(value, encryptedValue);
  return matched;
};

encryption.createToken = (data, privateKey) => {
  try {
    return jwt.sign(data, privateKey);
  } catch (e) {
    console.log(`[Encryption.JWT]: Cannot create JWT token for data(${data}) with key(${privateKey})`);
    return '';
  }
};

encryption.verifyToken = (token, privateKey) => {
  try {
    return jwt.verify(token, privateKey)
  } catch (e) {
    console.log(`[Encryption.JWT]: Cannot verify JWT token(${token}) with key(${privateKey})`);
    console.log(e.stack);
    return {};
  }
};

module.exports = encryption;
