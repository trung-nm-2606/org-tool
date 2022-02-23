const db = require('../shared/db');

const repo = {};

repo.findUserByEmail = async (email) => {
  const query = 'select * from users where email = ?';
  try {
    const users = await db.query(query, [email]);
    return users[0];
  } catch (e) {
    console.log(`[UserRepo]: Cannot find user by email(${email}). ${e.message}`);
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
    console.log(`[UserRepo]: Cannot create user. ${e.message}`);
    return false;
  }
};

module.exports = repo;
