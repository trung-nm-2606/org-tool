const db = require('../../shared/db');
const DaoError = require('../../model/error/DaoError');

const Dao = {};

Dao.findOrganizationsOwnedByUserPk = async (userPk) => {
  const query = `select * from organizations as o
  left join organizations_users ou on o.pk = ou.organization_pk
  where ou.role = ? and ou.user_pk = ?`;

  try {
    const organizations = await db.query(query, ['owner', userPk]);
    return organizations;
  } catch (e) {
    throw new DaoError(`Cannot get organizations owned by user(pk=${userPk})`, e);
  }
};

Dao.addUserToOrganization = async (organizationPk, userPk) => {
  const query = 'insert into organizations_users(organization_pk, user_pk, role) values(?,?,?)';

  try {
    await db.query(query, [organizationPk, userPk, 'member']);
  } catch (e) {
    throw new DaoError(`Cannot add member(pk=${userPk}) to organization(pk=${organizationPk})`, e);
  }

  return true;
};

module.exports = Dao;
