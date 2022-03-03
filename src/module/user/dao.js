const db = require('../../shared/db');
const dateUtils = require('../../shared/date_utils');
const DaoError = require("../../model/error/DaoError");
const NotFoundError = require("../../model/error/NotFoundError");

const FIELD_MAPPINGS = { fullName: 'full_name' };

const Dao = {};

Dao.findUserByPk = async (pk) => {
  const query = 'select * from users where pk = ?';
  let users = [];

  try {
    users = await db.query(query, [pk]);
  } catch (e) {
    throw new NotFoundError(`User(pk=${pk}) is not found`, e);
  }

  return users[0];
};

Dao.findUserByEmail = async (email) => {
  const query = 'select * from users where email = ?';
  let users = [];

  try {
    users = await db.query(query, [email]);
  } catch (e) {
    throw new NotFoundError(`User(email=${email}) is not found`, e);
  }

  return users[0];
};

Dao.createUserActivation = async (email, activationCode) => {
  const query = 'insert into user_activations(email, activation_code) values(?,?)';
  let result = { insertId: 0 };

  try {
    result = await db.query(query, [email, activationCode]);
  } catch (e) {
    throw new DaoError(`Cannot create user activation for email(${email})`, e);
  }

  return result.insertId > 0;
};

Dao.createUser = async (email, encryptedPassword) => {
  const query = 'insert into users(email, encrypted_password) values(?,?)';
  let insertedUser = null;

  try {
    const result = await db.query(query, [email, encryptedPassword]);
    insertedUser = await Dao.findUserByPk(result.insertId);
  } catch (e) {
    throw new DaoError(`Cannot create user(email=${email})`, e);
  }

  return insertedUser;
};

Dao.updateUser = async (userPk, updateInfo) => {
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
    await db.query(query, args);
  } catch (e) {
    throw new DaoError(`Cannot update user(pk=${userPk})`, e);
  }

  return true;
};

Dao.findUserActivationByEmail = async (email) => {
  const query = `select ua.*, users.pk as user_pk
  from user_activations as ua
  left join users on ua.email = users.email
  where ua.email = ?`;
  let userActivations = [];

  try {
    userActivations = await db.query(query, [email]);
  } catch (e) {
    throw new DaoError(`Cannot find user activation(email=${email})`, e);
  }

  return userActivations[0];
};

Dao.updateUserActivation = async (userActivationPk, updateInfo) => {
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
    await db.query(query, args);
  } catch (e) {
    throw new DaoError(`Cannot update user activation(pk=${userActivationPk})`, e);
  }

  return true;
};

module.exports = Dao;
