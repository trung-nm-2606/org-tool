const db = require('../../shared/db');
const DaoError = require('../../model/error/DaoError');

const Dao = {};

Dao.findOrganizationByPk = async (pk) => {
  const query = `select * from organizations where pk = ?`;
  let organizations = [];

  try {
    organizations = await db.query(query, [pk]);
  } catch (e) {
    throw new DaoError(`Cannot get organization by pk(${pk})`, e);
  }

  return organizations[0];
};

Dao.findMembersByOrganizationPk = async (organizationPk, memberPk = '') => {
  const query = `select ou.*, u.* from organizations_users as ou
  left join users u on ou.user_pk = u.pk
  where ou.organization_pk = ? and u.status = 'active'
  ${memberPk ? ' and ou.user_pk = ?' : ''}`;
  const args = [organizationPk];
  if (memberPk) args.push(memberPk);

  try {
    const members = await db.query(query, args);
    return members;
  } catch (e) {
    throw new DaoError(`Cannot get members of organization(pk=${organizationPk})`, e);
  }
}

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
