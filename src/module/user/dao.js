const db = require('../../shared/db');
const InternalServerError = require("../../model/error/InternalServerError");
const NotFoundError = require("../../model/error/NotFoundError");

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
    throw new InternalServerError(`Cannot create user activation for email(${email})`, e);
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
    throw new InternalServerError(`Cannot create user(email=${email})`, e);
  }

  return insertedUser;
};

module.exports = Dao;
