const db = require('../shared/db');
const dateUtils = require('../shared/date_utils');

const repo = {};

repo.findUserByEmail = async (email) => {
  const query = 'select * from users where email = ?';
  try {
    const users = await db.query(query, [email]);
    return users[0];
  } catch (e) {
    console.log(`[UserRepo]: Cannot find user(email=${email}). ${e.message}`);
    return null;
  }
};

repo.createUser = async (email, encryptedPassword) => {
  const query = 'insert into users(email, encrypted_password) values(?,?)';
  try {
    const result = await db.query(query, [email, encryptedPassword]);
    if (result.insertId > 0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(`[UserRepo]: Cannot create user(email=${email}). ${e.message}`);
    return false;
  }
};

const FIELD_MAPPINGS = { fullName: 'full_name' };

repo.updateUser = async (userPk, updateInfo) => {
  const fields = [];
  const args = [];
  for (let key in updateInfo) {
    const field = FIELD_MAPPINGS[key] || key;
    fields.push(`${field}=COALESCE(?, ${field})`);
    args.push(updateInfo[key]);
  }
  const updateFields = fields.join(',')
  const query = `update users set ${updateFields}, updated_at = ? where pk = ?`;
  args.push(dateUtils.getMariaDbCurrentTimestamp());
  args.push(userPk);

  try {
    db.query(query, args);
    return true;
  } catch (e) {
    console.log(`[UserRepo]: Cannot update user(pk=${userPk}). ${e.message}`);
    return false;
  }
};

repo.createUserActivation = async (email, encryptedActivationCode) => {
  const query = 'insert into user_activations(email, activation_code) values(?,?)';
  try {
    const result = await db.query(query, [email, encryptedActivationCode]);
    if (result.insertId > 0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(`[UserRepo]: Cannot create user activation(email=${email}). ${e.message}`);
    return false;
  }
};

repo.findUserActivationByEmail = async (email) => {
  const query = 'select ua.*, users.pk as user_pk from user_activations as ua left join users on ua.email = users.email  where ua.email = ?';
  try {
    const userActivations = await db.query(query, [email]);
    return userActivations[0];
  } catch (e) {
    console.log(`[UserRepo]: Cannot find user activation(email=${email}). ${e.message}`);
    return null;
  }
};

repo.updateUserActivation = async (userActivationPk, updateInfo) => {
  const fields = [];
  const args = [];
  for (let key in updateInfo) {
    const field = FIELD_MAPPINGS[key] || key;
    fields.push(`${field}=COALESCE(?, ${field})`);
    args.push(updateInfo[key]);
  }
  const updateFields = fields.join(',')
  const query = `update user_activations set ${updateFields}, updated_at = ? where pk = ?`;
  args.push(dateUtils.getMariaDbCurrentTimestamp());
  args.push(userActivationPk);

  try {
    db.query(query, args);
    return true;
  } catch (e) {
    console.log(`[UserRepo]: Cannot update user activation(pk=${userActivationPk}). ${e.message}`);
    return false;
  }
};

module.exports = repo;
