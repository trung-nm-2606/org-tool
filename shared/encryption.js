const bcrypt = require("bcrypt");

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

module.exports = encryption;
